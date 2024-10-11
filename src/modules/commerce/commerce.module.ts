import { Module } from '@nestjs/common';
import { StoreModule } from './store/store.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [StoreModule, CategoryModule, ProductModule],
  exports: [StoreModule, CategoryModule, ProductModule],
})
export class CommerceModule {}
