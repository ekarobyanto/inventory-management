import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { ProductService } from '../product.service';

@Injectable()
export class ProductNameAlreadyExist implements CanActivate {
  constructor(private readonly productService: ProductService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { store_id, name } = request.body;
    const product = await this.productService.getProductByNameInStore(
      store_id,
      name,
    );
    console.log(product);
    if (product) {
      throw new HttpException(
        'Product with this name already exist in store',
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
