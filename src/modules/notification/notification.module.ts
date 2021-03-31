import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Transaction} from 'src/entities'
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), AccountModule],
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController]
})
export class NotificationModule {}
