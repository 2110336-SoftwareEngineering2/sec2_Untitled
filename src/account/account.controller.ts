import { Controller, Get, Response } from '@nestjs/common';
import { AccountService } from './account.service'

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Get('/login')
  renderLogin(@Response() res): any {
    res.render('account/login')
  }

  @Get('/register')
  renderRegister(@Response() res): any {
    res.render('account/register')
  }

}

