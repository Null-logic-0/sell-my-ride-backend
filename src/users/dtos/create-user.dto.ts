import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'userName: "John Doe"',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  userName: string;

  @ApiProperty({
    example: 'email: "john@exampe.com"',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  @ApiProperty({
    description: 'Image for users profile',
    example: 'http://localhost.com/images/profile-image.png',
  })
  @IsString()
  @MaxLength(1024)
  @IsUrl()
  @IsOptional()
  profileImage?: string;

  @ApiProperty({
    description: 'Users password',
    example: 'password: "John1234$"',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/, {
    message:
      'Password must contain at least one special character and be 6+ characters long',
  })
  password: string;
}
