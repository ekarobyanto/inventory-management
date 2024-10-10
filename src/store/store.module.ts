import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { storeProvider } from './providers/store.provider';
import { DatabaseModule } from 'src/database/database.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [ProductModule, CategoryModule, DatabaseModule, CoreModule],
  exports: [ProductModule, CategoryModule],
  providers: [StoreService, ...storeProvider],
  controllers: [StoreController],
})
export class StoreModule {}
