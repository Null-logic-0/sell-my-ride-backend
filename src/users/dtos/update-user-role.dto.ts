import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    example: Role.Dealer,
  })
  @IsEnum({
    description: 'User role',
    enum: Role,
    example: Role.Dealer,
  })
  role?: Role;
}
