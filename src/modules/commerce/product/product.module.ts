import { Module } from '@nestjs/common';
import { CoreModule } from 'src/modules/core/core.module';
import { DatabaseModule } from 'src/modules/database/database.module';
import { StoreModule } from '../store/store.module';
import { ProductService } from './product.service';
import { DB_CONN } from 'src/modules/database/database.constants';
import { DataSource } from 'typeorm';
import { Product } from './product.entity';
import { PRODUCT_REPOSITORY } from './product.contant';
import { ProductController } from './product.controller';

@Module({
  imports: [CoreModule, DatabaseModule, StoreModule],
  exports: [ProductService],
  providers: [
    ProductService,
    {
      inject: [DB_CONN],
      provide: PRODUCT_REPOSITORY,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Product),
    },
  ],
  controllers: [ProductController],
})
export class ProductModule {}
