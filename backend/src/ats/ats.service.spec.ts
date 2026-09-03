import { Test, TestingModule } from '@nestjs/testing';
import { AtsService } from './ats.service.js';

describe('AtsService', () => {
  let service: AtsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtsService],
    }).compile();

    service = module.get<AtsService>(AtsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
