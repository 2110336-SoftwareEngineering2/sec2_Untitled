import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
<<<<<<< HEAD
import { PetOwner } from './entities/petowner.entity';
import { PetSitter } from './entities/petsitter.entity';
import { AccountModule } from './account/account.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';
import { SearchModule } from './search/search.module';
import { Pet } from './entities/pet.entity';
import { Booking } from './entities/booking.entity';
import { SitterReview } from './entities/sitterreview.entity';
import { OwnerReview } from './entities/ownerreview.entity';
import { AuthModule } from './auth/auth.module';
import { DummyModule } from './dummy/dummy.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { SitterAnimal } from './entities/sitteranimal.entity';
import { Transaction } from './entities/transaction.entity';
import { Report } from './entities/report.entity';
import { Employee } from './entities/employee.entity';
import { NotificationModule } from './notification/notification.module';
import { ChatModule } from './chat/chat.module';
import { AppGateway } from './app.gateway';
=======
import {Booking, Transaction, Employee, Pet, Report,
        OwnerReview, PetOwner,
        PetSitter, SitterAnimal, SitterReview} from './entities'
import {AccountModule, ReviewModule, 
        BookingModule,SearchModule, AuthModule,
        DummyModule, NotificationModule} from './modules'
>>>>>>> 1aaea6157d0ba7ceeaa20d2b74274b3ccd95a857

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '54.169.16.254',
      port: 3306,
      username: 'se2',
      password: 'se2',
      database: 'se2',
      entities: [PetOwner, PetSitter, Pet, Booking, OwnerReview, SitterReview, SitterAnimal, Transaction, Report, Employee] ,
      synchronize: true // this should be false in production
    }),TypeOrmModule.forFeature([PetOwner]), AccountModule, ReviewModule, BookingModule, SearchModule, AuthModule, DummyModule, NotificationModule, ChatModule
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway]
})

export class AppModule {}
