import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class LbCryptoService {
  generateCode = (min: number, max: number) => crypto.randomInt(min, max);

  encryptAES(textPlain: any, key: string, iv: string): string {
    const keyParse = CryptoJS.enc.Utf8.parse(key);
    const ivPerse = CryptoJS.enc.Utf8.parse(iv.substring(0, 16));

    const encrypted = CryptoJS.AES.encrypt(textPlain, keyParse, {
      iv: ivPerse,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  decryptAES(textEncrypted: any, key: string, iv: string): string {
    const keyParse = CryptoJS.enc.Utf8.parse(key);
    const ivPerse = CryptoJS.enc.Utf8.parse(iv.substring(0, 16));

    const decrypted = CryptoJS.AES.decrypt(textEncrypted, keyParse, {
      iv: ivPerse,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
