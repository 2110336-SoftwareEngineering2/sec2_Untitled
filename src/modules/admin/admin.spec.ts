import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

const res = {
  render: jest.fn(),
  send: jest.fn(),
  redirect: jest.fn()
};

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [AdminService],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('render login', () => {
    controller.renderLogin(res)
    expect(res.render).toBeCalledWith('./admin/login')
  })

  it('render register', () => {
    controller.renderRegister(res)
    expect(res.render).toBeCalledWith('./admin/register')
  })

  it('render admin index', () => {
    controller.renderAdmin(res)
    expect(res.render).toBeCalledWith('./admin/index')
  })
});
