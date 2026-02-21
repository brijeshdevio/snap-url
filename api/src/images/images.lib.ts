import { envConfig } from '../config';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../constants';

export const getUrl = (imgId: string): string => {
  return `${envConfig.APP_URL}/images/${imgId}`;
};

import { BadRequestException } from '@nestjs/common';

export const fileValidation = (file: Express.Multer.File): void => {
  if (!file) {
    throw new BadRequestException('File is required. Please upload a file.');
  }

  if (!ALLOWED_MIME_TYPES.includes(file?.mimetype)) {
    throw new BadRequestException(
      'Only image files are allowed. PNG, JPEG, JPG, and GIF are supported.',
    );
  }

  if (file?.size > MAX_FILE_SIZE) {
    throw new BadRequestException(
      `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    );
  }
};
