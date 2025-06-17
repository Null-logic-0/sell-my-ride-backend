import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserData } from '../interfaces/active-user.interface';

export const GetActiveUser = createParamDecorator(
  (data: ActiveUserData, ctx: ExecutionContext): ActiveUserData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
