import { Test, TestingModule } from '@nestjs/testing';
import { FacultyController } from './faculty.controller.js';

describe('FacultyController', () => {
  let controller: FacultyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacultyController],
    }).compile();

    controller = module.get<FacultyController>(FacultyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
