import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { UpdateUserProvider } from './providers/update-user.provider';
import { Role } from '../auth/enums/role.enum';
import {
  NotFoundException,
  UnauthorizedException,
  BadRequestException, // Import BadRequestException
} from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;
  let findOneUserByEmailProvider: FindOneUserByEmailProvider;
  let updateUserProvider: UpdateUserProvider;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockUpdateUserProvider = {
    update: jest.fn(),
  };

  const mockFindOneUserByEmailProvider = {
    findOneByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: FindOneUserByEmailProvider,
          useValue: mockFindOneUserByEmailProvider,
        },
        {
          provide: UpdateUserProvider,
          useValue: mockUpdateUserProvider,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return all users except current user', async () => {
      const users = [{ id: 2 }, { id: 3 }];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.getAllUsers(1);
      expect(result).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { id: expect.any(Object) },
      });
    });
  });

  describe('getSingleUser', () => {
    it('should return user by ID', async () => {
      const user = { id: 1 };
      mockRepository.findOneBy.mockResolvedValue(user);
      const result = await service.getSingleUser(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.getSingleUser(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUserRole', () => {
    it('should update role if valid', async () => {
      const user = { id: 1, role: Role.User };
      mockRepository.findOneBy.mockResolvedValue(user);
      mockRepository.save.mockResolvedValue({ ...user, role: Role.Admin });

      const result = await service.updateUserRole(1, { role: Role.Admin });
      expect(result.role).toBe(Role.Admin);
    });

    it('should throw if user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(
        service.updateUserRole(1, { role: Role.Admin }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if invalid fields are included', async () => {
      mockRepository.findOneBy.mockResolvedValue({});
      await expect(
        service.updateUserRole(1, { email: 'x@test.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if role is invalid or missing', async () => {
      mockRepository.findOneBy.mockResolvedValue({});
      await expect(
        service.updateUserRole(1, { role: 'invalid' as Role }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateMe', () => {
    it('should delegate update to updateUserProvider', async () => {
      mockUpdateUserProvider.update.mockResolvedValue('updated');
      const result = await service.updateMe(1, { userName: 'New' }, {} as any);
      expect(result).toBe('updated');
      expect(mockUpdateUserProvider.update).toHaveBeenCalledWith(
        1,
        { userName: 'New' },
        {},
      );
    });
  });

  describe('removeUser', () => {
    it('should remove existing user', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 1 });
      mockRepository.remove.mockResolvedValue({});

      const result = await service.removeUser(1);
      expect(result).toEqual({ deleted: true, id: 1 });
    });

    it('should throw NotFound if user does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.removeUser(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAccount', () => {
    it('should delete account if exists', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 1 });
      mockRepository.remove.mockResolvedValue({});
      const result = await service.deleteAccount(1);
      expect(result).toEqual({ deleted: true, id: 1 });
    });

    it('should throw Unauthorized if user does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.deleteAccount(1)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('toggleBlockUser', () => {
    it('should toggle user block state', async () => {
      const user = { id: 1, isBlocked: false };
      mockRepository.findOneBy.mockResolvedValue(user);
      mockRepository.save.mockResolvedValue({ ...user, isBlocked: true });

      const result = await service.toggleBlockUser(1);
      expect(result.blocked).toBe(true);
    });

    it('should throw NotFound if user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.toggleBlockUser(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should call findOneUserByEmailProvider', async () => {
      mockFindOneUserByEmailProvider.findOneByEmail.mockResolvedValue({
        id: 1,
      });
      const result = await service.findOneByEmail('test@example.com');
      expect(result).toEqual({ id: 1 });
    });
  });
});
