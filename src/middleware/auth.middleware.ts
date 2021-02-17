import { Get, Injectable, NestMiddleware, Redirect, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService){}

  use(@Req() req, @Res() res, next: () => void) {
    const token = (req.headers.cookie ?? '').split('token=')[1];
    console.log(token)
    try {
      const {uid} = this.verifyToken(token);
      if (uid){
        req.uid = uid;
        next();
      }
      else{
        return res.send("GO BACKK")
      }
    }
    catch (e) {
      res.redirect('/')
    }
  }

  verifyToken(token: string): { uid: number } {
    return this.jwtService.verify(token);
}
}
