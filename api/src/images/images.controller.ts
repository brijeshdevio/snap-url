import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { apiResponse } from '../lib';
import { MESSAGES } from '../constants';
import { ImagesService } from './images.service';
import { ProjectId } from './decorators';
import { UploadGuard } from './guards';
import { fileValidation, getUrl } from './images.lib';
import { JwtAuthGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';
import type { Response } from 'express';
import { envConfig } from '../config';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseGuards(UploadGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @ProjectId() projectId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    fileValidation(file);
    const image = await this.imagesService.upload(projectId, file);
    const url = getUrl(image.id);
    return apiResponse(201, {
      data: {
        url,
        ...image,
      },
      message: MESSAGES.IMAGE_UPLOAD_SUCCESS,
    });
  }

  @Get(':id')
  async preview(@Param('id') id: string, @Res() res: Response): Promise<any> {
    const data = await this.imagesService.preview(id);
    const buffer = Buffer.from(data);
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'max-age=900');
    res.setHeader('Access-Control-Allow-Origin', envConfig.FRONTEND_URL);
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.end(buffer);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser('sub') userId: string) {
    const data = await this.imagesService.findAll(userId);
    return apiResponse(200, { data });
  }

  @Get(':id/meta')
  @UseGuards(JwtAuthGuard)
  async findOne(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    const image = await this.imagesService.findOne(userId, id);
    return apiResponse(200, { data: { image } });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    await this.imagesService.delete(userId, id);
    return apiResponse(200, { message: MESSAGES.IMAGE_DELETE_SUCCESS });
  }
}
