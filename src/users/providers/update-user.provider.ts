import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/uploads/s3.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class UpdateUserProvider {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async update(
    userId: number,
    attrs: Partial<User>,
    file?: Express.Multer.File,
  ) {
    try {
      const user = await this.usersRepository.findOneBy({
        id: userId,
      });
      if (!user) {
        throw new UnauthorizedException(
          'You are not logged in! Please login again.',
        );
      }
      if ('email' in attrs || 'password' in attrs) {
        throw new NotAcceptableException(
          'You cannot update email, password, or role here.',
        );
      }
      if (file) {
        const imageUrl = await this.s3Service.uploadProfileImage(file, userId);
        attrs.profileImage = imageUrl;
      }

      Object.assign(user, attrs);
      return this.usersRepository.save(user);
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotAcceptableException
      ) {
        throw error;
      }
      throw new BadRequestException(error || 'Invalid update');
    }
  }
}
