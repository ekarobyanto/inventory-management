import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../common/dtos/create_user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject()
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  async login(@Res() res: Response, @Body() body: LoginDto) {
    const access_token = await this.authService.login(body);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'login success', data: { access_token } });
  }

  @Post('/register')
  async register(@Res() res: Response, @Body() body: CreateUserDto) {
    await this.authService.register(body);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'registration success' });
  }
}
