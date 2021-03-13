import { Controller, Post, Res, Get, Req, UseGuards, Redirect, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    @Redirect('/')
    register(@Body() dto){
    return this.authService.register(dto)
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Req() req: Request, @Res() res: Response){
        return this.authService.login(req.user, res)
    }

    @Get('/logout')
    logout(@Res() res: Response){
        return this.authService.logout(res);
    }
}
