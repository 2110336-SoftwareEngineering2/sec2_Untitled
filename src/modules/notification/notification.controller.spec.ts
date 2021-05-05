import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from 'src/entities';
import { MockAccountModule } from 'src/mock-account/mock-account.module';
import { AccountModule } from '../account/account.module';
import { mockTransaction } from '../mocks/mockTransaction';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransaction
        },
      ],
      controllers: [NotificationController],
      imports: [MockAccountModule],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Get notifications', async () => {
    let notifications = await controller.getNotifications({ user: { id: 1000001 }})
    expect(notifications.length).toStrictEqual(3)
  })
});
