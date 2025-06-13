import { Module } from '@nestjs/common';
import { CarListingService } from './car-listing.service';
import { CarListingController } from './car-listing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarList } from './car-listing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarList])],
  providers: [CarListingService],
  controllers: [CarListingController],
  exports: [TypeOrmModule, CarListingService],
})
export class CarListingModule {}
