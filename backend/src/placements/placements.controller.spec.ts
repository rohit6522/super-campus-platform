import { Test, TestingModule } from '@nestjs/testing';
import { PlacementsController } from './placements.controller.js';

describe('PlacementsController', () => {
  let controller: PlacementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacementsController],
    }).compile();

    controller = module.get<PlacementsController>(PlacementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
