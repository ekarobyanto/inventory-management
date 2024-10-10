import { Module } from '@nestjs/common';
import { DB_CONN } from 'src/database/database.constants';
import { DatabaseModule } from 'src/database/database.module';
import { CATEGORY_REPOSITORY } from './category.constant';
import { DataSource } from 'typeorm';
import { Category } from './category.entity';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      inject: [DB_CONN],
      provide: CATEGORY_REPOSITORY,
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Category),
    },
  ],
})
export class CategoryModule {}
