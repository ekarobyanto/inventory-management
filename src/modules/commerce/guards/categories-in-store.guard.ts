import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { Store } from '../store/store.entity';

@Injectable()
export class CategoriesInStoreGuard implements CanActivate {
  constructor(private readonly storeService: StoreService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { store_id, categories } = request.body;
    const storeFromRequest: Store = request.store;
    const store = await this.storeService.getStoreById(
      store_id || storeFromRequest.id,
    );
    if (!categories || categories.length === 0) {
      return true;
    }
    if (
      !categories.every((category: number) =>
        store.categories.find((storeCategory) => storeCategory.id === category),
      )
    ) {
      throw new HttpException(
        "Category doesn't exist in store",
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
