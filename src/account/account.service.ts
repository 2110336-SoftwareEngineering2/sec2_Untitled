import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { PetOwner } from 'src/entities/petowner.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(PetOwner) private readonly petOwnerRepo: Repository<PetOwner>){}

    async createPetOwner(dto: Omit<PetOwner, 'id'>): Promise<PetOwner> {  
        const owner = await this.findOwnerByUsername(dto.username)
        if(owner){
            throw new BadRequestException('This username is already exist');
        }
        else {
            const password = await hash(dto.password, 10);
            const user = { ... new PetOwner(), ... dto, password};
            // console.dir(user);
            return this.petOwnerRepo.save(user);
        } 
    }

    findOwnerById(id: number): Promise<PetOwner> {
        return this.petOwnerRepo.findOne(id);
    }

    findOwnerByUsername(username: string): any {
        return this.petOwnerRepo.findOne({username});
    }
}
