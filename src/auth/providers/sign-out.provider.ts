import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SignOutProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async signOut(userId: number): Promise<{ message: string }> {
    try {
      const result = await this.usersRepository.increment(
        { id: userId },
        'tokenVersion',
        1,
      );

      if (result.affected === 0) {
        throw new UnauthorizedException('You are not logged-in!');
      }
      return { message: 'Successfully signed out' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
