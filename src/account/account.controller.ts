import { Body, Controller, Get, Post, Response } from '@nestjs/common';
import { PetOwner } from 'src/entities/petowner.entity';
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

  @Post('/register')
  createPetOwner(@Body() dto: Omit<PetOwner, 'id'>){
    return this.accountService.createPetOwner(dto);
  }
}

