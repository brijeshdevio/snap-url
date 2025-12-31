import { Test, TestingModule } from '@nestjs/testing';
import { UploadTokenController } from './upload-token.controller';
import { UploadTokenService } from './upload-token.service';

describe('UploadTokenController', () => {
  let controller: UploadTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadTokenController],
      providers: [UploadTokenService],
    }).compile();

    controller = module.get<UploadTokenController>(UploadTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
