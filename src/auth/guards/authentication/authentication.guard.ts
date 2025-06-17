import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AcessTokenGuard } from '../acess-token/acess-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  private authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AcessTokenGuard,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    const request = context.switchToHttp().getRequest();
    const error = new UnauthorizedException('Authentication failed');

    for (const guard of guards) {
      const passed = await Promise.resolve(guard.canActivate(context)).catch(
        () => false,
      );

      if (passed) {
        // Optional tokenVersion validation
        if (authTypes.includes(AuthType.Bearer)) {
          const user = request.user;
          if (!user || !user.sub) throw error;

          const dbUser = await this.usersRepository.findOneBy({ id: user.sub });
          if (!dbUser || dbUser.tokenVersion !== user.tokenVersion) {
            throw new UnauthorizedException('Token has been revoked');
          }
        }

        return true;
      }
    }

    throw error;
  }
}
