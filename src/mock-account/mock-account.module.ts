import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/modules/authentication/constants';
import { Employee, Pet, PetOwner, PetSitter } from 'src/entities'
import { AccountService } from 'src/modules/account/account.service';
import { AccountController } from 'src/modules/account/account.controller';
import { mockPetOwner, mockPetSitter, mockRepo } from 'src/modules/mocks/mockRepo';

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1d' }
        })
    ],
    controllers: [AccountController],
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
        useValue: mockRepo
      },
      {
        provide: getRepositoryToken(Employee),
        useValue: mockRepo
      },
    ],
    exports: [
      AccountService
    ]
})
export class MockAccountModule { }