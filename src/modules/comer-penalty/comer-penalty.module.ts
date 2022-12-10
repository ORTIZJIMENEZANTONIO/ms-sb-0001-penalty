import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

import { ComerPenaltyController } from './comer-penalty.controller';
import { ComerPenaltyService } from './comer-penalty.service';
import { ComerClientEntity } from './entities/comer-client.entity';
import { ComerPenaltyHisEntity } from './entities/comer-penalty-his.entity';
import { ComerPenaltyEntity } from './entities/comer-penalty.entity';
import { ComerTPenaltyEntity } from './entities/comer-tpenalty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ComerTPenaltyEntity,
      ComerClientEntity,
      ComerPenaltyHisEntity,
      ComerPenaltyEntity,
    ]),
  ],
  controllers: [ComerPenaltyController],
  providers: [
    ComerPenaltyService,
    makeCounterProvider({
      name: 'comer_penalty_served',
      help: 'comer_penalty_help',
    }),
  ],
})
export class ComerPenaltyModule {}
