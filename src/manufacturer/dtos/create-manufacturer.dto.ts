import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateManufacturerDto {
  @ApiProperty({
    example: 'Mercedes',
    description:
      'Name of the car manufacturer. It should be between 3 and 96 characters long.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(96)
  @IsNotEmpty()
  make: string;

  @ApiProperty({
    example: 'http://example.com/manufacturer1.png',
  })
  @IsString()
  @MaxLength(1024)
  @IsUrl()
  @IsOptional()
  image?: string;
}
