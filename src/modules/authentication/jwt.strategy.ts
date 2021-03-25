import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { cookieExtractor } from './cookie-extractor';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }


  async validate(payload: any) {
    const {role} = payload;
    if (!role || !(role === 'owner' || role === 'sitter' || role === 'admin')) throw new UnauthorizedException();
    return { id: payload.sub, username: payload.username, role: payload.role };
  }
}
