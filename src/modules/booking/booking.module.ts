import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking, Pet, PetOwner, PetSitter, SitterReview, Transaction } from 'src/entities'
import { NotificationModule } from 'src/modules/notification/notification.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([PetOwner, PetSitter, Pet, Booking, SitterReview, Transaction]), NotificationModule],
  controllers: [BookingController],
  providers: [BookingService]
})
export class BookingModule { }
