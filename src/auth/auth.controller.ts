import { Body, Controller, Post, Res } from '@nestjs/common';
import { PetOwner } from 'src/entities/petowner.entity';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) { }

    @Post('login')
    login(@Body() dto: Omit<PetOwner, 'id'>, @Res() res: Response) {
        return this.service.login(dto, res);
    }
}
