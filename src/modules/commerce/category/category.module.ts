import { Module } from '@nestjs/common';
import { DB_CONN } from 'src/modules/database/database.constants';
import { DatabaseModule } from 'src/modules/database/database.module';
import { CATEGORY_REPOSITORY } from './category.constant';
import { DataSource } from 'typeorm';
import { Category } from './category.entity';
import { CategoryController } from './category.controller';
import { CoreModule } from 'src/modules/core/core.module';
import { CategoryService } from './category.service';

@Module({
  imports: [DatabaseModule, CoreModule],
  providers: [
    CategoryService,
    {
      inject: [DB_CONN],
      provide: CATEGORY_REPOSITORY,
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Category),
    },
  ],
  controllers: [CategoryController],
})
export class CategoryModule {}
