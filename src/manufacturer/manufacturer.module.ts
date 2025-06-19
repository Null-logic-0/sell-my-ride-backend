import { Module } from '@nestjs/common';
import { ManufacturerService } from './manufacturer.service';
import { ManufacturerController } from './manufacturer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer } from './manufacturer.entity';
import { CarModel } from '../car-model/car-model.entity';
import { UpdateManufacturerProvider } from './providers/update-manufacturer.provider';
import { S3Module } from 'src/uploads/s3.module';
import { CreateManufacturerProvider } from './providers/create-manufacturer.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer, CarModel]), S3Module],
  providers: [
    ManufacturerService,
    UpdateManufacturerProvider,
    CreateManufacturerProvider,
  ],
  controllers: [ManufacturerController],
  exports: [ManufacturerService],
})
export class ManufacturerModule {}
