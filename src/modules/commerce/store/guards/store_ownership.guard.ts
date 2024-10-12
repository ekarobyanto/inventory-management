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
    const store = await this.storeService.getStoreById(storeId || store_id);
    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    if (store.owner.id !== user.id) {
      throw new HttpException(
        'User is not the owner of this store',
        HttpStatus.BAD_REQUEST,
      );
    }

    request.store = store;

    return true;
  }
}
