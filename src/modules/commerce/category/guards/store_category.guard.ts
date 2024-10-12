import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { User } from 'src/modules/core/user/user.entity';
import { CategoryService } from '../category.service';

@Injectable()
export class StoreCategoryGuard implements CanActivate {
  constructor(private readonly categoryService: CategoryService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const { categoryId } = request.params;
    const categories = await this.categoryService.getCategoryByUserId(
      user.id,
      categoryId,
    );
    if (categories.length === 0) {
      throw new HttpException(
        'Invalid Category ID provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }
}
