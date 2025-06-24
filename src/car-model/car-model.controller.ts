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
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('car-model')
export class CarModelController {
  constructor(private readonly carModelService: CarModelService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch all car models.',
  })
  @Auth(AuthType.None)
  getAllModels() {
    return this.carModelService.getAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create new car model.',
  })
  @Roles(Role.Admin, Role.Dealer)
  createNewModel(@Body() createCarModelDto: CreateCarModelDto) {
    return this.carModelService.create(createCarModelDto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Fetch single car model',
  })
  @Auth(AuthType.None)
  getOneModel(@Param('id') id: number) {
    return this.carModelService.getOne(id);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Update car model.',
  })
  @Roles(Role.Admin, Role.Dealer)
  updateModel(
    @Param('id') id: number,
    @Body() updateCarModelDto: UpdateCarModelDto,
  ) {
    return this.carModelService.update(id, updateCarModelDto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete car model.',
  })
  @Roles(Role.Admin, Role.Dealer)
  deleteModel(@Param('id') id: number) {
    return this.carModelService.delete(id);
  }
}
