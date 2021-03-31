import { BadRequestException, Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Employee } from 'src/entities';
import { Pet } from 'src/entities/pet.entity';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(PetOwner) private readonly petOwnerRepo: Repository<PetOwner>,
        @InjectRepository(PetSitter) private readonly petSitterRepo: Repository<PetSitter>,
        @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
        @InjectRepository(Pet) private readonly petRepo: Repository<Pet>
    ){}

    // CREATE
    async saveToRepo(role: string, user: PetOwner | PetSitter | Employee) : Promise<PetOwner | PetSitter | Employee> {
        if (role === 'owner') return await this.petOwnerRepo.save(user);
        else if (role === 'sitter') return await this.petSitterRepo.save(user);
        else if (role === 'admin') return await this.employeeRepo.save(user);
        // ! this code should never be reached
        return null
    }

    async createAccount(role: string, dto: Omit<PetOwner | PetSitter | Employee, 'id'>) : Promise<PetOwner | PetSitter | Employee> {
        const user = await this.findAccountByUsername(role,dto.username)
        if (user) throw new BadRequestException('This username is already exist');
        else {
            let newUser;
            const password = await hash(dto.password, 10);
            if (role === 'owner') newUser  = { ... new PetOwner(), ... dto, password};
            else if (role === 'sitter') newUser = { ... new PetSitter(), ... dto, password}
            else if (role === 'admin') newUser = { ... new Employee(), ... dto, password}
            return this.saveToRepo(role, newUser)
        }
    }

    // READ

    async findAccountById(role: string, id: number): Promise<any> {
        if (role === 'sitter') return await this.petSitterRepo.findOne(id);
        else if (role === 'owner') return await this.petOwnerRepo.findOne(id);
        else if (role === 'admin') return await this.employeeRepo.findOne(id);
        // ! this code should never be reached
        return null;
    }

    async findAccountByUsername(role: string, username: string): Promise<any> {
        if (role === 'sitter') return await this.petSitterRepo.findOne({username});
        else if (role === 'owner') return await this.petOwnerRepo.findOne({username});
        else if (role === 'admin') return await this.employeeRepo.findOne({username});
        // ! this code should never be reached
        return null;
    }

    async findPetbyOwnerId(role: string, owner: number): Promise<any> {
        if (role === 'owner')return await this.petRepo.find({owner});
        return null;
    }

    // UPDATE

    async updateAccount(role: string, id: number, dto: Partial<Omit<PetOwner | PetSitter | Employee,'id'>>)
                    : Promise<PetOwner | PetSitter | Employee> {
        const user = {... (await this.findAccountById(role,id)), ... dto};
        return await this.saveToRepo(role, user);
    }

    async createPet(dto: Omit<Pet, 'id'|'owner'>, @Req() {user: {id}}) : Promise<Pet> {
        let newPet = {... new Pet(), ... dto, owner:id};
        return this.petRepo.save(newPet)
    }

    async withdrawBalance(sitterId : number, amount : number){
        let sitter = await this.findAccountById('sitter', sitterId)
        if(amount<=0) return 'impossible'
        else if(sitter.balance < amount)return 'poor'
        else{
            sitter.balance= sitter.balance-amount
            return this.petSitterRepo.save(sitter)
        }

    }
}
