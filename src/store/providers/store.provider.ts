import { Provider } from '@nestjs/common';
import { DB_CONN } from 'src/database/database.constants';
import { STORE_REPOSITORY } from '../store.constant';
import { DataSource } from 'typeorm';
import { Store } from '../store.entity';

export const storeProvider: Provider[] = [
  {
    inject: [DB_CONN],
    provide: STORE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Store),
  },
];
