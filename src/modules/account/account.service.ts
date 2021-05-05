import { BadRequestException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Employee,Pet,PetOwner,PetSitter } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(PetOwner) private readonly petOwnerRepo: Repository<PetOwner>,
        @InjectRepository(PetSitter) private readonly petSitterRepo: Repository<PetSitter>,
        @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
        @InjectRepository(Pet) private readonly petRepo: Repository<Pet>
    ){
        this.repositories = {owner: this.petOwnerRepo, sitter: this.petSitterRepo, admin: this.employeeRepo}
        this.entities = {owner: PetOwner, sitter: PetSitter, admin: Employee}
    }

    private readonly repositories;
    private readonly entities;
    // CREATE
    async saveToRepo(role: string, user: Omit<PetOwner | PetSitter | Employee, 'id'>) : Promise<PetOwner | PetSitter | Employee> {
        return await this.repositories[role].save(user)
    }

    async createAccount(role: string, dto: Omit<PetOwner | PetSitter | Employee, 'id'>) : Promise<PetOwner | PetSitter | Employee> {
        const user = await this.findAccountByUsername(role,dto.username)
        if (user) throw new BadRequestException('This username is already exist');
        else {
            const password = await hash(dto.password, 10);
            const newUser = {... new this.entities[role](), ...dto, password}
            return this.saveToRepo(role, newUser)
        }
    }

    // READ

    async findAccountById(role: string, id: number): Promise<any> {
        const account = await this.repositories[role].findOne(id)
        return account
    }

    async findAccountByUsername(role: string, username: string): Promise<any> {
        const account = await this.repositories[role].findOne({username})
        return account
    }

    async findPetbyOwnerId(role: string, owner: number): Promise<any> {
        if (role === 'owner') return await this.petRepo.find({owner});
        return null;
    }

    // UPDATE

    async updateAccount(role: string, id: number, dto: Partial<Omit<PetOwner | PetSitter | Employee,'id'>>)
                    : Promise<PetOwner | PetSitter | Employee> {
        const user = {... (await this.findAccountById(role,id)), ... dto};
        return await this.saveToRepo(role, user);
    }

    async createPet(dto: Omit<Pet, 'id'|'owner'>, @Req() {user: {id}}) : Promise<Pet> {
        const newPet = {... new Pet(), ... dto, owner:id};
        return this.petRepo.save(newPet)
    }

    async withdrawBalance(sitterId : number, amount : number){
        const sitter = await this.findAccountById('sitter', sitterId)
        if(amount<=0) return 'impossible'
        else if(sitter.balance < amount) return 'poor'
        else{
            sitter.balance= sitter.balance-amount
            return this.petSitterRepo.save(sitter)
        }

    }
}
