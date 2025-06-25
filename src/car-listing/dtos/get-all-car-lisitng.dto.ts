import { Type } from 'class-transformer';
import {
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsString,
} from 'class-validator';
import { CarBodyType } from '../enums/car-body-types.enum';
import { CarStatus } from '../enums/car-status.enum';
import { PriceRange } from '../enums/price-range.enum';

export class GetAllCarsFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsEnum(PriceRange)
  priceRange?: PriceRange;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(CarBodyType)
  bodyType?: CarBodyType;

  @IsOptional()
  @IsEnum(CarStatus)
  carStatus?: CarStatus;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  inStock?: boolean;
}
