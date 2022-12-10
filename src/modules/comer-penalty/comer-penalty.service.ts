import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { FinalDate } from './dto/get-final-date.dto';

@Injectable()
export class ComerPenaltyService {
  constructor(
    // @InjectRepository(ComerLotEntity)
    // private entity: Repository<ComerLotEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectMetric('comer_penalty_served') public counter: Counter<string>,
  ) {}
  async registerPenalty() {}

  async updatePenalty() {}

  async releasePenalty() {}

  async getFinalDate(data: FinalDate): Promise<String> {
    return '2022-12-12';
  }

  async penaltyReverse() {}
}
