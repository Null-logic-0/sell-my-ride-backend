import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { UpdateUserProvider } from './providers/update-user.provider';
import { S3Module } from 'src/uploads/s3.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    S3Module,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService, FindOneUserByEmailProvider, UpdateUserProvider],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
