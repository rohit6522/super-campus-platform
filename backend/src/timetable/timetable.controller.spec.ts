import { Test, TestingModule } from '@nestjs/testing';
import { TimetableController } from './timetable.controller.js';

describe('TimetableController', () => {
  let controller: TimetableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimetableController],
    }).compile();

    controller = module.get<TimetableController>(TimetableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
