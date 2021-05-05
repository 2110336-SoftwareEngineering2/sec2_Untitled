import { Controller, Post, Res, Get, Req, UseGuards, Redirect, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    @Redirect('/')
    async register(@Body() dto){
    return await this.authService.register(dto)
    }
    
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Req() {user}, @Res() res){
        return this.authService.login(user, res)
    }

    @Get('/logout')
    logout(@Res() res){
        return this.authService.logout(res);
    }
}
