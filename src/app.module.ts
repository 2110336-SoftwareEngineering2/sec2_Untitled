import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetOwner } from './entities/petowner.entity';
import { PetSitter } from './entities/petsitter.entity';
import { AccountModule } from './account/account.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';
import { SearchModule } from './search/search.module';
import { Pet } from './entities/pet.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '54.169.16.254',
      port: 3306,
      username: 'se2',
      password: 'se2',
      database: 'se2',
      entities: [PetOwner, PetSitter, Pet],
      synchronize: true // this should be false in production
    }),TypeOrmModule.forFeature([PetOwner]), AccountModule, ReviewModule, BookingModule, SearchModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
