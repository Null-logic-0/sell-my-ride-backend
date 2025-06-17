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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('manufacturer')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch all manufacturers.',
  })
  @Auth(AuthType.None)
  getAllManufacturers() {
    return this.manufacturerService.getAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create new manufacturer.',
  })
  @Roles(Role.Admin, Role.Dealer)
  createManufacturer(@Body() createManufacturerDto: CreateManufacturerDto) {
    return this.manufacturerService.create(createManufacturerDto);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Update manufacturer.',
  })
  @Roles(Role.Admin, Role.Dealer)
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
  @Roles(Role.Admin, Role.Dealer)
  deleteManufacturer(@Param('id') id: number) {
    return this.manufacturerService.delete(id);
  }
}
