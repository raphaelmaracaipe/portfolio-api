import { Injectable } from '@nestjs/common';
import * as jsonwebtoken from 'jsonwebtoken';

@Injectable()
export class LbJwtService {
  generate(
    payload: object,
    privateKey: string,
    passphrase: string,
    expiresIn = 0,
  ) {
    if (expiresIn) {
      return jsonwebtoken.sign(
        payload,
        {
          key: privateKey,
          passphrase,
        },
        {
          algorithm: 'RS256',
          expiresIn,
        },
      );
    }

    return jsonwebtoken.sign(
      payload,
      {
        key: privateKey,
        passphrase,
      },
      {
        algorithm: 'RS256',
      },
    );
  }

  verify(token: string, publicKey: string): any {
    return jsonwebtoken.verify(token, publicKey, { algorithms: ['RS256'] });
  }
}
