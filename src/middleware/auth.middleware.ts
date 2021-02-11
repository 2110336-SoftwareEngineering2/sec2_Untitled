import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService){}

  use(req: Request, _: Response, next: () => void) {
    const token = (req.headers.authorization ?? '').split('Bearer ')[1];
    console.log(token);
    try{
      const {uid} = this.authService.verifyToken(token);
      console.log('uid', uid);
      if(uid){
        req.uid = uid;
      }
    } catch {
      req.uid = undefined;
    }
    next();
  }
}
