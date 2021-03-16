import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {PetOwner,PetSitter,Booking,SitterAnimal} from 'src/entities'

@Module({
  imports: [TypeOrmModule.forFeature([PetOwner, PetSitter,Booking,SitterAnimal])],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {
	
	
	
}
