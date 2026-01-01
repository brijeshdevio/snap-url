import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadTokenService } from './upload-token.service';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { type CreateTokenDto, CreateTokenSchema } from './dto/create-token.dto';
import { ApiResponse } from '@/utils/api-response';
import type { Response } from 'express';
import { AuthGuard } from '@/common/guard/auth.guard';
import { UploadGuard } from '@/common/guard/upload.guard';
import axios, { AxiosError } from 'axios';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudinary } from '@/config/cloudinary.config';
import { Readable } from 'stream';
import type { UploadImageRequest } from '@/types';
import { ALLOWED_MIME_TYPES, getURL, MAX_FILE_SIZE } from '@/constants';
import { UserService } from '@/user/user.service';
import { ImageService } from '@/image/image.service';

// Constants for better maintainability
const CACHE_MAX_AGE = 31536000; // 1 year in seconds
const UPLOAD_FOLDER = 'snap-url';
const CLOUDINARY_RESOURCE_TYPE = 'auto';
// const IMAGE_PROXY_TIMEOUT = 10000; // 10 seconds timeout for image fetching

@Controller('uploads')
export class UploadTokenController {
  private readonly logger = new Logger(UploadTokenController.name);
  constructor(
    private readonly uploadTokenService: UploadTokenService,
    private readonly userService: UserService,
    private readonly imageService: ImageService,
  ) {}

  @UseGuards(AuthGuard)
  @Post(':apiKey/sign')
  async handleCreate(
    @Req() req: { user: { id: string } },
    @Param('apiKey') apiKey: string,
    @Body(new ZodValidationPipe(CreateTokenSchema))
    body: CreateTokenDto,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.uploadTokenService.create(
      req.user.id,
      apiKey,
      body,
    );
    return ApiResponse(201, { data })(res);
  }

  @UseGuards(UploadGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handleUpload(
    @Req() req: UploadImageRequest,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      /** 1️⃣ Validate input with early returns */
      await this.validateFile(req.token.user, file);

      /** 2️⃣ Upload to Cloudinary */
      const uploadResult = await this.uploadToCloudinary(file);

      /** 3️⃣ Prepare and save image data */
      const imageData = this.createImageData(file, uploadResult);
      const imageTokenHash = await this.imageService.upload(
        req.token,
        imageData,
      );

      /** 4️⃣ Return response */
      const response = this.createSuccessResponse(
        file,
        uploadResult,
        imageData,
      );

      return ApiResponse(200, {
        data: { ...response, imageId: imageTokenHash },
      })(res);
    } catch (error) {
      this.logger.error(`Upload failed: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  /** ✅ File Validation */
  private async validateFile(
    user: string,
    file: Express.Multer.File,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    await this.userService.checkAndAddStorageSize(user, file.size);
  }

  /** ☁️ Optimized Cloudinary Upload */
  private async uploadToCloudinary(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: UPLOAD_FOLDER,
          resource_type: CLOUDINARY_RESOURCE_TYPE,
          // Optional optimizations:
          transformation: [
            { quality: 'auto', fetch_format: 'auto' }, // Auto optimize
          ],
        },
        (error, result) => {
          if (error) {
            this.logger.error(`Cloudinary upload failed: ${error.message}`);
            reject(new BadRequestException(`Upload failed: ${error.message}`));
            return;
          }

          if (!result) {
            reject(new Error('Cloudinary returned empty result'));
            return;
          }

          resolve(result);
        },
      );

      // Use buffer directly instead of creating Readable stream
      if (file.buffer) {
        uploadStream.end(file.buffer);
      } else {
        // Fallback for disk storage
        const readableStream = Readable.from(file.buffer);
        readableStream.pipe(uploadStream);
      }
    });
  }

  /** 📊 Create Image Data Object */
  private createImageData(file: Express.Multer.File, uploadResult: any) {
    return {
      size: file.size,
      mimeType: file.mimetype,
      width: uploadResult.width,
      height: uploadResult.height,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      displayName: uploadResult.display_name || file.originalname,
    };
  }

  /** ✅ Create Success Response */
  private createSuccessResponse(
    file: Express.Multer.File,
    uploadResult: any,
    imageData,
  ) {
    return {
      size: file.size,
      mimeType: file.mimetype,
      width: uploadResult.width,
      height: uploadResult.height,
      url: getURL(imageData.displayName),
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      // Include additional useful info
      timestamp: new Date().toISOString(),
    };
  }

  /** 📤 Set Image Headers */
  private setImageHeaders(res: Response, axiosResponse: any): void {
    const headers = {
      'Content-Type': axiosResponse.headers['content-type'],
      'Content-Length': axiosResponse.headers['content-length'],
      'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`,
      'Last-Modified':
        axiosResponse.headers['last-modified'] || new Date().toUTCString(),
      ETag: axiosResponse.headers['etag'] || `"${Date.now()}"`,
    };

    Object.entries(headers).forEach(([key, value]) => {
      if (value) {
        res.setHeader(key, value);
      }
    });
  }

  /** ❌ Error Handling for Image Fetch */
  private handleImageFetchError(
    error: any,
    dName: string,
    res: Response,
  ): void {
    this.logger.error(`Failed to fetch image ${dName}: ${error.message}`);

    // Check if response has already been sent
    if (res.headersSent) {
      return;
    }

    // Handle specific error types
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.code === 'ECONNABORTED') {
        res.status(504).json({ error: 'Image source timeout' });
        return;
      }

      if (axiosError.response?.status === 404) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      if (axiosError.response?.status === 403) {
        res.status(403).json({ error: 'Access to image denied' });
        return;
      }
    }

    // Default error response
    if (error instanceof BadRequestException) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to retrieve image' });
    }
  }

  /** 🔍 Health Check for Image Service */
  @Get('health/check')
  healthCheck(): { status: string; timestamp: string } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
