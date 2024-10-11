import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/modules/core/user/user.entity';
import { StoreService } from 'src/modules/commerce/store/store.service';

@Injectable()
export class StoreOwnershipGuard implements CanActivate {
  constructor(private readonly storeService: StoreService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const { id } = request.params;
    const store = await this.storeService.validateStoreOwnership(id, user.id);
    request.store = store;

    return true;
  }
}
