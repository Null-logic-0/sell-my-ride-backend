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

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  image?: string;
}
