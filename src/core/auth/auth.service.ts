import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../common/dtos/create_user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject()
    private readonly jwtService: JwtService,
    @Inject()
    private readonly userService: UserService,
    @Inject()
    private readonly encryptionService: EncryptionService,
  ) {}

  async login(loginCredentials: LoginDto) {
    const user = await this.userService.getUserCredentialsByProperties({
      email: loginCredentials.email,
    });

    if (!user) {
      throw new HttpException('User not registered', HttpStatus.BAD_REQUEST);
    }

    const isPasswordMatch = await this.encryptionService.compareValue(
      loginCredentials.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    delete user['password'];

    const access_token = await this.jwtService.signAsync(
      JSON.parse(JSON.stringify(user)),
    );
    return access_token;
  }

  async register(registerCredentials: CreateUserDto) {
    return await this.userService.createUser(registerCredentials);
  }
}
