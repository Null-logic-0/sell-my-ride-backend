import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Manufacturer {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    length: 95,
    nullable: false,
  })
  make: string;
}
