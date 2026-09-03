import { Test, TestingModule } from '@nestjs/testing';
import { PlacementsService } from './placements.service.js';

describe('PlacementsService', () => {
  let service: PlacementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlacementsService],
    }).compile();

    service = module.get<PlacementsService>(PlacementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
