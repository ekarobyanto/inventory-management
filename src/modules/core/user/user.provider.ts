import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { DB_CONN } from 'src/modules/database/database.constants';
import { USER_REPOSITORY } from './user.constants';

export const userProviders = [
  {
    inject: [DB_CONN],
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
  },
];
