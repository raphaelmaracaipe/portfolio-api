import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';
import { DecryptedService } from './decrypted.service';

@Injectable()
export class DecryptedMiddleware implements NestMiddleware {
  constructor(private readonly decrypted: DecryptedService) {}

  async use(req: Request, res: Response, next: (error?: any) => void) {
    await this.decrypted.start(req, next);
  }
}
