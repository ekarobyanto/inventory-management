import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { UpdateUserDto } from './dto/update_user.dto';
import { responseWriter } from 'src/utils/response_writer.util';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from './user.entity';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    @Inject()
    private readonly userService: UserService,
  ) {}

  @Get('/profile')
  async getUserProfile(@Res() res: Response, @Req() req) {
    const user = req.user;

    if (user) {
      return responseWriter(
        res,
        HttpStatus.OK,
        'User profile retrieved successfully',
        user,
      );
    }

    throw new HttpException('user not found', HttpStatus.NOT_FOUND);
  }

  @Get()
  async getUsers(@Res() res: Response) {
    const users = await this.userService.getUsers();
    if (users) {
      return responseWriter(
        res,
        HttpStatus.OK,
        'users retrieved successfully',
        users,
      );
    }
    throw new HttpException('No users found', HttpStatus.NOT_FOUND);
  }
  @Get(':id')
  async getUserById(@Res() res: Response, @Param('id') id: string) {
    const user = await this.userService.getUserById(Number(id));
    if (user) {
      return responseWriter(
        res,
        HttpStatus.OK,
        'user retrieved successfully',
        user,
      );
    }
    throw new HttpException('No user found', HttpStatus.NOT_FOUND);
  }

  @Put()
  async updateUser(
    @Req() req,
    @Res() res: Response,
    @Body() requestBody: UpdateUserDto,
  ) {
    const user: User = req.user;
    await this.userService.updateUser(user.id, requestBody);
    return responseWriter(res, HttpStatus.OK, 'user updated successfully');
  }

  @Delete(':id')
  async deleteUser(@Res() res: Response, @Param('id') id: string) {
    await this.userService.deleteUser(Number(id));
    return responseWriter(res, HttpStatus.OK, 'user deleted succesfully');
  }
}
