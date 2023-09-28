import { LbCryptoService } from './lb-crypto.service';

describe('LbCryptoService', () => {
  const crypto = new LbCryptoService();
  const iv = 'RF22SW76BV83EDH8';
  const key = 'askjd4432ajdl@q9';

  it('when you want get code of verification', () => {
    const code = crypto.generateCode(100000, 999999);
    expect(code).not.toEqual(0);
  });

  it('when you want generate text plain to text encrypt', () => {
    const returnDataEncrypted = crypto.encryptAES('test', key, iv);
    expect(returnDataEncrypted).not.toEqual('');
  });

  it('when you want generate text encrypted to text pain', () => {
    const returnDataEncrypted = crypto.encryptAES('test', key, iv);
    const textPlain = crypto.decryptAES(returnDataEncrypted, key, iv);
    expect(textPlain).toEqual('test');
  });
});
