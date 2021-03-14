import { Body, Controller, Get, Post, Response, Request, Redirect, Patch, UseGuards, Req, Res } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { AccountService } from './account.service'

@UseGuards(JwtAuthGuard)
@Controller('/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  // @Post('/register')
  // @Redirect('/')
  // createAccount(@Body() dto){
  //   return this.accountService.createAccount(dto.role, dto)
  // }

  @Get()
  async renderAccount(@Req() req, @Res() res){
    const {role, id} = req.user;
    const account = await this.accountService.findAccountById(role,id);
    const pet = await this.accountService.findPetbyId(role,id);
    const profile = {account,pet};
    console.log(`🚀 ~ file: account.controller.ts ~ line 24 ~ AccountController ~ renderAccount ~ profile`, profile)
    
    return res.render('account/profile', {...profile})
  }

  @Get('/edit')
  async renderEditProfile(@Req() req, @Res() res): Promise<any> {
    const {role, id} = req.user;
    let profile = await this.accountService.findAccountById(role,id);
    const isFemale = profile.gender=="F";
    if (role === 'owner') return res.render('account/editownerprofile',{...profile, isFemale});
    else if (role === 'sitter') return res.render('account/editsitterprofile',{...profile, isFemale});
  }

  @Post('/edit')
  async updateOwner(@Body() dto: Omit<PetOwner | PetSitter, 'id'>, @Req() req, @Res() res){
    const {role, id} = req.user
    await this.accountService.updateAccount(role,id,dto);
    res.redirect('/account')
  }

  //Pet

  @Get('/register/pet')
  async renderRegisterPet(@Res() res){
    res.render('account/registerpet')
  }

  @Post('/register/pet')
  createPet(@Body() dto, @Req() req, @Res() res){
    this.accountService.createPet(dto, req);
    res.redirect('/account')
  }

}
