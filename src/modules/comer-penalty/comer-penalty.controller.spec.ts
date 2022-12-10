import { Test, TestingModule } from '@nestjs/testing';
import { ComerPenaltyController } from './comer-penalty.controller';

describe('ComerPenaltyController', () => {
  let controller: ComerPenaltyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComerPenaltyController],
    }).compile();

    controller = module.get<ComerPenaltyController>(ComerPenaltyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
