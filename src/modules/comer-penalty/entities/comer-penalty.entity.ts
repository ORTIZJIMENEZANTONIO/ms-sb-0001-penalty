import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('comer_penalizaciones', { schema: 'sera' })
export class ComerPenaltyEntity {
  @PrimaryColumn('numeric', { name: 'id_cliente', precision: 8, scale: 0 })
  clientId: Number;

  @Column('numeric', {
    name: 'id_lote',
    nullable: true,
    precision: 10,
    scale: 0,
  })
  lotId: Number | null;

  @Column('numeric', { name: 'id_penalizacion', precision: 4, scale: 0 })
  id: Number;

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
    name: 'p_bandera',
    nullable: true,
    precision: 1,
    scale: 0,
  })
  pFlag: Number | null;

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

  @Column('date', { name: 'fec_penaliza', nullable: true })
  penaltiDate: Date | null;
}
