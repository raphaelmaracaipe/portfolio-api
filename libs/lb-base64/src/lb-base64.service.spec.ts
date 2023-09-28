import { Test, TestingModule } from '@nestjs/testing';
import { LbBase64Service } from './lb-base64.service';
import { INestApplication } from '@nestjs/common';

describe('LbBase64Service', () => {
  let app: INestApplication;
  let base64: LbBase64Service;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [LbBase64Service],
    }).compile();

    app = moduleRef.createNestApplication();
    app.init();

    base64 = await moduleRef.resolve(LbBase64Service);
  });

  it('when receive text plain should return text cripted', () => {
    const textEncripted = base64.encode('test');
    expect(textEncripted).toEqual('dGVzdA==');
  });

  it('when receive text encripted should return text decripted', () => {
    const textPlain = base64.decode('dGVzdA==');
    expect(textPlain).toEqual('test');
  });

  afterEach(async () => {
    await app.close();
  });
});
