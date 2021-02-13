import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([PetOwner, PetSitter])],
  controllers: [BookingController],
  providers: [BookingService]
})
export class BookingModule {}
