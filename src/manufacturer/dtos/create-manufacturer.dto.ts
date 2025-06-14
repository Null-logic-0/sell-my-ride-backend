import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

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
}
