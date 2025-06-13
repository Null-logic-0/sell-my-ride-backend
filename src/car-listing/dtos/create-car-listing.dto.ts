import {
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsPhoneNumber,
  Length,
  IsNotEmpty,
  MaxLength,
  MinLength,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { CarBodyType } from '../enums/car-body-types.enum';
import { NumOfCylinders } from '../enums/number-of-cylinders.enum';
import { FuelType } from '../enums/fuel-type.enum';
import { EngineCapacity } from '../enums/engine-capacity.enum';
import { MileageType } from '../enums/mileage-type.enum';
import { Airbag } from '../enums/airbag.enum';
import { CabinColor } from '../enums/cabin-color.enum';
import { CabinMaterial } from '../enums/cabin-material.enum';
import { CarColor } from '../enums/car-color.enum';
import { CarStatus } from '../enums/car-status.enum';
import { DoorNumbers } from '../enums/door-numbers.enum';
import { DriveWheels } from '../enums/drive-wheels.enum';
import { OwnerStatus } from '../enums/owner-status.enum';
import { SteeringWheel } from '../enums/steering-wheel.enum';
import { Transmission } from '../enums/transmission.enum';

export class CreateCarListDto {
  @IsEnum(CarBodyType)
  @IsNotEmpty()
  bodyType: CarBodyType;

  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @IsEnum(FuelType)
  @IsNotEmpty()
  fuelType: FuelType;

  @IsEnum(NumOfCylinders)
  @IsNotEmpty()
  NumOfCylinders: NumOfCylinders;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsInt()
  @Min(1960)
  @Max(new Date().getFullYear() + 1)
  @IsNotEmpty()
  year: number;

  @IsEnum(EngineCapacity)
  @IsNotEmpty()
  engineCapacity: EngineCapacity;

  @IsBoolean()
  turbo: boolean;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  mileage: number;

  @IsEnum(MileageType)
  @IsNotEmpty()
  mileageType: MileageType;

  @IsEnum(SteeringWheel)
  @IsNotEmpty()
  steeringWheel: SteeringWheel;

  @IsEnum(Transmission)
  @IsNotEmpty()
  transmission: Transmission;

  @IsEnum(DriveWheels)
  @IsNotEmpty()
  driveWheels: DriveWheels;

  @IsEnum(DoorNumbers)
  @IsNotEmpty()
  numberOfDoors: DoorNumbers;

  @IsBoolean()
  @IsNotEmpty()
  catalyst: boolean;

  @IsEnum(Airbag)
  @IsNotEmpty()
  airbag: Airbag;

  @IsEnum(CarColor)
  @IsNotEmpty()
  carColor: CarColor;

  @IsEnum(CabinMaterial)
  @IsNotEmpty()
  cabinMaterial: CabinMaterial;

  @IsEnum(CabinColor)
  @IsNotEmpty()
  cabinColor: CabinColor;

  @IsString()
  @MinLength(3)
  @MaxLength(450)
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  additionalOptions?: string[];

  @IsString()
  @IsNotEmpty()
  @Length(1, 64)
  region: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 64)
  city: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  photos: string[];

  @IsString()
  @IsOptional()
  @Length(0, 255)
  video?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  price: number;

  @IsString()
  @Length(5, 20)
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEnum(CarStatus)
  carStatus: CarStatus;

  @IsBoolean()
  isSold: boolean;

  @IsEnum(OwnerStatus)
  ownerStatus: OwnerStatus;
}
