import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { apiResponse } from 'src/utils';
import { envConfig } from 'src/config';
import { ImagesService } from './images.service';
import { FileUploadGuard } from './guards/file-upload.guard';
import { fileValidationGuard } from './guards/file-validation.guard';
// types
import type { Response } from 'express';
import type { CurrentUser, FileUploadAuth } from 'src/types';
import { JwtGuard } from 'src/common';

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
    // validate file
    fileValidationGuard(file);
    const apiKey = { userId: req.apiKey.userId, apiKeyId: req.apiKey.id };

    // save image to database
    const image = await this.imagesService.uploadImage(apiKey, file);

    // generate url
    const url = `${envConfig.APP_URL}/images/${image.imgToken}`;

    const message = 'Image uploaded successfully.';
    return apiResponse(201, {
      data: { image: { ...image, url } },
      message,
    })(res);
  }

  @Get()
  @UseGuards(JwtGuard)
  async handleGetImages(
    @Req() req: CurrentUser,
    @Res() res: Response,
  ): Promise<Response> {
    const images = await this.imagesService.getImagesByUserId(req.user.id);
    return apiResponse(200, { data: { images } })(res);
  }
}
