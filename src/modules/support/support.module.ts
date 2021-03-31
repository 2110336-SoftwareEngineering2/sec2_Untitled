import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitterReview, OwnerReview, Booking, Report } from 'src/entities';
import { NotificationModule } from '..';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { AccountModule } from '../account/account.module';

@Module({
  imports:[TypeOrmModule.forFeature([SitterReview, OwnerReview, Booking, Report]), NotificationModule, AccountModule],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService]
})
export class SupportModule {}
