import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DB_CONN } from './database.constants';

export const databaseProviders: Provider[] = [
  {
    inject: [ConfigService],
    provide: DB_CONN,
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get('database.host'),
        port: Number(configService.get('database.port')),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        database: configService.get('database.database') || 'postgres',
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        synchronize: configService.get('database.synchronize'),
      });

      return dataSource.initialize();
    },
  },
];
