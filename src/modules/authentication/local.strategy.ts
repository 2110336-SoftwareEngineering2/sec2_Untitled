  import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({passReqToCallback : true});
  }

  async validate(@Req() req, username: string, password: string): Promise<any> {
    const {role} = req.body;
    if (!role || !(role === 'owner' || role === 'sitter')) throw new UnauthorizedException();
    const user = await this.authService.validateUser(role,username, password);
    if (!user) throw new UnauthorizedException();
    return {...user,role};
  }
}
