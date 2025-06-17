import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { GetActiveUser } from './decorators/getActiveUser';
import { ActiveUserData } from './interfaces/active-user.interface';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({
    summary: 'Sign-up user.',
  })
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @ApiOperation({
    summary: 'Sign-in user.',
  })
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.singIn(signInDto);
  }

  @Post('sign-out')
  @ApiOperation({
    summary: 'Sign-out current logged-in user.',
  })
  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  signOut(@GetActiveUser() user: ActiveUserData) {
    return this.authService.signOut(user.sub);
  }

  @Post('refresh-tokens')
  @ApiOperation({
    summary: 'Refresh-token.',
  })
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  async refreshTokens(@Body() refreshTokenDTo: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDTo);
  }

  @Patch('update-password')
  @ApiOperation({
    summary: 'Update current logged-in user password.',
  })
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Update current logged-in user password' })
  updatePassword(
    @GetActiveUser() user: ActiveUserData,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(user.sub, updatePasswordDto);
  }
}
