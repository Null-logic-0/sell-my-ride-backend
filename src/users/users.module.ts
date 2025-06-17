import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, FindOneUserByEmailProvider],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
