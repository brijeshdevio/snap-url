import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { envConfig } from '../config';
import { AuthGuard } from '../common/guards';
import { ZodValidationPipe } from '../common/pipes';
import { apiResponse } from '../utils';
import { ImagesService } from './images.service';
import { FileUploadGuard } from './guards/file-upload.guard';
import { fileValidationGuard } from './guards/file-validation.guard';
import { QueryImageSchema } from './dto';
import type { Response } from 'express';
import type { CurrentUser, FileUploadAuth } from '../types';
import type { QueryImageDto } from './dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseGuards(FileUploadGuard)
  @UseInterceptors(FileInterceptor('file'))
  async handleUploadImage(
    @Req() req: FileUploadAuth,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response> {
    fileValidationGuard(file);
    const image = await this.imagesService.saveImage(
      req.project.userId,
      req.project.id,
      file,
    );
    const url = `${envConfig.APP_URL}/images/view/${image.signKey}`;
    const message = 'Image uploaded successfully.';
    return apiResponse(201, {
      data: { image: { ...image, url } },
      message,
    })(res);
  }

  @Get()
  @UseGuards(AuthGuard)
  async handleGetImages(
    @Req() req: CurrentUser,
    @Query(new ZodValidationPipe(QueryImageSchema)) query: QueryImageDto,
    @Res() res: Response,
  ): Promise<Response> {
    const userId = req.user.id;
    const data = await this.imagesService.getImages(userId, query);
    return apiResponse(200, { data })(res);
  }

  @Get('view/:signKey')
  async handleViewImage(
    @Param('signKey') signKey: string,
    @Res() res: Response,
  ): Promise<any> {
    const data = await this.imagesService.viewImage(signKey);
    const buffer = Buffer.from(data);
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', buffer.length);
    res.end(buffer);
  }

  @Get(':imageId')
  @UseGuards(AuthGuard)
  async handleGetImage(
    @Req() req: CurrentUser,
    @Param('imageId') imageId: string,
    @Res() res: Response,
  ): Promise<Response> {
    const userId = req.user.id;
    const image = await this.imagesService.getImage(userId, imageId);
    return apiResponse(200, { data: { image } })(res);
  }

  @Delete(':imageId')
  @UseGuards(AuthGuard)
  async handleDeleteImage(
    @Req() req: CurrentUser,
    @Param('imageId') imageId: string,
    @Res() res: Response,
  ): Promise<Response> {
    const image = await this.imagesService.deleteImage(req.user.id, imageId);
    const message = 'Image deleted successfully.';
    return apiResponse(200, { data: { image }, message })(res);
  }
}
