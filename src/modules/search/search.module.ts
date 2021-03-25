import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {PetOwner,PetSitter,Booking,SitterAnimal} from 'src/entities'
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([PetOwner, PetSitter,Booking,SitterAnimal]), NotificationModule],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {
	
	
	
}
