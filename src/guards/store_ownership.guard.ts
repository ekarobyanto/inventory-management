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
    const { id } = request.params;
    const store = await this.storeService.getStoreById(id);

    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    if (user.id !== store.owner.id) {
      throw new HttpException(
        'You are not the owner of this store',
        HttpStatus.BAD_REQUEST,
      );
    }
    request.store = store;

    return true;
  }
}
