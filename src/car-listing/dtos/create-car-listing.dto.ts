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
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
import { SteeringWheel } from '../enums/steering-wheel.enum';
import { Transmission } from '../enums/transmission.enum';

export class CreateCarListDto {
  @ApiProperty({ example: 'SEDAN', description: 'Body type of the car' })
  @IsEnum(CarBodyType)
  @IsNotEmpty()
  bodyType: CarBodyType;

  @ApiProperty({ example: 'GASOLINE', description: 'Fuel type of the car' })
  @IsEnum(FuelType)
  @IsNotEmpty()
  fuelType: FuelType;

  @ApiProperty({ example: 4, description: 'Number of engine cylinders' })
  @IsEnum(NumOfCylinders)
  @IsNotEmpty()
  numberOfCylinders: NumOfCylinders;

  @ApiProperty({ example: 'Mercedes', description: 'Manufacturer of the car' })
  @IsInt()
  @IsNotEmpty()
  manufacturerId: number;

  @ApiProperty({ example: 'S-Class', description: 'Model of the car' })
  @IsInt()
  @IsNotEmpty()
  modelId: number;

  @ApiProperty({ example: 2019, description: 'Manufacturing year of the car' })
  @IsInt()
  @Min(1960)
  @Max(new Date().getFullYear() + 1)
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: 2.0, description: 'Engine capacity in liters' })
  @IsEnum(EngineCapacity)
  @IsNotEmpty()
  engineCapacity: EngineCapacity;

  @ApiProperty({
    example: true,
    description: 'Whether the car has a turbo engine',
  })
  @IsBoolean()
  turbo: boolean;

  @ApiProperty({ example: 85000, description: 'Mileage of the car' })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  mileage: number;

  @ApiProperty({ example: 'km', description: 'Mileage unit (KM or MI)' })
  @IsEnum(MileageType)
  @IsNotEmpty()
  mileageType: MileageType;

  @ApiProperty({ example: 'left', description: 'Steering wheel position' })
  @IsEnum(SteeringWheel)
  @IsNotEmpty()
  steeringWheel: SteeringWheel;

  @ApiProperty({ example: 'automatic', description: 'Transmission type' })
  @IsEnum(Transmission)
  @IsNotEmpty()
  transmission: Transmission;

  @ApiProperty({ example: 'previous', description: 'Drive wheels type' })
  @IsEnum(DriveWheels)
  @IsNotEmpty()
  driveWheels: DriveWheels;

  @ApiProperty({ example: '4', description: 'Number of doors' })
  @IsEnum(DoorNumbers)
  @IsNotEmpty()
  numberOfDoors: DoorNumbers;

  @ApiProperty({ example: true, description: 'Whether the car has a catalyst' })
  @IsBoolean()
  @IsNotEmpty()
  catalyst: boolean;

  @ApiProperty({
    example: 'FRONT_AND_SIDE',
    description: '2',
  })
  @IsEnum(Airbag)
  @IsNotEmpty()
  airbag: Airbag;

  @ApiProperty({ example: 'black', description: 'Exterior car color' })
  @IsEnum(CarColor)
  @IsNotEmpty()
  carColor: CarColor;

  @ApiProperty({ example: 'leather', description: 'Cabin material' })
  @IsEnum(CabinMaterial)
  @IsNotEmpty()
  cabinMaterial: CabinMaterial;

  @ApiProperty({ example: 'beige', description: 'Cabin color' })
  @IsEnum(CabinColor)
  @IsNotEmpty()
  cabinColor: CabinColor;

  @ApiProperty({
    example: 'Very clean car, no issues.',
    description: 'Car description',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(450)
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: ['Cruise control', 'Sunroof'],
    description: 'Additional options or features',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  additionalOptions?: string[];

  @ApiProperty({
    example: 'USA',
    description: 'Region where the car is listed',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 64)
  region: string;

  @ApiProperty({
    example: 'New York',
    description: 'City where the car is listed',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 64)
  city: string;

  @ApiProperty({
    example: [
      'https://bucket.s3.region.amazonaws.com/key1.jpg',
      'https://bucket.s3.region.amazonaws.com/key2.jpg',
    ],
    description: 'List of car photo URLs (1 to 10)',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  photos?: string[];

  @ApiProperty({
    example: 'https://youtube.com/sample-video',
    description: 'Optional video URL',
    required: false,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  @Length(0, 255)
  video?: string;

  @ApiProperty({ example: 12500.99, description: 'Car price in USD' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: '+1 212 555 4567',
    description: 'Phone number of the seller',
  })
  @IsString()
  @Length(5, 20)
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'used', description: 'Car status: NEW or USED' })
  @IsEnum(CarStatus)
  carStatus: CarStatus;

  @ApiProperty({
    example: false,
    description: 'Whether the car is available or not',
  })
  @IsBoolean()
  @IsOptional()
  inStock?: boolean;
}
