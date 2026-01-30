import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { envConfig } from 'src/config';
import { AuthGuard } from 'src/common/guards';
import { ZodValidationPipe } from 'src/common/pipes';
import { apiResponse } from 'src/utils';
import { ImagesService } from './images.service';
import { FileUploadGuard } from './guards/file-upload.guard';
import { fileValidationGuard } from './guards/file-validation.guard';
import { QueryImageSchema } from './dto';
import type { Response } from 'express';
import type { CurrentUser, FileUploadAuth } from 'src/types';
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
    const url = `${envConfig.APP_URL}/images/${image.signKey}`;
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
}
