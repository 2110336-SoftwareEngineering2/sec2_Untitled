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
    let createdTransaction1 = await service.createTransaction(1000001, 2000001, "Pabhanuwat requested your service")
    let createdTransaction2 = await service.createTransaction(4, 1000003, "Patipan sent you a message")
    expect(createdTransaction1.performerId).toStrictEqual(1000001)
    expect(createdTransaction1.receiverId).toStrictEqual(2000001)
    expect(createdTransaction1.description).toStrictEqual("Pabhanuwat requested your service")

    expect(createdTransaction2.performerId).toStrictEqual(4)
    expect(createdTransaction2.receiverId).toStrictEqual(1000003)
    expect(createdTransaction2.description).toStrictEqual("Patipan sent you a message")
  });

  it('Get notifications for', async () => {
    let notifications1 = await service.getNotificationsFor(1000001)
    let notifications2 = await service.getNotificationsFor(2000001)
    let notificaitons3 = await service.getNotificationsFor(1)
    let notificaitons4 = await service.getNotificationsFor(-1)
    expect(notifications1.length).toStrictEqual(3)
    expect(notifications2.length).toStrictEqual(3)
    expect(notificaitons3.length).toStrictEqual(0)
    expect(notificaitons4.length).toStrictEqual(0)
  })

  it("Get picture URL", async () => {
    let pic1 = await service.getPicUrlOf(1000001) // owner
    let pic2 = await service.getPicUrlOf(1000002) // owner
    let pic3 = await service.getPicUrlOf(2000001) // sitter
    let pic4 = await service.getPicUrlOf(2000002) // sitter
    let pic5 = await service.getPicUrlOf(1) // admin

    expect(pic1).toBeUndefined()
    expect(pic2).toStrictEqual("ong-art_pic")
    expect(pic3).toStrictEqual("suchada_pic")
    expect(pic4).toStrictEqual("amnard_pic")
    expect(pic5).toBeUndefined()

    // edge cases
    // 7 digits but does not proceed with 1 or 2
    expect(async () => await service.getPicUrlOf(9999999)).rejects.toThrow("User ID can only be an ID of PetOwner PetSitter or Admin")
    // more than 7 digits
    expect(async () => await service.getPicUrlOf(99999999)).rejects.toThrow("User ID can only be an ID of PetOwner PetSitter or Admin")
  })

  it('From now', () => {
    let now = new Date()
    let seconds = service.fromNow(new Date().setSeconds(now.getSeconds() - 3))
    let minutes = service.fromNow(new Date().setMinutes(now.getMinutes() - 3))
    let hours = service.fromNow(new Date().setHours(now.getHours() - 3))
    let days = service.fromNow(new Date().setDate(now.getDate() - 3))
    let months = service.fromNow(new Date().setMonth(now.getMonth() - 3))
    let years = service.fromNow(new Date().setFullYear(now.getFullYear() - 3))
    expect(seconds).toStrictEqual("3 seconds ago")
    expect(minutes).toStrictEqual("3 minutes ago")
    expect(hours).toStrictEqual("3 hours ago")
    expect(days).toStrictEqual("3 days ago")
    expect(months).toStrictEqual("3 months ago")
    expect(years).toStrictEqual("3 years ago")
  })
})
