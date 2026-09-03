import { Test, TestingModule } from '@nestjs/testing';
import { ResumesController } from './resumes.controller.js';

describe('ResumesController', () => {
  let controller: ResumesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResumesController],
    }).compile();

    controller = module.get<ResumesController>(ResumesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
