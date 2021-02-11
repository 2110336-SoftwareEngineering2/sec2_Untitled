import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetOwner } from 'src/entities/petowner.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports : [TypeOrmModule.forFeature([PetOwner])],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {}
