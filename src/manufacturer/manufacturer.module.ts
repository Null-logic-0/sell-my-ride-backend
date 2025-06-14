import { Module } from '@nestjs/common';
import { ManufacturerService } from './manufacturer.service';
import { ManufacturerController } from './manufacturer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer } from './manufacturer.entity';
import { CarModel } from 'src/car-model/car-model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer, CarModel])],
  providers: [ManufacturerService],
  controllers: [ManufacturerController],
  exports: [ManufacturerService],
})
export class ManufacturerModule {}
