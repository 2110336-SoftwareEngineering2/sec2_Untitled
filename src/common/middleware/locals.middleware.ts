import { Request, Response, NextFunction } from 'express';

export function locals(req: Request, res: Response, next: NextFunction) {
  res.locals.token = req.cookies['token'];
  next();
};
