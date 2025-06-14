import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarStatus } from './enums/car-status.enum';
import { MileageType } from './enums/mileage-type.enum';
import { SteeringWheel } from './enums/steering-wheel.enum';
import { DriveWheels } from './enums/drive-wheels.enum';
import { Transmission } from './enums/transmission.enum';
import { DoorNumbers } from './enums/door-numbers.enum';
import { CarBodyType } from './enums/car-body-types.enum';
import { Airbag } from './enums/airbag.enum';
import { FuelType } from './enums/fuel-type.enum';
import { NumOfCylinders } from './enums/number-of-cylinders.enum';
import { EngineCapacity } from './enums/engine-capacity.enum';
import { CarColor } from './enums/car-color.enum';
import { CabinMaterial } from './enums/cabin-material.enum';
import { CabinColor } from './enums/cabin-color.enum';
import { OwnerStatus } from './enums/owner-status.enum';
import { Manufacturer } from 'src/manufacturer/manufacturer.entity';
import { CarModel } from 'src/car-model/car-model.entity';

@Entity()
export class CarList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', enum: CarBodyType })
  bodyType: CarBodyType;

  @Column({
    type: 'varchar',
    enum: FuelType,
    default: FuelType.GASOLINE,
  })
  fuelType: FuelType;

  @Column({
    type: 'enum',
    enum: NumOfCylinders,
  })
  numberOfCylinders: NumOfCylinders;

  @ManyToOne(() => Manufacturer, { eager: true })
  manufacturer: Manufacturer;

  @ManyToOne(() => CarModel, { eager: true })
  model: CarModel;

  @Column({ type: 'int' })
  year: number;

  @Column({
    type: 'decimal',
    enum: EngineCapacity,
  })
  engineCapacity: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  turbo: boolean;

  @Column({ type: 'int' })
  mileage: number;

  @Column({
    type: 'enum',
    enum: MileageType,
    default: MileageType.KM,
  })
  mileageType: MileageType;

  @Column({
    type: 'enum',
    enum: SteeringWheel,
    default: SteeringWheel.LEFT,
  })
  steeringWheel: SteeringWheel;

  @Column({
    type: 'enum',
    enum: Transmission,
  })
  transmission: Transmission;

  @Column({
    type: 'enum',
    enum: DriveWheels,
  })
  driveWheels: DriveWheels;

  @Column({
    type: 'enum',
    enum: DoorNumbers,
    default: DoorNumbers.FOUR,
  })
  numberOfDoors: DoorNumbers;

  @Column({
    type: 'boolean',
  })
  catalyst: boolean;

  @Column({ type: 'enum', enum: Airbag, default: Airbag.NONE })
  airbag: Airbag;

  @Column({
    type: 'enum',
    enum: CarColor,
  })
  carColor: CarColor;

  @Column({
    type: 'enum',
    enum: CabinMaterial,
  })
  cabinMaterial: CabinMaterial;

  @Column({
    type: 'enum',
    enum: CabinColor,
  })
  cabinColor: CabinColor;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({ type: 'text', array: true, nullable: true })
  additionalOptions?: string[];

  @Column({ type: 'varchar', length: 64 })
  region: string;

  @Column({ type: 'varchar', length: 64 })
  city: string;

  @Column({ type: 'varchar', array: true })
  photos: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  video?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: CarStatus,
    default: CarStatus.NEW,
  })
  carStatus: CarStatus;

  @Column({
    type: 'boolean',
    default: false,
  })
  isSold: boolean;

  @Column({ type: 'enum', enum: OwnerStatus, default: OwnerStatus.OWNER })
  ownerStatus: OwnerStatus;

  @ManyToOne(() => User, (user) => user.carLists)
  owner: User;

  @CreateDateColumn({
    type: 'time with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @UpdateDateColumn({
    type: 'time with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'int', default: 0 })
  viewsCount: number;
}
