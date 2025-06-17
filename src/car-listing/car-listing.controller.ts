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
import { ActiveUser } from 'src/auth/decorators/active-user.decoretor';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PriceRange } from './enums/price-range.enum';
import { CarBodyType } from './enums/car-body-types.enum';
import { CarStatus } from './enums/car-status.enum';

@Controller('car-listing')
export class CarListingController {
  constructor(private readonly carListingService: CarListingService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch all cars',
  })
  @Auth(AuthType.None)
  async getAllCarLists(
    @Query('year') year?: number,
    @Query('priceRange') priceRange?: PriceRange,
    @Query('model') model?: string,
    @Query('manufacturer') manufacturer?: string,
    @Query('city') city?: string,
    @Query('bodyType') bodyType?: CarBodyType,
    @Query('carStatus') carStatus?: CarStatus,
    @Query('inStock') inStock?: boolean,
  ) {
    return this.carListingService.getAll({
      year,
      priceRange,
      model,
      manufacturer,
      city,
      bodyType,
      carStatus,
      inStock,
    });
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
