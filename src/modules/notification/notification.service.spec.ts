import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PetOwner, PetSitter } from 'src/entities';
import { Transaction } from 'src/entities/transaction.entity';
import { MockAccountModule } from 'src/mock-account/mock-account.module';
import { mockPetOwner, mockPetSitter } from '../mocks/mockRepo';
import { mockTransaction } from '../mocks/mockTransaction';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockAccountModule],
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(PetSitter),
          useValue: mockPetSitter
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransaction
        },
        {
          provide: getRepositoryToken(PetOwner),
          useValue: mockPetOwner
        }
      ],
      exports: [NotificationService],
      controllers: [NotificationController]
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create transactions', async () => {
    let createdTransaction = await service.createTransaction(1000001, 2000001, "Pabhanuwat requested your service")
    expect(createdTransaction.performerId).toStrictEqual(1000001)
    expect(createdTransaction.receiverId).toStrictEqual(2000001)
    expect(createdTransaction.description).toStrictEqual("Pabhanuwat requested your service")
  });

  it('Get notifications for', async () => {
    let notifications1 = await service.getNotificationsFor(1000001)
    let notifications2 = await service.getNotificationsFor(2000001)
    expect(notifications1.length).toStrictEqual(3)
    expect(notifications2.length).toStrictEqual(3)
  })

  it("Get picture URL", async () => {
    let pic1 = await service.getPicUrlOf(1000001)
    let pic2 = await service.getPicUrlOf(1000002)
    let pic3 = await service.getPicUrlOf(2000001)
    let pic4 = await service.getPicUrlOf(2000002)
    expect(pic1).toBeUndefined()
    expect(pic2).toStrictEqual("ong-art_pic")
    expect(pic3).toStrictEqual("suchada_pic")
    expect(pic4).toStrictEqual("amnard_pic")

    expect(async () => await service.getPicUrlOf(9999999)).rejects.toThrow("User ID can only be an ID of PetOwner PetSitter or Admin")
  })
})
