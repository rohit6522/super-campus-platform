import { Test, TestingModule } from '@nestjs/testing';
import { ResumesService } from './resumes.service.js';

describe('ResumesService', () => {
  let service: ResumesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResumesService],
    }).compile();

    service = module.get<ResumesService>(ResumesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
