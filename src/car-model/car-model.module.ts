import { Module } from '@nestjs/common';
import { CarModelService } from './car-model.service';
import { CarModelController } from './car-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModel } from './car-model.entity';
import { Manufacturer } from 'src/manufacturer/manufacturer.entity';
import { CarModelProvider } from './providers/car-model.provider';

@Module({
  imports: [TypeOrmModule.forFeature([CarModel, Manufacturer])],
  providers: [CarModelService, CarModelProvider],
  controllers: [CarModelController],
  exports: [CarModelService],
})
export class CarModelModule {}
