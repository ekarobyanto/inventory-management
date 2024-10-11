import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/core/user/user.entity';
import { UserService } from 'src/modules/core/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return this.validateRequest(context);
  }

  async validateRequest(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken: string = request.headers.authorization;

    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      throw new HttpException(
        'Bearer token not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const token = bearerToken.split(' ')[1];
      this.jwtService.verify(token, { ignoreExpiration: true });
      const { id } = this.jwtService.decode(token);
      const user: User = await this.userService.getUserById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      request.user = user;
      return true;
    } catch (err) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
