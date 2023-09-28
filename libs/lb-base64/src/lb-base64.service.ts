import { Injectable } from '@nestjs/common';

@Injectable()
export class LbBase64Service {
  encode(text: string): string {
    return Buffer.from(text).toString('base64');
  }

  decode(base64Encoded: string): string {
    return Buffer.from(base64Encoded, 'base64').toString();
  }
}
