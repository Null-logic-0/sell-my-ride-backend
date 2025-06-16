import { Injectable } from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { SignInProvider } from './providers/sign-in.provider';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly signInProvider: SignInProvider,

    private readonly refreshTokenProvider: RefreshTokensProvider,
  ) {}

  singIn(signInDto: SignInDto) {
    return this.signInProvider.singIn(signInDto);
  }

  refreshTokens(refreshTokenDTo: RefreshTokenDto) {
    return this.refreshTokenProvider.refreshTokens(refreshTokenDTo);
  }
}
