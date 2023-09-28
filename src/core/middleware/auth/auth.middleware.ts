import * as passport from 'passport';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';
import { ExceptionUnathorizedRequest } from 'src/core/exeptions/exceptionUnauthorizedRequest';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: any) => void) {
    passport.authenticate('headerapikey', { session: false }, (value) => {
      if (value) {
        next();
      } else {
        throw new ExceptionUnathorizedRequest('');
      }
    })(req, res, next);
  }
}
