import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    example: Role.Dealer,
    enum: Role,
    description: 'User role',
  })
  @IsEnum(Role, {
    message: `role must be one of the following values: ${Object.values(Role).join(', ')}`,
  })
  role?: Role;
}
