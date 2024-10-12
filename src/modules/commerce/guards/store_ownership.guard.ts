import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/modules/core/user/user.entity';
import { StoreService } from 'src/modules/commerce/store/store.service';

@Injectable()
export class StoreOwnershipGuard implements CanActivate {
  constructor(private readonly storeService: StoreService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const { storeId } = request.params;
    const { store_id } = request.body;
    const stores = await this.storeService.getStoresByOwnerId(user.id);
    if (stores.length === 0) {
      throw new HttpException(
        'This user does not own any store',
        HttpStatus.BAD_REQUEST,
      );
    }

    const store = stores.find(
      (store) => store.id === +storeId || store.id === +store_id,
    );

    if (!store) {
      throw new HttpException(
        'Invalid Store ID provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    request.store = store;
    return true;
  }
}
