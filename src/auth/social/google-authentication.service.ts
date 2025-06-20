import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from 'src/users/users.service';
import { GenerateTokensProvider } from '../providers/generate-tokens.provider';
import { GoogleTokenDto } from './dtos/google-token.dto';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleSecret;

    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      const payload = loginTicket.getPayload();

      if (!payload) {
        throw new Error('Invalid Google token payload');
      }

      const {
        email,
        sub: googleId,
        name: userName,
        picture: profileImage,
      } = payload;

      let user = await this.usersService.findeOneByGoogleId(googleId);

      if (!user) {
        if (!email || !googleId || !userName) {
          throw new UnauthorizedException(
            'Missing required Google profile fields',
          );
        }
        user = await this.usersService.createGoogleUser({
          email,
          userName,
          googleId,
          profileImage,
        });
      }

      const tokens = await this.generateTokensProvider.generateToken(user);

      return {
        ...tokens,
        user,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
