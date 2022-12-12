import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

import { FinalDateDto } from './dto/get-final-date.dto';
import { ComerTPenaltyEntity } from './entities/comer-tpenalty.entity';
import { ReleasePenaltyDto } from './dto/release-penalty.dto';
import { ComerClientEntity } from './entities/comer-client.entity';
import { ComerPenaltyHisEntity } from './entities/comer-penalty-his.entity';
import { ComerPenaltyEntity } from './entities/comer-penalty.entity';
import { UpdatePenaltyDto } from './dto/update-penaly.dto';
import { RegisterPenaltyDto } from './dto/register-penalty.dto';
import { ReversePenaltyDto } from './dto/reverse-penalty.dto';

@Injectable()
export class ComerPenaltyService {
  constructor(
    @InjectRepository(ComerPenaltyEntity)
    private entity: Repository<ComerPenaltyEntity>,
    @InjectRepository(ComerPenaltyHisEntity)
    private entityHis: Repository<ComerPenaltyHisEntity>,
    @InjectRepository(ComerClientEntity)
    private entityClient: Repository<ComerClientEntity>,
    @InjectRepository(ComerTPenaltyEntity)
    private entityTPenalty: Repository<ComerTPenaltyEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectMetric('comer_penalty_served') public counter: Counter<string>,
  ) {}
  async registerPenalty(data: RegisterPenaltyDto) {
    const {
      clientId,
      eventId,
      publicLot,
      penaltyDate,
      penaltyId,
      observations,
      penaltyUser,
    } = data;
    let pMsgProcess = 1;
    let pStatusProcess = `Se registro la penalización para el cliente : ${clientId}`;
  }

  async updatePenalty(data: UpdatePenaltyDto) {
    const { clientId, releaseDate, userRelease, releaseCause } = data;
    const penalties = await this.entity
      .createQueryBuilder()
      .where(`ID_CLIENTE = ${clientId}`);
    console.log(penalties);
    return 'ok';
  }

  async releasePenalty(data: ReleasePenaltyDto) {
    const { releaseDate } = data;
    const historicPenalty = [];
    const penaltyDetails = [];
    const clientsCatalogue = [];
    const message = {
      historicPenalty: '',
      penaltyDetails: '',
      clientsCatalogue: '',
    };
    const clientsQuery = this.entityClient
      .createQueryBuilder()
      .select([
        `ID_CLIENTE as "clientId"`,
        `FECHA_LISTA_NEGRA as "blackListDate"`,
        `FEC_INI_PENALIZACION "startDate"`,
        `FEC_FIN_PENALIZACION as "endDate"`,
      ])
      .where(`LISTA_NEGRA = 'S'`)
      .andWhere(`FEC_INI_PENALIZACION <= '${releaseDate}'`);
    const clients = await clientsQuery.getRawMany();

    for (const client of clients) {
      // Historico de Penalizacion
      const penalty = await this.entity.query(`SELECT
        FECHA_INICIAL as "startDate",
        FECHA_FINAL as "endDate",
        ID_CLIENTE as "clientId",
        ID_PENALIZACION as "id",
        ID_EVENTO as "eventId",
        LOTE_PUBLICO as "publicLot",
        TIPO_PROCESO as "typeProcess",
        USUARIO as "user",
        REFE_OFICIO_OTRO as "refeOfficeOther",
        USR_PENALIZA as "userPenalty",
        FEC_PENALIZA as "penaltyDate",
        USER as "userRelease",
        NOW() as "releaseDate",
        'LIBERACIÓN POR PROCESO AUTOMATICO' as "releaseCause"
      FROM
        sera.COMER_PENALIZACIONES
      WHERE
        ID_CLIENTE = ${client.clientId}`);
      penalty.length > 0
        ? historicPenalty.push(await this.entityHis.save(penalty[0]))
        : null;

      // Detalle de penalizacion
      penaltyDetails.push(
        await this.entity.delete({
          clientId: client.clientId,
        }),
      );

      // Catalogo de clientes
      const updated = this.entity.query(`
        UPDATE sera.COMER_CLIENTES
        SET
          LISTA_NEGRA = 'N',
          FECHA_LISTA_NEGRA = NULL,
          FEC_INI_PENALIZACION = NULL,
          FEC_FIN_PENALIZACION = NULL,
          USU_LIBERA = USER,
          FECHA_LIBERACION = NOW()
        WHERE
          ID_CLIENTE = ${client.clientId};
      `);
      clientsCatalogue.push(await updated);
    }

    message.historicPenalty = `${historicPenalty.length} registros guardados en histórico`;
    message.penaltyDetails = `${penaltyDetails.length} registros de penalizaciones eliminados`;
    message.clientsCatalogue = `${clientsCatalogue.length} registros de catálogo de clientes actualizados`;
    return message;
  }

  async getFinalDate(data: FinalDateDto): Promise<Date> {
    const { penaltyId, penaltyDate } = data;
    const lvDaysQuery = this.entityTPenalty
      .createQueryBuilder()
      .select([`DIAS_PENALIZACION as "days"`])
      .where(`ID_PENALIZACION = '${penaltyId}'`);

    const lvDays = (await lvDaysQuery.getRawOne()).days ?? 0;
    const penaltyDateFormat = new Date(penaltyDate);
    const lvFinalDate = penaltyDateFormat.setDate(
      penaltyDateFormat.getDate() + Number(lvDays),
    );

    return new Date(lvFinalDate);
  }

  async penaltyReverse(data: ReversePenaltyDto) {}
}
