import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.provider';
import { ConfigModule } from '@nestjs/config';
import { EncryptionModule } from 'src/encryption/encryption.module';

@Module({
  imports: [DatabaseModule, ConfigModule, EncryptionModule],
  providers: [UserService, ...userProviders],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
