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

    register(@Body() dto){
        return this.accountService.createAccount(dto.role,dto)
    }

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
        if (user.role === "owner") return res.redirect('/search')
        else if (user.role === "sitter") return res.redirect('/book/my')
        else return res.redirect('/') // ! this code should never run
    }


}