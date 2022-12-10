import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { FinalDate } from './dto/get-final-date.dto';
import { ComerTPenaltyEntity } from './entities/comer-tpenalty.entity';

@Injectable()
export class ComerPenaltyService {
  constructor(
    @InjectRepository(ComerTPenaltyEntity)
    private entity: Repository<ComerTPenaltyEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectMetric('comer_penalty_served') public counter: Counter<string>,
  ) {}
  async registerPenalty() {}

  async updatePenalty() {}

  async releasePenalty() {}

  async getFinalDate(data: FinalDate): Promise<Date> {
    const { penaltyId, penaltyDate } = data;
    const lvDaysQuery = this.entity
      .createQueryBuilder()
      .select([`DIAS_PENALIZACION as "days"`])
      .where(`ID_PENALIZACION = '${penaltyId}'`);

    const lvDays = (await lvDaysQuery.getRawOne()).days ?? 0;
    const penaltyDateFormat = new Date(penaltyDate);
    const lvFinalDate = penaltyDateFormat.setDate(penaltyDateFormat.getDate() + Number(lvDays));

    return (new Date(lvFinalDate));
  }

  async penaltyReverse() {}
}
