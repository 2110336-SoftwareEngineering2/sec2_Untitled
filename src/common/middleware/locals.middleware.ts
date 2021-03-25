import { Req } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function locals(req: Request, res: Response, next: NextFunction) {
  res.locals.token = req.cookies['token'];
  // if (req.user) res.locals.currentUser = req.user
  next();
};
