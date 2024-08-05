import * as passport from 'passport';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';
import { ExceptionUnathorizedRequest } from 'src/core/exeptions/exceptionUnauthorizedRequest';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  private logger = new Logger(AuthMiddleware.name);

  use(req: Request, res: Response, next: (error?: any) => void) {
    passport.authenticate('headerapikey', { session: false }, (value) => {
      if (value) {
        this.logger.log(`token is valid: ${value}`);
        next();
      } else {
        this.logger.error(`token is not valid: ${value}`);
        throw new ExceptionUnathorizedRequest('');
      }
    })(req, res, next);
  }
}
