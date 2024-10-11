import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { storeProvider } from './providers/store.provider';
import { DatabaseModule } from 'src/modules/database/database.module';
import { CoreModule } from 'src/modules/core/core.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [DatabaseModule, CoreModule, CategoryModule],
  exports: [StoreService],
  providers: [StoreService, ...storeProvider],
  controllers: [StoreController],
})
export class StoreModule {}
