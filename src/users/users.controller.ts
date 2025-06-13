import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch all users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully!',
  })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post()
  @ApiOperation({
    summary: 'Create new user.',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully!',
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Fetch single user.',
  })
  getSingleUser(@Param('id') id: number) {
    return this.usersService.getSingleUser(id);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Update  single user.',
  })
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete  single user.',
  })
  deleteUser(@Param('id') id: number) {
    return this.usersService.removeUser(id);
  }
}
