import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCarListDto } from './create-car-listing.dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCarListingDto extends PartialType(CreateCarListDto) {
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
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  photos?: string[];
}
