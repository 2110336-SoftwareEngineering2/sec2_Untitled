import { AccountService } from '../account/account.service';
import { Body, Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly accountService: AccountService,
        private readonly jwtService: JwtService
    ) {}

    register(@Body() dto){
        return this.accountService.createAccount(dto.role,dto)
    }

    logout(@Res() res){
        res.cookie('token', "")
        return res.redirect('/')
    }


    async validateUser(role: string, username: string, pass: string): Promise<any> {
        const user = await this.accountService.findAccountByUsername(role,username);
        if (user && await compare(pass,user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    login({username, id, role}: any, @Res() res) {
        const payload = { username, sub: id, role};
        const token = this.jwtService.sign(payload)
        res.cookie('token', token);
        const paths = {owner: '/search', sitter: '/book/my', admin: '/support'}
        return res.redirect(paths[role])
    }


}