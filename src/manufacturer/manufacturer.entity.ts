import { CarModel } from 'src/car-model/car-model.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => CarModel, (model) => model.manufacturer, {
    nullable: false,
  })
  models: CarModel[];
}
