import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ProductService } from '../product.service';
import { User } from 'src/modules/core/user/user.entity';

@Injectable()
export class ProductInStoreOwnershipGuard implements CanActivate {
  constructor(private readonly productService: ProductService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const { productId } = request.params;
    const product = await this.productService.getProductById(productId);
    if (product.store.owner.id !== user.id) {
      throw new HttpException(
        'User is not the owner of this product store',
        HttpStatus.BAD_REQUEST,
      );
    }
    request.store = product.store;
    return true;
  }
}
