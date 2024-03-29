import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import {
  Booking, Transaction, Employee, Pet, Report,
  OwnerReview, PetOwner,
  PetSitter, SitterAnimal, SitterReview
} from './entities'

import { Message } from './entities/message.entity';
import {
  AccountModule, ReviewModule,
  BookingModule, SearchModule, AuthModule,
  DummyModule, NotificationModule
} from './modules'
import { NotificationService } from './modules/notification/notification.service';
import { SupportModule } from './modules/support/support.module';
import { AdminModule } from './modules/admin/admin.module';
import { ChatModule } from './modules/chat/chat.module';
import { MockAccountModule } from './mock-account/mock-account.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '54.169.16.254',
      port: 3306,
      username: 'se2',
      password: 'se2',
      database: 'se2',
      entities: [PetOwner, PetSitter, Pet, Booking, OwnerReview, SitterReview, SitterAnimal, Transaction, Report, Employee, Message],
      synchronize: true // this should be false in production
    }), TypeOrmModule.forFeature([PetOwner, Transaction, PetSitter]), AccountModule, ReviewModule, BookingModule, SearchModule, AuthModule, DummyModule, NotificationModule, AdminModule, ChatModule, SupportModule, MockAccountModule
  ],
  controllers: [AppController],
  providers: [AppService, NotificationService]
})

export class AppModule { }
