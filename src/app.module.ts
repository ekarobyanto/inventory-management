import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './modules/database/database.module';
import { CoreModule } from './modules/core/core.module';
import { EncryptionModule } from './modules/encryption/encryption.module';
import jwtConfig from './config/jwt.config';
import { CommerceModule } from './modules/commerce/commerce.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, jwtConfig],
    }),
    DatabaseModule,
    EncryptionModule,
    CoreModule,
    CommerceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
