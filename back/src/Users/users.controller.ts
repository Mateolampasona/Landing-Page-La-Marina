/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.services';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { ModifyUserDto } from './dto/modifyUser.dto';
import { Role } from 'src/Auth/enum/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/Auth/roles.guard';
import { BanUserDto } from './dto/banUser.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users', type: [User] })
  @ApiResponse({ status: 404, description: 'No users found' })
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<User[]> {
    try {
      return this.userService.getUsers();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('email')
  async getUserByEmail(@Body() data: any) {
    const email = data.email;
    console.log('email:', email);
    try {
      return await this.userService.getUserByEmail(email);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put('modify')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  async updateUser(@Body() modifyUserDto: ModifyUserDto, @Req() req) {
    const userId = req.user.userId;
    try {
      return await this.userService.updateUser(userId, modifyUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create user ' })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'User deleted', type: User })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: number): Promise<{ message: string }> {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put(':id/ban')
  @ApiOperation({ summary: 'Ban user by id' })
  @ApiResponse({ status: 200, description: 'User banned', type: User })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  async banUser(@Param('id') id: number, @Body() data: BanUserDto) {
    try {
      return await this.userService.banUser(id, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put(':id/unban')
  @ApiOperation({ summary: 'Unban user by id' })
  @ApiResponse({ status: 200, description: 'User Unbanned', type: User })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  async unbanUser(@Param('id') id: number) {
    try {
      return await this.userService.unbanUser(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'Return user by id', type: User })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: number): Promise<User> {
    try {
      return await this.userService.getOneUser(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
