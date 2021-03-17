import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/modules/authentication/constants';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import {Pet, PetOwner, PetSitter} from 'src/entities'
import { NotificationService } from '../notification/notification.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports : [TypeOrmModule.forFeature([PetOwner]),TypeOrmModule.forFeature([PetSitter]),TypeOrmModule.forFeature([Pet]), JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: {expiresIn: '1d'}
  }), NotificationModule ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})

export class AccountModule {}