import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';
import { Match } from '../decorators/match.decorator';

export class SignUpDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  userName: string;

  @ApiProperty({
    example: 'john@exampe.com',
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
    example: 'John1234$',
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

  @ApiProperty({
    description: 'Confirm password',
    example: 'John1234$',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @IsOptional()
  @IsEnum(Role)
  readonly role?: Role;
}
