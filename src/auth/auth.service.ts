import { AccountService } from '../account/account.service';
import { BadRequestException, Body, Injectable, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PetOwner } from 'src/entities/petowner.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly accountService: AccountService,
        private readonly jwtService: JwtService
    ) {}

    logout(res: Response){
        res.cookie('token', "")
        return res.redirect('/')
    }

    async validateUser(role: string, username: string, pass: string): Promise<any> {
        const user = await this.accountService.findAccountByUsername(role,username);
        if (user && compare(pass,user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    login(user: any, @Res() res) {
        const payload = { username: user.username, sub: user.id, role: user.role};
        const token = this.jwtService.sign(payload)
        res.cookie('token', token);
        return res.redirect('/')
    }

    
    // async login(@Body() body, @Res() res: Response) {
    //     const {username, password, isPetSitter} = body
    //     const role = isPetSitter === 'true' ? 'sitter' : 'owner'
    //     const user = await this.accountService.findAccountByUsername(role,username);
    //     if (!user) throw new BadRequestException('Invalid username or password');
    //     const isValid = await compare(password, user.password);
    //     if (!isValid ) throw new BadRequestException('Invalid username or password');
    //     const token = this.jwtService.sign({ uid: user.id, role});
    //     res.cookie('token', token);
    //     return res.send('Cookie has been set! :)')
    // }


}