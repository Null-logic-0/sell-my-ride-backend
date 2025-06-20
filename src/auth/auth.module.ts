import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { SignUpProvider } from './providers/sign-up.provider';
import { UpdatePasswordProvider } from './providers/update-password.provider';
import { SignOutProvider } from './providers/sign-out.provider';
import { GoogleAuthenticationController } from './social/google-authentication.controller';
import { GoogleAuthenticationService } from './social/google-authentication.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SignInProvider,
    GenerateTokensProvider,
    RefreshTokensProvider,
    SignUpProvider,
    UpdatePasswordProvider,
    SignOutProvider,
    GoogleAuthenticationService,
  ],
  controllers: [AuthController, GoogleAuthenticationController],
  exports: [AuthService, HashingProvider],
})
export class AuthModule {}
