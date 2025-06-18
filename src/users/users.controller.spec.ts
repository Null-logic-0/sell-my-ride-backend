import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UpdateMeDto } from './dtos/update-me.dto';
import { Role } from '../auth/enums/role.enum';
import { ActiveUserData } from '../auth/interfaces/active-user.interface';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    getAllUsers: jest.fn(),
    getSingleUser: jest.fn(),
    updateUserRole: jest.fn(),
    toggleBlockUser: jest.fn(),
    removeUser: jest.fn(),
    updateMe: jest.fn(),
    deleteAccount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should call usersService.getAllUsers with user.sub', async () => {
      const mockUser = {
        sub: 1,
        email: 'test@example.com',
        role: Role.User,
        tokenVersion: 0,
      };
      await controller.getAllUsers(mockUser);
      expect(usersService.getAllUsers).toHaveBeenCalledWith(1);
    });
  });

  describe('getSingleUser', () => {
    it('should call usersService.getSingleUser with ID', async () => {
      await controller.getSingleUser(2);
      expect(usersService.getSingleUser).toHaveBeenCalledWith(2);
    });
  });

  describe('updateUserRole', () => {
    it('should call usersService.updateUserRole with ID and DTO', async () => {
      const dto: UpdateUserRoleDto = { role: Role.Admin };
      await controller.updateUserRole(3, dto);
      expect(usersService.updateUserRole).toHaveBeenCalledWith(3, dto);
    });
  });

  describe('blockUser', () => {
    it('should call usersService.toggleBlockUser with ID', async () => {
      await controller.blockUser(4);
      expect(usersService.toggleBlockUser).toHaveBeenCalledWith(4);
    });
  });

  describe('deleteUser', () => {
    it('should call usersService.removeUser with ID', async () => {
      await controller.deleteUser(5);
      expect(usersService.removeUser).toHaveBeenCalledWith(5);
    });
  });

  describe('getCurrentUser', () => {
    it('should call usersService.getSingleUser with user.sub', async () => {
      const mockUser: ActiveUserData = {
        sub: 1,
        email: 'test@example.com',
        role: Role.User,
        tokenVersion: 0,
      };
      await controller.getCurrentUser(mockUser);
      expect(usersService.getSingleUser).toHaveBeenCalledWith(1);
    });
  });

  describe('updateMe', () => {
    it('should call usersService.updateMe with sub, dto, and file', async () => {
      const mockUser: ActiveUserData = {
        sub: 1,
        email: 'test@example.com',
        role: Role.User,
        tokenVersion: 0,
      };
      const dto: UpdateMeDto = { name: 'Test User' } as any;
      const file = { originalname: 'test.png' } as Express.Multer.File;

      await controller.updateMe(mockUser, dto, file);
      expect(usersService.updateMe).toHaveBeenCalledWith(1, dto, file);
    });
  });

  describe('deleteAccount', () => {
    it('should call usersService.deleteAccount with user.sub', async () => {
      const mockUser: ActiveUserData = {
        sub: 1,
        email: 'test@example.com',
        role: Role.Admin,
        tokenVersion: 0,
      };
      await controller.deleteAccount(mockUser);
      expect(usersService.deleteAccount).toHaveBeenCalledWith(1);
    });
  });
});
