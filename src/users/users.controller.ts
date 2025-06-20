import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';

import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { GetActiveUser } from '../auth/decorators/getActiveUser';
import { ActiveUserData } from '../auth/interfaces/active-user.interface';
import { UpdateMeDto } from './dtos/update-me.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Admin and Dealer Routes

  @Get()
  @Roles(Role.Admin, Role.Dealer)
  @ApiOperation({
    summary: 'Fetch all users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully!',
  })
  getAllUsers(@GetActiveUser() user: ActiveUserData) {
    return this.usersService.getAllUsers(user.sub);
  }

  @Get('/:id')
  @Roles(Role.Admin, Role.Dealer)
  @ApiOperation({
    summary: 'Fetch single user.',
  })
  getSingleUser(@Param('id') id: number) {
    return this.usersService.getSingleUser(id);
  }

  @Patch('/:id')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Update any user role by admin.',
  })
  updateUserRole(
    @Param('id') id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateUserRole(id, updateUserRoleDto);
  }

  @Patch('toggleBlock/:id')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Block any user by admin',
  })
  blockUser(@Param('id') id: number) {
    return this.usersService.toggleBlockUser(id);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Delete any user by admin.',
  })
  deleteUser(@Param('id') id: number) {
    return this.usersService.removeUser(id);
  }

  // Current Logged-in User Routes

  @Get('me/profile')
  @ApiOperation({
    summary: 'Fetch current logged-in user profile.',
  })
  async getCurrentUser(@GetActiveUser() user: ActiveUserData) {
    const foundUser = user.googleId
      ? await this.usersService.findeOneByGoogleId(user.googleId)
      : await this.usersService.getSingleUser(user.sub);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }

  @Patch('me/update-profile')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiOperation({
    summary: 'Update current logged-in user profile.',
  })
  updateMe(
    @GetActiveUser() user: ActiveUserData,
    @Body() updateMeDto: UpdateMeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.usersService.updateMe(user.sub, updateMeDto, file);
  }

  @Delete('me/delete-account')
  @ApiOperation({
    summary: 'Delete current logged-in user account.',
  })
  deleteAccount(@GetActiveUser() user: ActiveUserData) {
    return this.usersService.deleteAccount(user.sub);
  }
}
