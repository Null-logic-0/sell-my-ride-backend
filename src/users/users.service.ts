import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const newUser = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllUsers() {
    try {
      return await this.usersRepository.find();
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
      throw new BadRequestException(error);
    }
  }

  async updateUser(id: number, attrs: Partial<User>) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found with this ID!');
      }
      if ('email' in attrs || 'password' in attrs) {
        throw new NotAcceptableException('Invalid update');
      }
      Object.assign(user, attrs);
      return this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error || 'Invalid update');
    }
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
      throw new BadRequestException(error);
    }
  }
}
