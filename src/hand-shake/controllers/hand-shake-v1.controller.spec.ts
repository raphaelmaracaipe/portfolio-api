import { HttpStatus, INestApplication } from '@nestjs/common';
import { Response, Request } from 'express';
import { Test, TestingModule } from '@nestjs/testing';
import { HandShakeV1Controller } from './hand-shake-v1.controller';
import { HandShakeService } from '../services/hand-shake.service';
import { MongoRepository } from 'typeorm';
import { LbCryptoService } from '@app/lb-crypto';
import { Codes } from '../../core/codes/codes';
import { ResponseEncrypted } from '../../core/response/response.encrypted';
import { Key } from '../../core/models/key.model';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../config/configuration';
import { RegexService } from '../../core/regex/regex.service';
import { DEVICE_ID_REGEX, KEY_REGEX } from '../../core/regex/regex';

describe('HandShakeV1Controller', () => {
  let app: INestApplication;
  let handShakeV1Controller: HandShakeV1Controller;
  let keyRepository: MongoRepository<Key>;
  const regexService = new RegexService();

  const mockResponse: Response = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as any;

  const mockRequest: Request = {
    headers: {
      device_id: regexService.generateRandom(DEVICE_ID_REGEX),
    },
  } as any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HandShakeV1Controller],
      providers: [
        {
          provide: 'KeyRepository',
          useClass: MongoRepository,
        },
        ConfigService<Configuration>,
        HandShakeService,
        Codes,
        ResponseEncrypted,
        RegexService,
        LbCryptoService,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    handShakeV1Controller = await moduleRef.resolve(HandShakeV1Controller);
    keyRepository = moduleRef.get<MongoRepository<Key>>('KeyRepository');
  });

  it('when recive all data and not exist data saved and return with success', async () => {
    jest.spyOn(keyRepository, 'count').mockResolvedValueOnce(0);
    jest.spyOn(keyRepository, 'save').mockResolvedValue(null);

    await handShakeV1Controller.create(
      {
        key: regexService.generateRandom(KEY_REGEX),
      },
      mockRequest,
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
  });

  it('when recive all data and exist return success but not saved again', async () => {
    jest.spyOn(keyRepository, 'count').mockResolvedValueOnce(1);

    await handShakeV1Controller.create(
      {
        key: regexService.generateRandom(KEY_REGEX),
      },
      mockRequest,
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
  });

  afterEach(async () => {
    await app.close();
  });
});
