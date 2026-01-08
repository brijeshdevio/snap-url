import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Header,
  Logger,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ImageService } from './image.service';
import axios, { AxiosError } from 'axios';
import type { Response } from 'express';
import { AuthGuard } from '@/common/guard/auth.guard';
import { ApiResponse } from '@/utils/api-response';

const CACHE_MAX_AGE = 31536000; // 1 year in seconds
const IMAGE_PROXY_TIMEOUT = 10000; // 10 seconds timeout for image fetching

@Controller('images')
export class ImageController {
  private readonly logger = new Logger(ImageController.name);
  constructor(private readonly imageService: ImageService) {}

  @UseGuards(AuthGuard)
  @Get()
  async handleGetAll(
    @Req() req: { user: { id: string } },
    @Res() res: Response,
  ): Promise<Response> {
    const user = req.user.id;
    const images = await this.imageService.getAll(user);
    return ApiResponse(200, { data: images })(res);
  }

  @Get(':dName')
  @Header('Cache-Control', `public, max-age=${CACHE_MAX_AGE}`)
  async handleGetImage(
    @Param('dName') dName: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const url = await this.imageService.getImageUrl(dName);

      // Fetch image with timeout
      const response = await axios.get(url, {
        responseType: 'stream',
        timeout: IMAGE_PROXY_TIMEOUT,
        validateStatus: (status) => status === 200, // Only accept 200 OK
      });

      // Set headers from response
      this.setImageHeaders(res, response);

      // Pipe the image stream to response
      response.data.pipe(res);

      // Handle stream errors
      response.data.on('error', (error: Error) => {
        this.logger.error(`Stream error for ${dName}: ${error.message}`);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to stream image' });
        }
      });
    } catch (error) {
      this.handleImageFetchError(error, dName, res);
    }
  }

  @Delete(':imageTokenHash')
  async handleDeleteImage(
    @Param('imageTokenHash') imageTokenHash: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.imageService.deleteImage(imageTokenHash);
    return ApiResponse(204, { message: 'Image deleted successfully' })(res);
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
}
