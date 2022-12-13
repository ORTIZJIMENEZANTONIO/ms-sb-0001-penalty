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
import { ComerEventEntity } from './entities/comer-event.entity';
import { ComerLotEntity } from './entities/comer-lot.entity';

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
    @InjectRepository(ComerEventEntity)
    private entityEvent: Repository<ComerEventEntity>,
    @InjectRepository(ComerLotEntity)
    private entityLot: Repository<ComerLotEntity>,
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
    let pStatusProcess = 1;
    let pMsgProcess = `Se registro la penalización para el cliente : ${clientId}`;
    const nowDate = new Date();
    let lvPenalty = 0;
    let lvPeriniDate = new Date().toISOString().substring(0, 10);
    let lvPerEndDate = new Date().toISOString().substring(0, 10);
    const lvValEvent =
      (
        await this.entityEvent
          .createQueryBuilder()
          .select([`COUNT(0) as "total"`])
          .where(`ID_EVENTO = ${eventId}`)
          .getRawOne()
      ).total ?? 0;

    if (lvValEvent == 0) {
      pMsgProcess = 'El Evento no está registrado, verifique su información';
      return pStatusProcess;
    }

    const lvValLots =
      (
        await this.entityLot
          .createQueryBuilder()
          .select([`COUNT(0) as "total"`])
          .where(`ID_EVENTO = ${eventId}`)
          .andWhere(`LOTE_PUBLICO = ${publicLot}`)
          .getRawOne()
      ).total ?? 0;

    if (lvValLots == 0) {
      const pStatusProcess = `El lote ${publicLot} no esta registrado en en el evento  ${eventId}`;
      return pStatusProcess;
    }
    const lvIdLot = (
      await this.entityLot
        .createQueryBuilder()
        .select([`ID_LOTE as "id"`])
        .where(`ID_EVENTO = ${eventId}`)
        .andWhere(`LOTE_PUBLICO = ${publicLot}`)
        .getRawOne()
    ).id;

    const flimit = new Date(nowDate.setDate(nowDate.getDate() - 10));
    if (new Date(penaltyDate) < flimit) {
      pMsgProcess = `La fecha de penalización, no puede ser menor a la actual`;
      return pMsgProcess;
    }

    const lvValPenalty =
      (
        await this.entityTPenalty
          .createQueryBuilder()
          .select([`COUNT(0) as "total"`])
          .where(`ID_PENALIZACION = ${penaltyId}`)
          .getRawOne()
      ).total ?? 0;

    if (lvValPenalty == 0) {
      pMsgProcess = `El tipo de penalización ${penaltyId}  no es válido, verifique su información`;
    }

    if (pStatusProcess == 1) {
      const lvRegPenalty =
        (
          await this.entity
            .createQueryBuilder()
            .select([`COUNT(0) as "total"`])
            .where(`ID_CLIENTE = ${clientId}`)
            .getRawOne()
        ).total ?? 0;

      if (lvRegPenalty == 0) {
        const lvDaysPenalty =
          (
            await this.entityTPenalty
              .createQueryBuilder()
              .select([`DIAS_PENALIZACION as "days"`])
              .where(`ID_PENALIZACION = ${penaltyId}`)
              .getRawOne()
          ).days ?? 720;

        lvPeriniDate = new Date(
          new Date(penaltyDate).setDate(
            new Date(penaltyDate).getDate() - lvDaysPenalty,
          ),
        )
          .toISOString()
          .substring(0, 10);

        if (penaltyId == 4) {
          const lvTotPenalty =
            (
              await this.entityHis
                .createQueryBuilder()
                .select([`count(0)  as "tptal"`])
                .where(`ID_CLIENTE in (4,7,10)`)
                .getRawOne()
            ).total ?? 0;

          const lvValTypePenalty =
            (
              await this.entityHis
                .createQueryBuilder()
                .select([`count(0)  as "tptal"`])
                .where(`ID_CLIENTE = ${clientId}`)
                .andWhere(
                  `FECHA_INICIAL between '${lvPeriniDate}' and '${penaltyDate}'`,
                )
                .andWhere(`ID_PENALIZACION in (4,7,10)`)
                .getRawOne()
            ).total ?? 0;

          lvPenalty =
            lvValTypePenalty != 0 && lvTotPenalty == 1
              ? 7
              : lvValTypePenalty != 0 && lvTotPenalty >= 2
              ? 10
              : penaltyId;
        }

        if (penaltyId == 5) {
          const lvTotPenalty =
            (
              await this.entityHis
                .createQueryBuilder()
                .select([`count(0)  as "tptal"`])
                .where(`ID_CLIENTE in (5,8,11)`)
                .getRawOne()
            ).total ?? 0;

          const lvValTypePenalty =
            (
              await this.entityHis
                .createQueryBuilder()
                .select([`count(0)  as "tptal"`])
                .where(`ID_CLIENTE = ${clientId}`)
                .andWhere(
                  `FECHA_INICIAL between '${lvPeriniDate}' and '${penaltyDate}'`,
                )
                .andWhere(`ID_PENALIZACION in (5,8,11)`)
                .getRawOne()
            ).total ?? 0;

          lvPenalty =
            lvValTypePenalty != 0 && lvTotPenalty == 1
              ? 8
              : lvValTypePenalty != 0 && lvTotPenalty >= 2
              ? 11
              : penaltyId;
        }

        if (penaltyId == 6) {
          const lvTotPenalty =
            (
              await this.entityHis
                .createQueryBuilder()
                .select([`count(0)  as "tptal"`])
                .where(`ID_CLIENTE in (6,9,12)`)
                .getRawOne()
            ).total ?? 0;

          const lvValTypePenalty =
            (
              await this.entityHis
                .createQueryBuilder()
                .select([`count(0)  as "tptal"`])
                .where(`ID_CLIENTE = ${clientId}`)
                .andWhere(
                  `FECHA_INICIAL between '${lvPeriniDate}' and '${penaltyDate}'`,
                )
                .andWhere(`ID_PENALIZACION in (6,9,12)`)
                .getRawOne()
            ).total ?? 0;

          lvPenalty =
            lvValTypePenalty != 0 && lvTotPenalty == 1
              ? 9
              : lvValTypePenalty != 0 && lvTotPenalty >= 2
              ? 12
              : penaltyId;
        }
      } else {
        let lvPenalty =
          (
            await this.entity
              .createQueryBuilder()
              .select([`ID_PENALIZACION as "id"`])
              .where(` ID_CLIENTE = ${clientId}`)
              .getRawOne()
          ).id ?? 0;

        if (lvPenalty == 4 || lvPenalty == 7 || lvPenalty == 10) {
          lvPenalty =
            lvPenalty == 4
              ? 7
              : lvPenalty == 7 || lvPenalty == 10
              ? 10
              : penaltyId;
        } else if (lvPenalty == 5 || lvPenalty == 8 || lvPenalty == 11) {
          lvPenalty =
            lvPenalty == 5
              ? 8
              : lvPenalty == 8 || lvPenalty == 11
              ? 11
              : penaltyId;
        } else if (lvPenalty == 6 || lvPenalty == 9 || lvPenalty == 12) {
          lvPenalty =
            lvPenalty == 6
              ? 9
              : lvPenalty == 9 || lvPenalty == 12
              ? 12
              : penaltyId;
        } else {
          lvPenalty = penaltyId;
        }

        lvPeriniDate =
          typeof penaltyDate === 'string'
            ? penaltyDate
            : penaltyDate.toISOString().substring(0, 10);
        lvPerEndDate = (
          await this.getFinalDate({
            penaltyId: lvPenalty,
            penaltyDate: new Date(lvPeriniDate),
          })
        )
          .toISOString()
          .substring(0, 10);
        const partialBody = await this.entity
          .createQueryBuilder()
          .select([
            `ID_CLIENTE as "clientId"`,
            `ID_LOTE as "lotId"`,
            `ID_PENALIZACION as "id"`,
            `ID_EVENTO as "eventId"`,
            `LOTE_PUBLICO as "publicLot"`,
            `FECHA_INICIAL as "startDate"`,
            `FECHA_FINAL as "endDate"`,
            `TIPO_PROCESO as "typeProcess"`,
            `REFE_OFICIO_OTRO as "refeOfficeOther"`,
            `USUARIO as "user"`,
            `P_BANDERA as "flag"`,
            `USR_PENALIZA as "userPenalty"`,
            `FEC_PENALIZA as "penaltyDate"`,
          ])
          .where(`ID_CLIENTE = ${clientId}`)
          .getRawMany();
        this.entityHis.save(partialBody);
        this.entity
          .createQueryBuilder()
          .delete()
          .from(ComerPenaltyEntity)
          .where(`ID_CLIENTE = ${clientId}`)
          .execute();
      }

      const insrtPenaltyQuery = `
        INSERT INTO sera.COMER_PENALIZACIONES(
          ID_CLIENTE,
          ID_LOTE,
          ID_PENALIZACION,
          ID_EVENTO,
          LOTE_PUBLICO,
          FECHA_INICIAL,
          FECHA_FINAL,
          TIPO_PROCESO,
          REFE_OFICIO_OTRO,
          USUARIO,
          P_BANDERA,
          USR_PENALIZA,
          FEC_PENALIZA
        ) VALUES (
          ${clientId},
          ${lvIdLot},
          ${lvPenalty},
          ${eventId},
          ${publicLot},
          '${lvPeriniDate}',
          '${lvPerEndDate}',
          ${lvPenalty},
          '${observations}',
          user,
          1,
          '${penaltyUser}',
          '${penaltyDate}'
        )
      `;

      const updtClientQuery = `
        UPDATE sera.COMER_CLIENTES
        SET
          LISTA_NEGRA = 'S',
          FECHA_LISTA_NEGRA = '${penaltyDate}',
          FEC_INI_PENALIZACION = '${lvPeriniDate}',
          FEC_FIN_PENALIZACION = '${lvPerEndDate}',
          ID_PENALIZACION = ${lvPenalty},
          USU_PENALIZA = '${penaltyUser}'
        WHERE
          ID_CLIENTE = ${clientId};
      `;
      
      try {
        await this.entity.query(insrtPenaltyQuery);
        await this.entityClient.query(updtClientQuery);
      } catch (err) {
        return err.detail;
      }
    }
    return pMsgProcess;
  }

  async updatePenalty(data: UpdatePenaltyDto) {
    const { clientId, releaseDate, userRelease, releaseCause } = data;
    const penaltiesQuery = this.entity
      .createQueryBuilder('p')
      .select([
        `FECHA_INICIAL as "startDate"`,
        `FECHA_FINAL as "endDate"`,
        `ID_CLIENTE as "clientId"`,
        `ID_PENALIZACION as "penaltyId"`,
        `ID_EVENTO as "eventId"`,
        `LOTE_PUBLICO as "publicLot"`,
        `TIPO_PROCESO as "typeProcess"`,
        `USUARIO as "user"`,
        `REFE_OFICIO_OTRO as "refeOfficeOther"`,
        `USR_PENALIZA as "userPenalty"`,
        `FEC_PENALIZA as "penaltiDate"`,
      ])
      .where(`ID_CLIENTE = ${clientId}`);
    const penalties = await penaltiesQuery.getRawMany();
    let pStatusProcess = 1;
    let pMsgProcess = `Se liberó de penalización el cliente número  : ${clientId} en la fecha ${releaseDate}`;
    const historicPenalty = [];
    const penaltyDetails = [];
    const clientsCatalogue = [];
    const message = {
      historicPenalty: '',
      penaltyDetails: '',
      clientsCatalogue: '',
      result: pMsgProcess,
    };
    // agregar a la validación que clientId sea un número positivo
    for (const pe of penalties) {
      const body = {
        ...pe,
        releaseDate,
        userRelease,
        releaseCause,
      };
      historicPenalty.push(await this.entityHis.save(body));

      // Detalle de penalizacion
      penaltyDetails.push(
        await this.entity.delete({
          clientId: pe.clientId,
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
          USU_LIBERA = '${userRelease}',
          FECHA_LIBERACION = NOW()
        WHERE
          ID_CLIENTE = ${pe.clientId};
      `);
      clientsCatalogue.push(await updated);
    }

    message.historicPenalty = `${historicPenalty.length} registros guardados en histórico`;
    message.penaltyDetails = `${penaltyDetails.length} registros de penalizaciones eliminados`;
    message.clientsCatalogue = `${clientsCatalogue.length} registros de catálogo de clientes actualizados`;
    return message;
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
