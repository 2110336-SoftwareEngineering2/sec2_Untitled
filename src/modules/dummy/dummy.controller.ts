import { Body, Controller, Post, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OwnerReview } from 'src/entities/ownerreview.entity';
import { Pet } from 'src/entities/pet.entity';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { SitterAnimal } from 'src/entities/sitteranimal.entity';
import { SitterReview } from 'src/entities/sitterreview.entity';
import { PrimaryColumn, Repository } from 'typeorm';

@Controller('dummy')
export class DummyController {
    constructor(
        @InjectRepository(PetSitter)
        private readonly petSitterRepo: Repository<PetSitter>,
        @InjectRepository(PetOwner)
        private readonly petOwnerRepo: Repository<PetOwner>,
        @InjectRepository(Pet)
        private readonly petRepo: Repository<Pet>,
        @InjectRepository(SitterReview)
        private readonly sitterReviewRepo: Repository<SitterReview>,
        @InjectRepository(OwnerReview)
        private readonly ownerReviewRepo: Repository<OwnerReview>,
        @InjectRepository(SitterAnimal)
<<<<<<< HEAD:src/dummy/dummy.controller.ts
        private readonly sitterAnimalRepo: Repository<SitterReview>
=======
        private readonly sitterAnimalRepo: Repository<SitterAnimal>
>>>>>>> 802fed01e83342d95f62640d8712c65c38fff1e9:src/modules/dummy/dummy.controller.ts
    ){}    

    @Post('petsitter')
    async store_pet_sitter(@Req() req){
        // console.log(req.body);
        this.petSitterRepo.save(req.body)
    }

    @Post('petowner')
    store_pet_owner(@Body() body){
        // console.log(body)
        this.petOwnerRepo.save(body)
    }

    @Post('pet')
    async store_pet(@Body() body){
        // console.log(body)
        this.petRepo.save(body);
    }

    @Post('petsitter_review')
    store_sitter_review(@Body() body){
        // console.log(body)
        this.sitterReviewRepo.save(body)
    }

    @Post('petowner_review')
    store_onwer_review(@Body() body){
        // console.log(body)
        this.ownerReviewRepo.save(body)
    }

    @Post('sitter_animal')
    store_sitter_animal(@Body() body){
        // console.log(body)
        this.sitterAnimalRepo.save(body)
    }
}
