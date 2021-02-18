import { Controller, Post, Res, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // @Post('/login')
    // login(@Body() dto, @Res() res: Response) {
    //     return this.authService.login(dto, res);
    // }

    @Get('/logout')
    logout(@Res() res: Response){
        return this.authService.logout(res);
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Req() req: Request, @Res() res: Response){
        return this.authService.login(req.user, res)
    }
}
