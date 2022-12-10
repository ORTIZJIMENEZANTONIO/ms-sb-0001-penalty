import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  makeCounterProvider,
  PrometheusModule,
} from "@willsoto/nestjs-prometheus";


import { ComerPenaltyController } from './comer-penalty.controller';
import { ComerPenaltyService } from './comer-penalty.service';

@Module({
  // imports: [TypeOrmModule.forFeature([ComerLotEntity])],
  controllers: [ComerPenaltyController],
  providers: [ComerPenaltyService,
    makeCounterProvider({
      name: "comer_penalty_served",
      help: "comer_penalty_help",
    }),]
})
export class ComerPenaltyModule {}
