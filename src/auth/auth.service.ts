import { Injectable } from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { SignInProvider } from './providers/sign-in.provider';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignUpProvider } from './providers/sign-up.provider';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UpdatePasswordProvider } from './providers/update-password.provider';
import { SignOutProvider } from './providers/sign-out.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly signInProvider: SignInProvider,

    private readonly signUpProvider: SignUpProvider,

    private readonly refreshTokenProvider: RefreshTokensProvider,

    private readonly updatePasswordProvider: UpdatePasswordProvider,

    private readonly signOutProvider: SignOutProvider,
  ) {}

  singIn(signInDto: SignInDto) {
    return this.signInProvider.singIn(signInDto);
  }

  signUp(signUpDto: SignUpDto) {
    return this.signUpProvider.signUp(signUpDto);
  }

  signOut(userId: number) {
    return this.signOutProvider.signOut(userId);
  }

  refreshTokens(refreshTokenDTo: RefreshTokenDto) {
    return this.refreshTokenProvider.refreshTokens(refreshTokenDTo);
  }

  updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    return this.updatePasswordProvider.updatePassword(
      userId,
      updatePasswordDto,
    );
  }
}
