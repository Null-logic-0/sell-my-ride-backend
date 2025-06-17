import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Not, Repository } from 'typeorm';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { Role } from 'src/auth/enums/role.enum';
import { UpdateUserProvider } from './providers/update-user.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,

    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,

    private readonly updateUserProvider: UpdateUserProvider,
  ) {}

  async getAllUsers(currentUserId: number) {
    try {
      return await this.usersRepository.find({
        where: {
          id: Not(currentUserId),
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getSingleUser(id: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException('User not found with this ID!');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async updateUserRole(id: number, attrs: Partial<User>) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found with this ID!');
      }
      if (
        'email' in attrs ||
        'password' in attrs ||
        'userName' in attrs ||
        'profileImage' in attrs
      ) {
        throw new NotAcceptableException(
          'Invalid update: only role can be updated.',
        );
      }

      if (!attrs.role || !Object.values(Role).includes(attrs.role)) {
        throw new NotAcceptableException('Invalid or missing role value.');
      }

      Object.assign(user, attrs);
      return this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error || 'Invalid update');
    }
  }

  async updateMe(
    userId: number,
    attrs: Partial<User>,
    file?: Express.Multer.File,
  ) {
    return this.updateUserProvider.update(userId, attrs, file);
  }

  async removeUser(id: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found with this ID!');
      }
      await this.usersRepository.remove(user);
      return {
        deleted: true,
        id,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
  async deleteAccount(id: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new UnauthorizedException(
          'You are not logged in! Please login again.',
        );
      }
      await this.usersRepository.remove(user);
      return {
        deleted: true,
        id,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  public async findOneByEmail(email: string) {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
  }
}
