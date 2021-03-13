import { BadRequestException, Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Pet } from 'src/entities/pet.entity';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(PetOwner) private readonly petOwnerRepo: Repository<PetOwner>,
        @InjectRepository(PetSitter) private readonly petSitterRepo: Repository<PetSitter>,
        @InjectRepository(Pet) private readonly petRepo: Repository<Pet>){}


    // Profile
    renderAccount(@Res() res){
        return res.redner('')
    }


    // CREATE

    async saveToRepo(role: string, user: PetOwner | PetSitter) : Promise<PetOwner | PetSitter> {
        if (role === 'owner') {
            console.log('saving owner')
            return await this.petOwnerRepo.save(user);
        }
        else if (role === 'sitter') {
            console.log('saving')
            return await this.petSitterRepo.save(user);
        }
        return null
    }

    async createAccount(role: string, dto: Omit<PetOwner | PetSitter, 'id'>) : Promise<PetOwner | PetSitter> {
        console.log('in createAccount')
        console.log('role ', role)
        const user = await this.findAccountByUsername(role,dto.username)
        console.log('after find account')
        if (user) throw new BadRequestException('This username is already exist');
        else {
            console.log('user name is not used')
            console.log('dto',dto)
            let newUser = null
            const password = await hash(dto.password, 10);
            if (role === 'owner') newUser  = { ... new PetOwner(), ... dto, password};
            else if (role === 'sitter') newUser = { ... new PetSitter(), ... dto, password}
            console.log('new user', newUser)
            return this.saveToRepo(role, newUser)
        }
    }

    // READ

    async findAccountById(role: string, id: number): Promise<any> {
        if (role === 'sitter') return await this.petSitterRepo.findOne(id);
        else if (role === 'owner') return await this.petOwnerRepo.findOne(id);
        return null;
    }

    async findAccountByUsername(role: string, username: string): Promise<any> {
        if (role === 'sitter') return await this.petSitterRepo.findOne({username});
        else if (role === 'owner') return await this.petOwnerRepo.findOne({username});
        return null;
    }

    async findPetbyId(role: string, id: number): Promise<any> {
        let owner = id;
        if (role === 'owner')return await this.petRepo.find({owner});
        return null;
    }

    // UPDATE

    async updateAccount(role: string, id: number, dto: Partial<Omit<PetOwner | PetSitter,'id'>>)
                    : Promise<PetOwner | PetSitter> {
        const user = {... (await this.findAccountById(role,id)), ... dto};
        return await this.saveToRepo(role, user);
    }

    async createPet(dto: Omit<Pet, 'id'|'owner'>, @Req() req) : Promise<Pet> {
        let owner = req.user.id;
        let newPet = {... new Pet(), ... dto, owner};
        return this.petRepo.save(newPet)
    }
}
