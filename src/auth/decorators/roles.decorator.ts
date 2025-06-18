import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../../auth/constants/auth.constants';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
