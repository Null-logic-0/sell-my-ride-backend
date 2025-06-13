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

@Controller('car-listing')
export class CarListingController {
  constructor(private readonly carListingService: CarListingService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch all cars',
  })
  async getAllCarLists() {}

  @Post()
  @ApiOperation({
    summary: 'Create car listing',
  })
  async createCarListing(@Body() createCarListingDto: any) {}

  @Get('/:id')
  @ApiOperation({
    summary: 'Fetch single car list',
  })
  async getSingleCarList(@Param('id') id: number) {}

  @Patch('/:id')
  @ApiOperation({
    summary: 'Fetch single car list',
  })
  async updateSingleCarList(
    @Param('id') id: number,
    @Body() createCarListingDto: any,
  ) {}

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete single car list',
  })
  async deleteCarList(@Param('id') id: number) {}
}
