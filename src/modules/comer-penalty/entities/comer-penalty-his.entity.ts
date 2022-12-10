import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('comer_penalizaciones_his', { schema: 'sera' })
export class ComerPenaltyHisEntity {
  @PrimaryColumn('numeric', {
    name: 'id_cliente',
    nullable: false,
    precision: 8,
    scale: 0,
  })
  clientId: Number | null;

  @PrimaryColumn('numeric', {
    name: 'id_penalizacion',
    nullable: false,
    precision: 4,
    scale: 0,
  })
  id: Number | null;

  @Column('numeric', {
    name: 'id_lote',
    nullable: true,
    precision: 10,
    scale: 0,
  })
  lotId: Number | null;

  @Column('numeric', {
    name: 'id_evento',
    nullable: true,
    precision: 7,
    scale: 0,
  })
  eventId: Number | null;

  @Column('numeric', {
    name: 'lote_publico',
    nullable: true,
    precision: 8,
    scale: 0,
  })
  publicLot: Number | null;

  @Column('date', { name: 'fecha_inicial', nullable: true })
  startDate: Date | null;

  @Column('date', { name: 'fecha_final', nullable: true })
  endDate: Date | null;

  @Column('numeric', {
    name: 'tipo_proceso',
    nullable: true,
    precision: 4,
    scale: 0,
  })
  typeProcess: Number | null;

  @Column('character varying', {
    name: 'refe_oficio_otro',
    nullable: true,
    length: 200,
  })
  refeOfficeOther: string | null;

  @Column('character varying', { name: 'usuario', nullable: true, length: 100 })
  user: string | null;

  @Column('numeric', {
    name: 'bandera',
    nullable: true,
    precision: 1,
    scale: 0,
  })
  flag: Number | null;

  @Column('numeric', {
    name: 'no_registro',
    nullable: true,
    precision: 12,
    scale: 0,
  })
  registerNumber: Number | null;

  @Column('character varying', {
    name: 'usr_penaliza',
    nullable: true,
    length: 30,
  })
  userPenalty: string | null;

  @Column('character varying', {
    name: 'usr_libera',
    nullable: true,
    length: 30,
  })
  userRelease: string | null;

  @Column('date', { name: 'fec_penaliza', nullable: true })
  penaltyDate: Date | null;

  @Column('date', { name: 'fec_libera', nullable: true })
  releaseDate: Date | null;

  @Column('character varying', {
    name: 'causa_libera',
    nullable: true,
    length: 200,
  })
  releaseCause: string | null;
}
