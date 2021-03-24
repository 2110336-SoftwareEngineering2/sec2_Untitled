import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Transaction } from 'src/entities/transaction.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, PetOwner, PetSitter])],
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController]
})
export class NotificationModule {}
