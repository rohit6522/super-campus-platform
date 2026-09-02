import { Test, TestingModule } from '@nestjs/testing';
import { TimetableService } from './timetable.service.js';

describe('TimetableService', () => {
  let service: TimetableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimetableService],
    }).compile();

    service = module.get<TimetableService>(TimetableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
