import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PetOwner, PetSitter, Transaction } from 'src/entities';
import { MockAccountModule } from 'src/mock-account/mock-account.module';
import { mockPetOwner, mockPetSitter } from '../mocks/mockRepo';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

const res = {
  render: jest.fn(),
  send: jest.fn(),
  redirect: jest.fn(),
  cookie: jest.fn()
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockAccountModule,  PassportModule, JwtModule.register({secret: jwtConstants.secret,signOptions: {expiresIn: '1d'}})],
      providers: [
        AuthService,
        JwtStrategy,
        {
          provide: getRepositoryToken(PetSitter),
          useValue: mockPetSitter
        },
        {
          provide: getRepositoryToken(PetOwner),
          useValue: mockPetOwner
        }
      ],
      controllers: [AuthController]
    }).compile();

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
    jwtService = module.get<JwtService>(JwtService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Auth Service', () => {
    it('register', async () => {
      const newUser = { username: 'Knomkeng',fname: 'Knom', lname: 'Keng',signUpDate: new Date('2021-02-01'),
      gender: 'F', password: "pass", fullName: "Knom Ken", role: 'owner'}
      expect((await service.register(newUser)).id).toStrictEqual(1000005)
    })

    it('logout', async () => {
      service.logout(res)
      expect(res.cookie).toBeCalledWith('token', "")
      expect(res.redirect).toBeCalledWith('/')
    })

    describe('validate user', () => {
      it('found and correct pass', async () => {
        expect((await service.validateUser('owner','gark','gark')).fname).toStrictEqual('Pabhanuwat')
        expect((await service.validateUser('owner','gark','gark')).id).toStrictEqual(1000001)
      })
      
      it('found and wrong pass', async () => {
        expect((await service.validateUser('owner','gark','wrong pass'))).toBeNull()
      })

      it('not found', async () => {
        expect((await service.validateUser('owner','not exist','pass'))).toBeNull()
      })
    })

    it('logout', () => {
      controller.logout(res)
      expect(res.cookie).toBeCalledWith('token', "")
      expect(res.redirect).toBeCalledWith('/')
    })

    describe('login', () => {
      it ('owner' , async () => {
        await service.login({username: 'gark', id:1000001, role: 'owner'},res)
        const payload = {username: 'gark', sub:1000001, role: 'owner'}
        const token = jwtService.sign(payload)
        expect(res.cookie).toBeCalledWith('token', token)
        expect(res.redirect).toBeCalledWith('/search')
      })

      it ('sitter' , async () => {
        await service.login({username: 'suchi', id:2000001, role: 'sitter'},res)
        const payload = {username: 'suchi', sub:2000001, role: 'sitter'}
        const token = jwtService.sign(payload)
        expect(res.cookie).toBeCalledWith('token', token)
        expect(res.redirect).toBeCalledWith('/book/my')
      })

      it ('employee' , async () => {
        await service.login({username: 'fokenama', id:3, role: 'admin'},res)
        const payload = {username: 'fokenama', sub:3, role: 'admin'}
        const token = jwtService.sign(payload)
        expect(res.cookie).toBeCalledWith('token', token)
        expect(res.redirect).toBeCalledWith('/support')
      })
    })
  })

  describe('Auth Controller', () => {
    it('register', async () => {
      const newUser = { username: 'Baibua',fname: 'Supatchara', lname: 'Taninzon',signUpDate: new Date('2021-02-27'),
        gender: 'F', password: "pass", fullName: "Supatchara Taninzon", role: 'owner'}
      expect((await controller.register(newUser)).id).toStrictEqual(1000006)
    })

    describe('login', () => {
      it ('owner' , async () => {
        await controller.login({user: {username: 'gark', id:1000001, role: 'owner'}},res)
        const payload = {username: 'gark', sub:1000001, role: 'owner'}
        const token = jwtService.sign(payload)
        expect(res.cookie).toBeCalledWith('token', token)
        expect(res.redirect).toBeCalledWith('/search')
      })

      it ('sitter' , async () => {
        await controller.login({user: {username: 'suchi', id:2000001, role: 'sitter'}},res)
        const payload = {username: 'suchi', sub:2000001, role: 'sitter'}
        const token = jwtService.sign(payload)
        expect(res.cookie).toBeCalledWith('token', token)
        expect(res.redirect).toBeCalledWith('/book/my')
      })

      it ('employee' , async () => {
        await controller.login({user: {username: 'fokenama', id:3, role: 'admin'}},res)
        const payload = {username: 'fokenama', sub:3, role: 'admin'}
        const token = jwtService.sign(payload)
        expect(res.cookie).toBeCalledWith('token', token)
        expect(res.redirect).toBeCalledWith('/support')
      })
    })
  })
});
