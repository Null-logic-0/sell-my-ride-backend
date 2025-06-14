import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CarModelService } from './car-model.service';
import { CreateCarModelDto } from './dtos/create-car-model.dto';
import { UpdateCarModelDto } from './dtos/update-car-model.dto';

@Controller('car-model')
export class CarModelController {
  constructor(private readonly carModelService: CarModelService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch all car models.',
  })
  getAllManufacturers() {
    return this.carModelService.getAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create new car model.',
  })
  createManufacturer(@Body() createCarModelDto: CreateCarModelDto) {
    return this.carModelService.create(createCarModelDto);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Update car model.',
  })
  updateManufacturer(
    @Param('id') id: number,
    @Body() updateCarModelDto: UpdateCarModelDto,
  ) {
    return this.carModelService.update(id, updateCarModelDto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete car model.',
  })
  deleteManufacturer(@Param('id') id: number) {
    return this.carModelService.delete(id);
  }
}
