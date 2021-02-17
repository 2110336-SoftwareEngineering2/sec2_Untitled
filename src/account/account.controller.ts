import { Body, Controller, Get, Post, Response, Request, Redirect, Patch, UseGuards, Req, Res } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { AccountService } from './account.service'

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  // @Post('/register/petowner')
  // createPetOwner(@Body() dto: Omit<PetOwner, 'id'>){
  //   return this.accountService.createPetOwner(dto);
  // }

  // @Post('/register/petsitter')
  // createPetSitter(@Body() dto: Omit<PetSitter, 'id'>){
  //   return this.accountService.createPetSitter(dto);
  // }

  @Post('/register')
  createAccount(@Body() dto){
    return this.accountService.createAccount(dto.role, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/account/edit')
  async renderEditProfile(@Req() req, @Res() res): Promise<any> {
    const {role, id} = req.user;
    let profile = await this.accountService.findAccountById(role,id);
    const isFemale = profile.gender=="F";
    if (role === 'owner') return res.render('account/editownerprofile',{...profile, isFemale});
    else if (role === 'sitter') return res.render('account/editsitterprofile',{...profile, isFemale});
  }

  @UseGuards(JwtAuthGuard)
  @Post('/account/edit')
  async updateOwner(@Body() dto: Omit<PetOwner | PetSitter, 'id'>, @Req() req, @Res() res){
    const {role, id} = req.user
    await this.accountService.updateAccount(role,id,dto);
    res.redirect('/account/edit')
  }

  // @Post('/account/editsitterprofile')
  // updateSitter(@Body() dto: Omit<PetSitter, 'id'>, @Request() req){
  //   const id = req.uid;
  //   return this.accountService.updatePetSitter(id,dto);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('/secret')
  renderSecret(@Req() req, @Res() res){
    res.send(req.user)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/owner')
  @Roles('owner')
  renderOwner(){
    return "This is a path for logged in owner"
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/sitter')
  @Roles('sitter')
  renderSitter(){
    return "This is a path for logged in sitter"
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/both')
  @Roles('sitter','owner')
  renderBoth(){
    return "This is a path for logged in owner or sitter"
  }


//   @Get('/application')
//   renderApplication(@Response() res, @Request() req): any{
//     if(req.uid){
//       res.render(...)
//     }
//     else{
//       res.redirect("/")
//     }
//   }
}

