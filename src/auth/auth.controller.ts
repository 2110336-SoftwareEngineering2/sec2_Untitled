import { Body, Controller, Post } from '@nestjs/common';
import { PetOwner } from 'src/entities/petowner.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService){}

    @Post('login')
    login(@Body() dto: Omit<PetOwner, 'id'>){
        return this.service.login(dto);
    }
}
