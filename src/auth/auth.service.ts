import { AccountService } from '../account/account.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PetOwner } from 'src/entities/petowner.entity';

@Injectable()
export class AuthService {
    constructor(private readonly accountService: AccountService, private readonly jwtService: JwtService) {
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.accountService.findOwnerByUsername(username);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login({ username, password }: Omit<PetOwner,'id'>) {
        const user = await this.accountService.findOwnerByUsername(username);
        if (!user) {
            throw new BadRequestException('Invalid username or password');
        }
        const isValid = await compare(password, user.password);
        if (!isValid) {
            throw new BadRequestException('Invalid username or password');
        }
        return this.jwtService.sign({ uid: user.id });
    }

    verifyToken(token: string): { uid: number } {
        return this.jwtService.verify(token);
    }

}