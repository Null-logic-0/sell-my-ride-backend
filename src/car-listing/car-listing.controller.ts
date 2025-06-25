import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CarListingService } from './car-listing.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCarListDto } from './dtos/create-car-listing.dto';
import { UpdateCarListingDto } from './dtos/update-car-listing.dto';
import { ActiveUser } from '../auth/decorators/active-user.decoretor';
import { ActiveUserData } from '../auth/interfaces/active-user.interface';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { FilesInterceptor } from '@nestjs/platform-express';

import { PaginationQueryDto } from '../common/pagination/dtos/pagination-query.dto';

@Controller('car-listing')
export class CarListingController {
  constructor(private readonly carListingService: CarListingService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch all cars',
  })
  @Auth(AuthType.None)
  async getAllCarLists(@Query() query: PaginationQueryDto) {
    const { limit, page, ...filters } = query;
    return this.carListingService.getAll(filters, { limit, page });
  }

  @Get('/my-lists')
  @ApiOperation({
    summary: 'Fetch all cars for current user',
  })
  async getAllCarForUser(
    @Query() paginateCarList: PaginationQueryDto,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    return this.carListingService.getAllForUser(activeUser, paginateCarList);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('photos', 10))
  @ApiOperation({
    summary: 'Create car listing',
  })
  async createCarListing(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createCarListingDto: CreateCarListDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.carListingService.create(
      createCarListingDto,
      createCarListingDto.modelId,
      createCarListingDto.manufacturerId,
      user,
      files,
    );
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Fetch single car list',
  })
  @Auth(AuthType.None)
  async getSingleCarList(@Param('id') id: number) {
    return this.carListingService.getOne(id);
  }

  @Patch('/:id')
  @UseInterceptors(FilesInterceptor('photos', 10))
  @ApiOperation({
    summary: 'Update single car list',
  })
  async updateSingleCarList(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: number,
    @Body() updateCarListingDto: UpdateCarListingDto,
  ) {
    return this.carListingService.update(id, updateCarListingDto, files);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete single car list',
  })
  async deleteCarList(@Param('id') id: number) {
    return this.carListingService.delete(id);
  }
}
