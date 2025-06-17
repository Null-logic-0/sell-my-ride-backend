import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from './hashing.provider';
import { SignUpDto } from '../dtos/sign-up.dto';
import { Role } from '../enums/role.enum';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignUpProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: signUpDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }
    try {
      let newUser = this.usersRepository.create({
        ...signUpDto,
        role: Role.User,
        password: await this.hashingProvider.hashPassword(signUpDto.password),
      });

      newUser = await this.usersRepository.save(newUser);
      const tokens = await this.generateTokensProvider.generateToken(newUser);

      return {
        tokens,
        newUser,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
