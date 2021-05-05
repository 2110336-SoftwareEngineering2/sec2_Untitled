import { NotFoundException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Employee, Pet, PetOwner, PetSitter } from 'src/entities';
import { Repository } from 'typeorm';
import { jwtConstants } from '../authentication/constants';
import { mockRepo, mockPetOwner, mockPetSitter, mockPet } from '../mocks/mockRepo';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: {expiresIn: '1d'}
      }) ],
      controllers: [AccountController],
      exports: [AccountService],
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(PetSitter),
          useValue: mockPetSitter
        },
        {
          provide: getRepositoryToken(PetOwner),
          useValue: mockPetOwner
        },
        {
          provide: getRepositoryToken(Pet),
          useValue: mockPet
        },
        {
          provide: getRepositoryToken(Employee),
          useValue: mockRepo
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('save to repo',async () => {
    expect((await service.saveToRepo('owner',
      { username: 'Baibua',fname: 'Supatchara', lname: 'Taninzon',signUpDate: new Date('2021-02-27'),
        gender: 'F', password: "pass", fullName: "Supatchara Taninzon"}
        )).id).toStrictEqual(1000005)
  })

  // todo: it throws exception
  it('create account', async () => {
    const newUser = { username: 'Knomkeng',fname: 'Knom', lname: 'Keng',signUpDate: new Date('2021-02-01'),
    gender: 'F', password: "pass", fullName: "Knom Ken"}
    expect((await service.createAccount('owner',newUser)).id).toStrictEqual(1000006)
  })

  it('create account (Username Already Existed)', async () => {
    const newUser = { username: 'gark',fname: 'Pabhanuwat', lname: 'Pongsawad',signUpDate: new Date('2021-02-22'),
    gender: 'M', password: "pass", fullName: "Pabhanuwat Pongsawad"}
    expect(async () => await service.createAccount('owner',newUser)).rejects.toThrow("This username is already exist")
  })

  it('find owner account by id',async () => {
    const owner = await service.findAccountById('owner',1000001)
    expect(owner.fname).toStrictEqual("Pabhanuwat")
    expect(owner.lname).toStrictEqual("Pongsawad")
  })

  it('find owner account by id (Account Not Found)',async () => {
    expect(await service.findAccountById('owner',100000)).toBeNull()
  })

  it('find sitter account by id',async () => {
    const sitter = await service.findAccountById('sitter',2000001)
    expect(sitter.fname).toStrictEqual("Suchada")
    expect(sitter.lname).toStrictEqual("Hnoonpakdee")
  })

  it('find sitter account by id (Account Not Found)',async () => {
    expect(await service.findAccountById('sitter',200000)).toBeNull()
  })

  it('find owner account by username',async () => {
    const owner = await service.findAccountByUsername('owner',"gark")
    expect(owner.fname).toStrictEqual("Pabhanuwat")
    expect(owner.lname).toStrictEqual("Pongsawad")
  })

  it('find owner account by username (Account Not Found)',async () => {
    expect(await service.findAccountByUsername('owner',"gook")).toBeNull()
  })
  
  it('find sitter account by username',async () => {
    const sitter = await service.findAccountByUsername('sitter',"suchi")
    expect(sitter.fname).toStrictEqual("Suchada")
    expect(sitter.lname).toStrictEqual("Hnoonpakdee")
  })

  it('find sitter account by username (Account Not Found)',async () => {
    expect(await service.findAccountByUsername('sitter',"sumo")).toBeNull()
  })

  it('find pet by owner id',async () => {
    const pets = await service.findPetbyOwnerId('owner',1000001)
    expect(pets.length).toStrictEqual(3)
    expect(pets[0].name).toStrictEqual("far-dog")
    expect(pets[1].name).toStrictEqual("far-cat")
    expect(await service.findPetbyOwnerId('sitter',123456)).toBeNull()  // ! wrong role
    expect(await service.findPetbyOwnerId('owner',123456)).toStrictEqual([])   // ! invalid id
  })

  it('find pet by owner id (Wrong Role)',async () => {
    expect(await service.findPetbyOwnerId('sitter',123456)).toBeNull()
  })

  it('find pet by owner id (Invalid Id)',async () => {
    expect(await service.findPetbyOwnerId('owner',123456)).toStrictEqual([])
  })

  it('update account',async () => {
    expect((await service.updateAccount('owner', 1000001, {fname: "Garkie"})).fname).toStrictEqual("Garkie")
  })

  it('create pet',async () => {
    const newPetInfo = {  type: "foke", name:"foke-foke", gender:"M", yearOfBirth:2000,
                          appearance: "short", picUrl: "fokephoto.com", age: 21, fullGender: "Male"
                        }
    let newPet = new Pet()
    newPet = {...newPet, ...newPetInfo}
    expect((await service.createPet(newPet, {user: {id: 1000001}})).name).toStrictEqual("foke-foke")
  })

  it('withdraw balance', async () => {
    expect((await service.findAccountById('sitter',2000001)).balance).toStrictEqual(100)
    expect((await service.withdrawBalance(2000001, 50)).balance).toStrictEqual(50)
  })

  it('withdraw balance (Negative Amount)', async () => {
    expect(await service.withdrawBalance(2000001, -5)).toStrictEqual('impossible')
  })

  it('withdraw balance (Insufficient Balance)', async () => {
    expect(await service.withdrawBalance(2000001, 10000)).toStrictEqual('poor')
  })
});
