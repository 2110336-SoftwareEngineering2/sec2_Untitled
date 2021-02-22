import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { SitterReview } from 'src/entities/sitterreview.entity';
import { OwnerReview } from 'src/entities/ownerreview.entity';
import { ReviewController } from './review.controller';
import { Booking } from 'src/entities/booking.entity'
import { ReviewService } from './review.service';

@Module({
  imports : [TypeOrmModule.forFeature([PetOwner, PetSitter, SitterReview, OwnerReview, Booking])],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
