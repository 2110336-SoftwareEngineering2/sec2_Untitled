import { Body, Controller, Get, Post, UseGuards, Req, Res, Patch } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AccountService } from './account.service'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Roles('owner','sitter')
  @Get()
  async renderAccount(@Req() {user: {role,id}}, @Res() res){
    const account = await this.accountService.findAccountById(role,id);
    const pet = await this.accountService.findPetbyOwnerId(role,id);
    const profile = {account,pet};
    return res.render('account/profile', profile)
  }
  
  @Roles('owner','sitter')
  @Get('/edit')
  async renderEditProfile(@Req() {user: {role,id}}, @Res() res): Promise<any> {
    const profile = await this.accountService.findAccountById(role,id);
    if (role === 'owner') return res.render('account/editOwnerProfile', profile);
    else return res.render('account/editSitterProfile', profile);
  }

  @Roles('owner','sitter')
  @Post('/edit')
  async updateAccount(@Body() dto: Omit<PetOwner | PetSitter, 'id'>, @Req() {user: {role,id}}, @Res() res){
    await this.accountService.updateAccount(role,id,dto);
    res.redirect('/account')
  }

  //Pet
  @Roles('owner')
  @Get('/register/pet')
  async renderRegisterPet(@Req() {user: {role,id}}, @Res() res){
    const profile = await this.accountService.findAccountById(role,id);
    res.render('account/registerPet',profile)
  }
  @Roles('owner')
  @Post('/register/pet')
  async createPet(@Body() dto, @Req() req, @Res() res){
    await this.accountService.createPet(dto, req);
    res.send('/account')
  }

  @Roles('sitter')
  @Patch('/withdraw')
  async withdrawMoney(@Req() { user: { id } },  @Body() { amount }){
    return await this.accountService.withdrawBalance(id,amount)
  }
}
