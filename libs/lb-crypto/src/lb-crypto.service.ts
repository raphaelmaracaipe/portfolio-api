import { Injectable } from '@nestjs/common';
import * as forge from 'node-forge';

@Injectable()
export class LbCryptoService {
  generateCode = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

  encryptAES(textPlain: any, key: string, iv: string): string {
    const cipher = forge.cipher.createCipher('AES-CBC', forge.util.createBuffer(key));
    cipher.start({ iv: forge.util.createBuffer(iv) });
    cipher.update(forge.util.createBuffer(textPlain, 'utf8'));
    cipher.finish();
    return forge.util.encode64(cipher.output.getBytes());
  }

  decryptAES(textEncrypted: any, key: string, iv: string): string {
    const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.createBuffer(key));
    decipher.start({ iv: forge.util.createBuffer(iv) });
    decipher.update(forge.util.createBuffer(forge.util.decode64(textEncrypted)));
    decipher.finish();
    return decipher.output.toString('utf8');
  }
}
