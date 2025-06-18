import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { ActiveUserData } from './interfaces/active-user.interface';
import { Role } from './enums/role.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    singIn: jest.fn(),
    signOut: jest.fn(),
    refreshTokens: jest.fn(),
    updatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call authService.signUp and return the result', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        userName: 'testuser',
      };
      const expectedResult = { message: 'User registered successfully' };
      mockAuthService.signUp.mockResolvedValue(expectedResult);

      const result = await controller.signUp(signUpDto);

      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('signIn', () => {
    it('should call authService.singIn and return the tokens', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const expectedResult = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      };
      mockAuthService.singIn.mockResolvedValue(expectedResult);

      const result = await controller.signIn(signInDto);

      expect(authService.singIn).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('signOut', () => {
    it('should call authService.signOut with the user ID', async () => {
      const activeUser: ActiveUserData = {
        sub: 1,
        email: 'test@example.com',
        role: Role.User,
        tokenVersion: 0,
      };
      const expectedResult = { message: 'Logged out successfully' };
      mockAuthService.signOut.mockResolvedValue(expectedResult);

      const result = await controller.signOut(activeUser);

      expect(authService.signOut).toHaveBeenCalledWith(activeUser.sub);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('refreshTokens', () => {
    it('should call authService.refreshTokens and return new tokens', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'oldRefreshToken',
      };
      const expectedResult = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };
      mockAuthService.refreshTokens.mockResolvedValue(expectedResult);

      const result = await controller.refreshTokens(refreshTokenDto);

      expect(authService.refreshTokens).toHaveBeenCalledWith(refreshTokenDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updatePassword', () => {
    it('should call authService.updatePassword with user ID and DTO', async () => {
      const activeUser: ActiveUserData = {
        sub: 1,
        email: 'test@example.com',
        role: Role.User,
        tokenVersion: 0,
      };
      const updatePasswordDto: UpdatePasswordDto = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      };
      const expectedResult = { message: 'Password updated successfully' };
      mockAuthService.updatePassword.mockResolvedValue(expectedResult);

      const result = await controller.updatePassword(
        activeUser,
        updatePasswordDto,
      );

      expect(authService.updatePassword).toHaveBeenCalledWith(
        activeUser.sub,
        updatePasswordDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
