import { Manufacturer } from 'src/manufacturer/manufacturer.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CarModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  model: string;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.models, {
    nullable: false,
    eager: true,
  })
  manufacturer: Manufacturer;
}
