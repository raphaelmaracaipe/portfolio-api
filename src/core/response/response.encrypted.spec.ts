import { Test, TestingModule } from '@nestjs/testing';
import { MongoRepository } from 'typeorm';
import { LbCryptoService } from '@app/lb-crypto';
import { ConfigService } from '@nestjs/config';
import { Key } from '../../core/models/key.model';
import { IResponse } from './iresponse';
import { ResponseEncrypted } from './response.encrypted';
import { Response } from 'express';

describe('ResponseEncrypted', () => {
  let service: ResponseEncrypted;
  let keyRepository: MongoRepository<Key>;
  let cryptoService: LbCryptoService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponseEncrypted,
        {
          provide: 'KeyRepository',
          useClass: MongoRepository,
        },
        {
          provide: LbCryptoService,
          useValue: {
            encryptAES: jest.fn(),
            decryptAES: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'KEY_DEFAULT') return 'default-key';
              if (key === 'IV_DEFAULT') return 'default-iv';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ResponseEncrypted>(ResponseEncrypted);
    keyRepository = module.get<MongoRepository<Key>>('KeyRepository');
    cryptoService = module.get<LbCryptoService>(LbCryptoService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('when send dev mode in true', async () => {
    const iResponse: IResponse = {
      response: {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any,
      request: {
        headers: {
          dev: 'true',
          seed: 'some-seed',
        },
      } as any,
      data: { key: 'value' },
      httpStatus: 200,
    };

    await service.encrypted(iResponse);

    expect(iResponse.response.status).toHaveBeenCalledWith(200);
    expect(iResponse.response.send).toHaveBeenCalledWith({ key: 'value' });
  });

  it('when send dev mode in true', async () => {
    const iResponse: IResponse = {
      response: {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any,
      request: {
        headers: {
          dev: 'false',
          seed: 'some-seed',
          device_id: 'test device'
        },
      } as any,
      data: { key: 'value' },
      httpStatus: 200,
    };

    const key = new Key()
    key.key = "test of key"

    jest.spyOn(cryptoService, 'decryptAES').mockReturnValue("test")
    jest.spyOn(cryptoService, 'encryptAES').mockReturnValue("test enc")
    jest.spyOn(keyRepository, 'findOne').mockImplementation(() => Promise.resolve(key))
    
    await service.encrypted(iResponse);

    expect(iResponse.response.status).toHaveBeenCalledWith(200);
    expect(iResponse.response.send).toHaveBeenCalledWith({ data: 'test enc' });
  });

  it('when send dev mode in true and iv not null', async () => {
    const iResponse: IResponse = {
      response: {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any,
      iv: 'test iv',
      key: 'test key',
      request: {
        headers: {
          dev: 'false',
          seed: 'some-seed',
          device_id: 'test device'
        },
      } as any,
      data: { key: 'value' },
      httpStatus: 200,
    };

    const key = new Key()
    key.key = "test of key"

    jest.spyOn(cryptoService, 'decryptAES').mockReturnValue("test")
    jest.spyOn(cryptoService, 'encryptAES').mockReturnValue("test enc")
    jest.spyOn(keyRepository, 'findOne').mockImplementation(() => Promise.resolve(key))
    
    await service.encrypted(iResponse);

    expect(iResponse.response.status).toHaveBeenCalledWith(200);
    expect(iResponse.response.send).toHaveBeenCalledWith({ data: 'test enc' });
  });
});
