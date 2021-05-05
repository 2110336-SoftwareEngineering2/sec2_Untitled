import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Employee, Pet, PetOwner, PetSitter } from 'src/entities';
import { jwtConstants } from '../authentication/constants';
import { mockPet, mockPetOwner, mockPetSitter, mockRepo } from '../mocks/mockRepo';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;

  const res = {
    render: jest.fn(),
    send: jest.fn(),
    redirect: jest.fn()
  };


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
    controller = module.get<AccountController>(AccountController);
  });

  describe("Check existence", () => {

    it('controller should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('service should be defined', () => {
      expect(service).toBeDefined();
    });
  })

  describe('Account related path', () => {

    it('render account', async () => {
      await controller.renderAccount({user: {role:"owner", id:1000002}}, res)
      expect(res.render).toHaveBeenCalledWith('account/profile',
        {
          account:await mockPetOwner.findOne(1000002),
          pet: await mockPet.find(3000004)
        }
      )
    });

    it('render edit owner profile', async () => {
      await controller.renderEditProfile({user: {role:"owner", id:1000002}}, res)
      expect(res.render).toHaveBeenCalledWith('account/editOwnerProfile', await mockPetOwner.findOne(1000002))
    });

    it('render edit sitter profile', async () => {
      await controller.renderEditProfile({user: {role:"sitter", id:2000001}}, res)
      expect(res.render).toHaveBeenCalledWith('account/editSitterProfile', await mockPetSitter.findOne(2000001))
    });

    // it('render profile (invalid role)', async () => {
    //   expect(await controller.renderEditProfile({user: {role:"idk", id:2000001}}, res)).toThrowError("Invalid Role")
    // });

    it('update account', async () => {
      let account = new PetOwner()
      account = {...account, fname: "Gark", fullGender: "Male", fullName: "Gark Pongsawad"}
      await controller.updateAccount(account,{user: {role:"owner",id:1000001}}, res)
      expect(res.redirect).toHaveBeenCalledWith('/account')
    });
  })

  describe("Pet related path", () => {

    it('render register pet', async () => {
      const petOwner = await mockPetOwner.findOne(1000002)
      await controller.renderRegisterPet({user: {role:"owner", id:1000002}}, res)
      expect(res.render).toHaveBeenCalledWith('account/registerPet',petOwner)
    }); 

    it('create pet', async () => {
      let newPet = new Pet()
      newPet = {...newPet, name: "Bokbok" , type: "cat", age: 10, gender:"M", fullGender:"Male"}
      await controller.createPet(newPet,{user: {id:1000001}}, res)
      expect(res.send).toHaveBeenCalledWith('/account')
    });
  })

  describe("Withdraw Money", () => {
    it('normal', async () => {
      const mockEntity = await mockPetSitter.findOne(2000001)
      expect(await controller.withdrawMoney({user: {id:2000001}}, {amount: 5})).toStrictEqual({...mockEntity,balance:95})
    });

    it('negative', async () => {
      expect(await controller.withdrawMoney({user: {id:2000001}}, {amount: -5})).toStrictEqual("impossible")
    });

    it('insufficient balance', async () => {
      expect(await controller.withdrawMoney({user: {id:2000001}}, {amount: 10000})).toStrictEqual("poor")
    });
  })

});
