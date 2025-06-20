import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { UpdateUserProvider } from './providers/update-user.provider';
import { S3Module } from '../uploads/s3.module';
import { FindOneByGoogleIdProvider } from './providers/find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    S3Module,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService, FindOneUserByEmailProvider, UpdateUserProvider, FindOneByGoogleIdProvider, CreateGoogleUserProvider],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
