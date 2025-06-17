import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/auth/constants/auth.constants';
import { Role } from 'src/auth/enums/role.enum';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as ActiveUserData;

    const role = requiredRoles.includes(user.role);
    if (!user || !role) {
      throw new ForbiddenException(
        `Access denied: only [${requiredRoles.join(', ')}] roles are allowed`,
      );
    }
    return role;
  }
}
