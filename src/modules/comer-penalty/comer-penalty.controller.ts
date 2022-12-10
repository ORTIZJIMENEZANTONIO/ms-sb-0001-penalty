import { Controller, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { MessagePattern } from '@nestjs/microservices';

import { ComerPenaltyService } from './comer-penalty.service';
import { FinalDate } from './dto/get-final-date.dto';
import { ReleasePenaltyDto } from './dto/release-penalty.dto';

@Controller('comer-penalty')
export class ComerPenaltyController {
  constructor(
    private readonly service: ComerPenaltyService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @MessagePattern({ cmd: 'registerPenalty' })
  async registerPenalty() {}

  @MessagePattern({ cmd: 'updatePenalty' })
  async updatePenalty() {}

  @MessagePattern({ cmd: 'releasePenalty' })
  async releasePenalty(data: ReleasePenaltyDto) {
    return await this.service.releasePenalty(data);
  }

  @MessagePattern({ cmd: 'getFinalDate' })
  async getFinalDate(data: FinalDate) {
    return await this.service.getFinalDate(data);
  }

  @MessagePattern({ cmd: 'penaltyReverse' })
  async penaltyReverse() {}
}
