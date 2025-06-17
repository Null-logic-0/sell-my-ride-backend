import { Module } from '@nestjs/common';
import { CarListingService } from './car-listing.service';
import { CarListingController } from './car-listing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarList } from './car-listing.entity';
import { UsersModule } from 'src/users/users.module';
import { CarModel } from 'src/car-model/car-model.entity';
import { Manufacturer } from 'src/manufacturer/manufacturer.entity';
import { CreateCarListingProvider } from './providers/create-car-listing.provider';
import { S3Module } from 'src/uploads/s3.module';
import { UpdateCarListingProvider } from './providers/update-car-listing.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarList, CarModel, Manufacturer]),
    UsersModule,
    S3Module,
  ],
  providers: [CarListingService, CreateCarListingProvider, UpdateCarListingProvider],
  controllers: [CarListingController],
  exports: [TypeOrmModule, CarListingService],
})
export class CarListingModule {}
