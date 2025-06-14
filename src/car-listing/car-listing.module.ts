import { Module } from '@nestjs/common';
import { CarListingService } from './car-listing.service';
import { CarListingController } from './car-listing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarList } from './car-listing.entity';
import { CreateCarListingProvider } from './providers/create-car-listing.provider';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([CarList]), UsersModule],
  providers: [CarListingService, CreateCarListingProvider],
  controllers: [CarListingController],
  exports: [TypeOrmModule, CarListingService],
})
export class CarListingModule {}
