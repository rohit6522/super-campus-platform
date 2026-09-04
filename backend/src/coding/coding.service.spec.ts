import { Test, TestingModule } from '@nestjs/testing';
import { CodingService } from './coding.service.js';

describe('CodingService', () => {
  let service: CodingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodingService],
    }).compile();

    service = module.get<CodingService>(CodingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
