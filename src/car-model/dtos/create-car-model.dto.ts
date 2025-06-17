import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCarModelDto {
  @ApiProperty({
    example: 'S-class',
    description:
      'Name of the car model. It should be between 3 and 96 characters long.',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(96)
  @IsNotEmpty()
  model: string;
}
