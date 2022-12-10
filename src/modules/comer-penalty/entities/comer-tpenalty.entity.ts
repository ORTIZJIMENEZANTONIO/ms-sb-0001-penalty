import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('comer_tpenaliza', { schema: 'sera' })
export class ComerTPenaltyEntity {
  @PrimaryColumn('numeric', { name: 'id_penalizacion' })
  id: Number;

  @Column('character varying', {
    name: 'desc_penalizacion',
    nullable: true,
    length: 150,
  })
  description: string | null;

  @Column('numeric', { name: 'dias_penalizacion', nullable: true })
  penaltyDays: Number | null;

  @Column('character varying', { name: 'proceso', nullable: true, length: 1 })
  process: string | null;
}
