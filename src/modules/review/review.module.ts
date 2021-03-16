import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {PetOwner, PetSitter, SitterReview, OwnerReview, Booking} from 'src/entities'
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports : [TypeOrmModule.forFeature([PetOwner, PetSitter, SitterReview, OwnerReview, Booking])],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
