import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetOwner, PetSitter, SitterReview, OwnerReview, Booking, Report } from 'src/entities';
import { NotificationModule } from '..';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';

@Module({
  imports:[TypeOrmModule.forFeature([PetOwner, PetSitter, SitterReview, OwnerReview, Booking, Report]), NotificationModule],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService]
})
export class SupportModule {}
