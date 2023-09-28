import { INestApplication } from '@nestjs/common';
import { DecryptedService } from './decrypted.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { MongoRepository } from 'typeorm';
import { Codes } from '../../../core/codes/codes';
import { LbCryptoService } from '@app/lb-crypto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegexService } from '../../../core/regex/regex.service';
import { DEVICE_ID_REGEX } from '../../../core/regex/regex';
import config from '../../../config/config';
import { Key } from '../../../core/models/key.model';

describe('DecryptedService', () => {
  let app: INestApplication;
  let decryptedService: DecryptedService;
  let regex: RegexService;
  let keyRepository: MongoRepository<Key>;

  beforeEach(async () => {
    const modularRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          envFilePath: `envs/.${process.env.NODE_ENV}.env`,
          load: [config],
        }),
      ],
      providers: [
        {
          provide: 'KeyRepository',
          useClass: MongoRepository,
        },
        Codes,
        LbCryptoService,
        ConfigService,
        DecryptedService,
        RegexService,
      ],
    }).compile();

    app = modularRef.createNestApplication();
    await app.init();

    decryptedService = await modularRef.resolve(DecryptedService);
    keyRepository = modularRef.get<MongoRepository<Key>>('KeyRepository');
    regex = await modularRef.resolve(RegexService);
  });

  const mockNext = () => undefined;

  it('when send device Id invalid', async () => {
    try {
      const mockRequest: Request = {
        headers: {
          device_id: 'AAA',
        },
      } as any;

      await decryptedService.start(mockRequest, mockNext);
    } catch (e) {
      expect(e.response).toEqual(3001);
    }
  });

  it('when send device Id valid', async () => {
    try {
      const mockRequest: Request = {
        headers: {
          device_id: regex.generateRandom(DEVICE_ID_REGEX),
          seed: process.env.IV_DEFAULT,
        },
      } as any;

      await decryptedService.start(mockRequest, mockNext);
      expect(true).toEqual(true);
    } catch (e) {
      expect(true).toEqual(false);
    }
  });

  it('when send device Id valid but send develop', async () => {
    try {
      const mockRequest: Request = {
        headers: {
          device_id: regex.generateRandom(DEVICE_ID_REGEX),
          seed: process.env.IV_DEFAULT,
          dev: 'true',
        },
      } as any;

      await decryptedService.start(mockRequest, mockNext);
      expect(true).toEqual(true);
    } catch (e) {
      expect(true).toEqual(false);
    }
  });

  it('when send device Id valid but not exist key registered', async () => {
    try {
      jest.spyOn(keyRepository, 'findOne').mockResolvedValue(null);
      const mockRequest: Request = {
        headers: {
          device_id: regex.generateRandom(DEVICE_ID_REGEX),
          seed: process.env.IV_DEFAULT,
        },
        body: {
          dataOfBodyEncrypted: {
            data: {
              test: 'a',
            },
          },
        },
      } as any;

      await decryptedService.start(mockRequest, mockNext);
      expect(true).toEqual(true);
    } catch (e) {
      expect(true).toEqual(false);
    }
  });

  it('when send device Id valid but not exist key registered', async () => {
    try {
      jest.spyOn(keyRepository, 'findOne').mockResolvedValue({
        key: String(process.env.IV_DEFAULT),
        deviceId: 'a',
        idUser: '',
        createdAt: 0,
        updatedAt: 0,
      });

      const mockRequest: Request = {
        headers: {
          device_id: regex.generateRandom(DEVICE_ID_REGEX),
          seed: process.env.IV_DEFAULT,
        },
        body: {
          dataOfBodyEncrypted: {
            data: {
              test: 'a',
            },
          },
        },
      } as any;

      await decryptedService.start(mockRequest, mockNext);
      expect(true).toEqual(true);
    } catch (e) {
      expect(true).toEqual(false);
    }
  });
});
