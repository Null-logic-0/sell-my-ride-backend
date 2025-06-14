import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CarListingService } from './car-listing.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCarListDto } from './dtos/create-car-listing.dto';
import { UpdateCarListingDto } from './dtos/update-car-listing.dto';

@Controller('car-listing')
export class CarListingController {
  constructor(private readonly carListingService: CarListingService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch all cars',
  })
  async getAllCarLists() {
    return this.carListingService.getAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create car listing',
  })
  async createCarListing(@Body() createCarListingDto: CreateCarListDto) {
    return this.carListingService.create(
      createCarListingDto,
      createCarListingDto.modelId,
      createCarListingDto.manufacturerId,
    );
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Fetch single car list',
  })
  async getSingleCarList(@Param('id') id: number) {
    return this.carListingService.getOne(id);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Update single car list',
  })
  async updateSingleCarList(
    @Param('id') id: number,
    @Body() updateCarListingDto: UpdateCarListingDto,
  ) {
    return this.carListingService.update(id, updateCarListingDto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete single car list',
  })
  async deleteCarList(@Param('id') id: number) {
    return this.carListingService.delete(id);
  }
}
