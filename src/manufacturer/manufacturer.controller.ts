import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ManufacturerService } from './manufacturer.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateManufacturerDto } from './dtos/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dtos/update-manufacturer.dto';

@Controller('manufacturer')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch all manufacturers.',
  })
  getAllManufacturers() {
    return this.manufacturerService.getAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create new manufacturer.',
  })
  createManufacturer(@Body() createManufacturerDto: CreateManufacturerDto) {
    return this.manufacturerService.create(createManufacturerDto);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Update manufacturer.',
  })
  updateManufacturer(
    @Param('id') id: number,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
  ) {
    return this.manufacturerService.update(id, updateManufacturerDto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete manufacturer',
  })
  deleteManufacturer(@Param('id') id: number) {
    return this.manufacturerService.delete(id);
  }
}
