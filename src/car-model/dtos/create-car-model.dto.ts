import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCarModelDto {
  @ApiProperty({
    example: 'S-class',
    description:
      'Name of the car model. It should be between 3 and 96 characters long.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(96)
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  manufacturerId: number;
}
