import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }
    try {
      let newUser = this.usersRepository.create({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });
      newUser = await this.usersRepository.save(newUser);

      return newUser;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
