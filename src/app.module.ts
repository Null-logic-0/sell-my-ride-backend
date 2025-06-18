import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import enviromentValidation from './config/enviroment.validation';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { CarListingModule } from './car-listing/car-listing.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { CarModelModule } from './car-model/car-model.module';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { AcessTokenGuard } from './auth/guards/acess-token/acess-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { RolesGuard } from './auth/guards/authentication/roles.guard';
import { S3Module } from './uploads/s3.module';
import { PaginationModule } from './common/pagination/pagination.module';

const ENV = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: enviromentValidation,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        synchronize: configService.get<boolean>('database.synchronize'),
        autoLoadEntities: configService.get<boolean>(
          'database.autoLoadEntities',
        ),
      }),
    }),
    ConfigModule.forFeature(jwtConfig),

    JwtModule.registerAsync(jwtConfig.asProvider()),

    UsersModule,

    CarListingModule,

    ManufacturerModule,

    CarModelModule,

    AuthModule,

    S3Module,

    PaginationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AcessTokenGuard,
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Then check roles
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
  ],
})
export class AppModule {}
