import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PetOwner, PetSitter } from 'src/entities';
import { Message } from 'src/entities/message.entity';
import { AccountModule } from '../account/account.module';
import { NotificationModule } from '../notification/notification.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, PetOwner, PetSitter]), AccountModule, NotificationModule],
  controllers: [ChatController],
  providers: [ChatService]
})

export class ChatModule {}
