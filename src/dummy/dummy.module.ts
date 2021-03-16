import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerReview } from 'src/entities/ownerreview.entity';
import { Pet } from 'src/entities/pet.entity';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { SitterAnimal } from 'src/entities/sitteranimal.entity';
import { SitterReview } from 'src/entities/sitterreview.entity';
import { DummyController } from './dummy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PetSitter, PetOwner, Pet, SitterReview, OwnerReview, SitterAnimal])],
  controllers: [DummyController]
})
export class DummyModule {}
