import { BadRequestException } from '@nestjs/common';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../../constants';

export const fileValidationGuard = (file: Express.Multer.File): void => {
  if (!file) {
    throw new BadRequestException('File is required.');
  }

  if (!ALLOWED_MIME_TYPES.includes(file?.mimetype)) {
    throw new BadRequestException('Only image files are allowed.');
  }

  if (file?.size > MAX_FILE_SIZE) {
    throw new BadRequestException(
      `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    );
  }
};
