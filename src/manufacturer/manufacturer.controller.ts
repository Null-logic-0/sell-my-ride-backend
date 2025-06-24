import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ManufacturerService } from './manufacturer.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateManufacturerDto } from './dtos/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dtos/update-manufacturer.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';
import { GetActiveUser } from 'src/auth/decorators/getActiveUser';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('image'))
  createManufacturer(
    @Body() createManufacturerDto: CreateManufacturerDto,
    @GetActiveUser() user: ActiveUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.manufacturerService.create(
      createManufacturerDto,
      user.sub,
      file,
    );
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Fetch single manufacturer',
  })
  @Auth(AuthType.None)
  getSingleManufacturer(@Param('id') id: number) {
    return this.manufacturerService.getOne(id);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Update manufacturer.',
  })
  @Roles(Role.Admin, Role.Dealer)
  @UseInterceptors(FileInterceptor('image'))
  updateManufacturer(
    @Param('id') id: number,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
    @GetActiveUser() user: ActiveUserData,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.manufacturerService.update(
      id,
      user.sub,
      updateManufacturerDto,
      file,
    );
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
