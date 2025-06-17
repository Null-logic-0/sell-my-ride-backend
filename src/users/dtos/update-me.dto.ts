import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateMeDto {
  @ApiProperty({
    example: 'userName: "John Doe"',
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  @MaxLength(96)
  userName?: string;

  @ApiProperty({
    description: 'Image for users profile',
    example: 'http://localhost.com/images/profile-image.png',
  })
  @IsString()
  @MaxLength(1024)
  @IsUrl()
  @IsOptional()
  profileImage?: string;
}
