import { Controller, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { MessagePattern } from '@nestjs/microservices';

import { ComerPenaltyService } from './comer-penalty.service';
import { FinalDateDto } from './dto/get-final-date.dto';
import { ReleasePenaltyDto } from './dto/release-penalty.dto';
import { UpdatePenaltyDto } from './dto/update-penaly.dto';
import { RegisterPenaltyDto } from './dto/register-penalty.dto';
import { ReversePenaltyDto } from './dto/reverse-penalty.dto';

@Controller('comer-penalty')
export class ComerPenaltyController {
  constructor(
    private readonly service: ComerPenaltyService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @MessagePattern({ cmd: 'registerPenalty' })
  async registerPenalty(data: RegisterPenaltyDto) {
    return await this.service.registerPenalty(data);
  }

  @MessagePattern({ cmd: 'updatePenalty' })
  async updatePenalty(data: UpdatePenaltyDto) {
    return await this.service.updatePenalty(data);
  }

  @MessagePattern({ cmd: 'releasePenalty' })
  async releasePenalty(data: ReleasePenaltyDto) {
    return await this.service.releasePenalty(data);
  }

  @MessagePattern({ cmd: 'getFinalDate' })
  async getFinalDate(data: FinalDateDto) {
    return await this.service.getFinalDate(data);
  }

  @MessagePattern({ cmd: 'penaltyReverse' })
  async penaltyReverse(data: ReversePenaltyDto) {
    return await this.service.penaltyReverse(data);
  }
}
