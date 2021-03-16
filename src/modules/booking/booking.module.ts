import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Pet } from 'src/entities/pet.entity';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { SitterReview } from 'src/entities/sitterreview.entity';
import { Transaction } from 'src/entities/transaction.entity';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([PetOwner, PetSitter, Pet, Booking, SitterReview, Transaction]), NotificationModule],
  controllers: [BookingController],
  providers: [BookingService]
})
export class BookingModule {}
