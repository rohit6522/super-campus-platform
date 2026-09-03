import { Test, TestingModule } from '@nestjs/testing';
import { AtsController } from './ats.controller.js';

describe('AtsController', () => {
  let controller: AtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtsController],
    }).compile();

    controller = module.get<AtsController>(AtsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
