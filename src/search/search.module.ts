import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Booking } from 'src/entities/booking.entity';
import { SitterAnimal } from 'src/entities/sitteranimal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PetOwner, PetSitter,Booking,SitterAnimal])],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {
	
	
	
}
