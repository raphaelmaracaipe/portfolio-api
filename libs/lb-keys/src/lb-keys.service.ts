import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class LbKeysService {
  async generatePrivateAndPublicKey(): Promise<{
    publicKey: string;
    privateKey: string;
    key: string;
  }> {
    const key = this.generateRandomKey(10);
    const keys = await crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: key,
      },
    });

    return { ...keys, key };
  }

  private generateRandomKey = (size: number) =>
    crypto.randomBytes(size).toString('hex');
}
