import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SignInProvider } from './providers/sign-in.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { SignUpProvider } from './providers/sign-up.provider';
import { UpdatePasswordProvider } from './providers/update-password.provider';
import { SignOutProvider } from './providers/sign-out.provider';
import { SignInDto } from './dtos/sign-in.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

describe('AuthService', () => {
  let service: AuthService;
  let signInProvider: SignInProvider;
  let signUpProvider: SignUpProvider;
  let refreshTokenProvider: RefreshTokensProvider;
  let updatePasswordProvider: UpdatePasswordProvider;
  let signOutProvider: SignOutProvider;

  const mockSignInProvider = {
    singIn: jest.fn(),
  };

  const mockSignUpProvider = {
    signUp: jest.fn(),
  };

  const mockRefreshTokensProvider = {
    refreshTokens: jest.fn(),
  };

  const mockUpdatePasswordProvider = {
    updatePassword: jest.fn(),
  };

  const mockSignOutProvider = {
    signOut: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: SignInProvider,
          useValue: mockSignInProvider,
        },
        {
          provide: SignUpProvider,
          useValue: mockSignUpProvider,
        },
        {
          provide: RefreshTokensProvider,
          useValue: mockRefreshTokensProvider,
        },
        {
          provide: UpdatePasswordProvider,
          useValue: mockUpdatePasswordProvider,
        },
        {
          provide: SignOutProvider,
          useValue: mockSignOutProvider,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    signInProvider = module.get<SignInProvider>(SignInProvider);
    signUpProvider = module.get<SignUpProvider>(SignUpProvider);
    refreshTokenProvider = module.get<RefreshTokensProvider>(
      RefreshTokensProvider,
    );
    updatePasswordProvider = module.get<UpdatePasswordProvider>(
      UpdatePasswordProvider,
    );
    signOutProvider = module.get<SignOutProvider>(SignOutProvider);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('singIn', () => {
    it('should call signInProvider.singIn and return its result', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const expectedResult = {
        accessToken: 'mockToken',
        refreshToken: 'mockRefresh',
      };
      mockSignInProvider.singIn.mockResolvedValue(expectedResult);

      const result = await service.singIn(signInDto);

      expect(signInProvider.singIn).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('signUp', () => {
    it('should call signUpProvider.signUp and return its result', async () => {
      const signUpDto: SignUpDto = {
        email: 'new@example.com',
        password: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
        userName: 'newuser',
      };
      const expectedResult = { message: 'User created' };
      mockSignUpProvider.signUp.mockResolvedValue(expectedResult);

      const result = await service.signUp(signUpDto);

      expect(signUpProvider.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('signOut', () => {
    it('should call signOutProvider.signOut with the correct userId', async () => {
      const userId = 1;
      const expectedResult = { message: 'Logged out' };
      mockSignOutProvider.signOut.mockResolvedValue(expectedResult);

      const result = await service.signOut(userId);

      expect(signOutProvider.signOut).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('refreshTokens', () => {
    it('should call refreshTokenProvider.refreshTokens and return new tokens', async () => {
      const refreshTokenDto: RefreshTokenDto = { refreshToken: 'oldRefresh' };
      const expectedResult = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefresh',
      };
      mockRefreshTokensProvider.refreshTokens.mockResolvedValue(expectedResult);

      const result = await service.refreshTokens(refreshTokenDto);

      expect(refreshTokenProvider.refreshTokens).toHaveBeenCalledWith(
        refreshTokenDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updatePassword', () => {
    it('should call updatePasswordProvider.updatePassword with userId and DTO', async () => {
      const userId = 1;
      const updatePasswordDto: UpdatePasswordDto = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      };
      const expectedResult = { message: 'Password updated' };
      mockUpdatePasswordProvider.updatePassword.mockResolvedValue(
        expectedResult,
      );

      const result = await service.updatePassword(userId, updatePasswordDto);

      expect(updatePasswordProvider.updatePassword).toHaveBeenCalledWith(
        userId,
        updatePasswordDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
