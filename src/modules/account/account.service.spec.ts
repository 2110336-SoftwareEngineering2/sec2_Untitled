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
  //*
  // it('find owner account by id',async () => {
  //   const owner = await service.findAccountById('owner',1000001)
  //   expect(owner.fname).toStrictEqual("Pabhanuwat")
  //   expect(owner.lname).toStrictEqual("Pongsawad")
  //   expect(async () => await service.findAccountById('owner',100000)).rejects.toThrow("Account Not Found!")
  // })

  //*
  // it('find sitter account by id',async () => {
  //   const sitter = await service.findAccountById('sitter',2000001)
  //   expect(sitter.fname).toStrictEqual("Suchada")
  //   expect(sitter.lname).toStrictEqual("Hnoonpakdee")
  //   expect(async () => await service.findAccountById('sitter',200000)).rejects.toThrow("Account Not Found!")
  // })

  // it('find owner account by username',async () => {
  //   const owner = await service.findAccountByUsername('owner',"gark")
  //   expect(owner.fname).toStrictEqual("Pabhanuwat")
  //   expect(owner.lname).toStrictEqual("Pongsawad")
  //   expect(async () => await service.findAccountByUsername('owner',"gook")).rejects.toThrow("Account Not Found!")
  // })
  
  // it('find sitter account by username',async () => {
  //   const sitter = await service.findAccountByUsername('sitter',"suchi")
  //   expect(sitter.fname).toStrictEqual("Suchada")
  //   expect(sitter.lname).toStrictEqual("Hnoonpakdee")
  //   expect(async () => await service.findAccountByUsername('sitter',"sumo")).rejects.toThrow("Account Not Found!")
  // })

  // it('find pet by owner id',async () => {
  //   const pets = await service.findPetbyOwnerId('owner',1000001)
  //   expect(pets.length).toStrictEqual(3)
  //   expect(pets[0].name).toStrictEqual("far-dog")
  //   expect(pets[1].name).toStrictEqual("far-cat")
  //   expect(await service.findPetbyOwnerId('sitter',123456)).toBeNull()  // ! wrong role
  //   expect(await service.findPetbyOwnerId('owner',123456)).toStrictEqual([])   // ! invalid id
  // })


  // it('save to repo',async () => {
  //   expect((await service.saveToRepo('owner',
  //     { username: 'Baibua',fname: 'Supatchara', lname: 'Taninzon',signUpDate: new Date('2021-02-27'),
  //       gender: 'F', password: "pass", fullName: "Supatchara Taninzon"}
  //       )).id).toStrictEqual(1000005)
  // })

  it('save to repo',async () => {
    expect((await service.updateAccount('owner', 100001, {fname: "Garkie"})).fname).toStrictEqual("Garkie")
  })

  // todo: it throws exception
  // it('create account', async () => {
  //   const newUser = { username: 'Baibua',fname: 'Supatchara', lname: 'Taninzon',signUpDate: new Date('2021-02-27'),
  //   gender: 'F', password: "pass", fullName: "Supatchara Taninzon"}
  //   expect(async () => (await service.createAccount('owner',newUser))).rejects.toThrow()
  // })

  // it('withdraw balance', async () => {
  //   expect(await service.withdrawBalance(2000001, -5)).toStrictEqual('impossible')        // * can't withdraw negative amount
  //   expect(await service.withdrawBalance(2000001, 10000)).toStrictEqual('poor')           // * can't withdraw amount more than balance
  //   expect((await service.findAccountById('sitter',2000001)).balance).toStrictEqual(100)  // * check first that account has 100 unit
  //   expect((await service.withdrawBalance(2000001, 50)).balance).toStrictEqual(50)        // * withdraw 50, balance should now has 50
  // })
});
