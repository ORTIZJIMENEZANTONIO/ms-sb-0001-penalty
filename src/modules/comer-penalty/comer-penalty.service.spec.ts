import { Test, TestingModule } from '@nestjs/testing';
import { ComerPenaltyService } from './comer-penalty.service';

describe('ComerPenaltyService', () => {
  let service: ComerPenaltyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComerPenaltyService],
    }).compile();

    service = module.get<ComerPenaltyService>(ComerPenaltyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
