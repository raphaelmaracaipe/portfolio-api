import { Test, TestingModule } from '@nestjs/testing';
import { LbJwtService } from './lb-jwt.service';
import { INestApplication } from '@nestjs/common';
import { Keys } from 'src/utils/keys/keys';

describe('LbJwtService', () => {
  let app: INestApplication;
  let jwt: LbJwtService;
  let keys: Keys;
  let privatekey = '';
  let publickey = '';
  let phrasePass = '';

  const payload = {
    test: 'Test data of payload',
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [LbJwtService, Keys],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    jwt = await moduleRef.resolve(LbJwtService);
    keys = await moduleRef.resolve(Keys);

    const { publicKey, privateKey, key } =
      await keys.generatePrivateAndPublicKey();
    privatekey = privateKey;
    publickey = publicKey;
    phrasePass = key;
  });

  it('when request generate token should call method to generate', async () => {
    const token = await jwt.generate(payload, privatekey, phrasePass);
    expect(token).not.toEqual('');
  });

  it('when request generate token but phrasepass incorret should execute error', async () => {
    try {
      await jwt.generate(payload, privatekey, '123');
      expect(true).toEqual(false);
    } catch (err) {
      expect(true).toEqual(true);
    }
  });

  it('When you want check your token should call method', async () => {
    const token = await jwt.generate(payload, privatekey, phrasePass);
    const payloadInToken: { test: string } = await jwt.verify(token, publickey);
    expect(payload.test).toContain(payloadInToken.test);
  });

  it('When you want check your token but pass token invalid', async () => {
    const token = await jwt.generate(payload, privatekey, phrasePass);
    try {
      await jwt.verify(`${token}a`, publickey);
      expect(true).toEqual(false);
    } catch (err) {
      expect(true).toEqual(true);
    }
  });

  it('When you want generate token with expiration and check if token is valid', async () => {
    const tokenJWT = await jwt.generate(payload, privatekey, phrasePass, 10000);
    const payloadInToken: { test: string } = await jwt.verify(
      tokenJWT,
      publickey,
    );
    expect(payload.test).toEqual(payloadInToken.test);
  });

  it('When you want generate token with expiration and check if token is valid but token is expired', async () => {
    const tokenJWT = await jwt.generate(payload, privatekey, phrasePass, 1);
    setTimeout(async () => {
      try {
        await jwt.verify(tokenJWT, publickey);
        expect(true).toEqual(false);
      } catch (err) {
        expect(true).toEqual(true);
      }
    }, 1000);
  });

  afterEach(async () => {
    await app.close();
  });
});
