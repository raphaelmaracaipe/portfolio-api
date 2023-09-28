import { INestApplication, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { Test, TestingModule } from '@nestjs/testing';
import { UserValidCodeV1Controller } from './user-valid-code-v1.controller';
import { ValidCodeService } from '../services/valid-code.service';
import { MongoRepository } from 'typeorm';
import { Codes } from '../../core/codes/codes';
import { ResponseEncrypted } from '../../core/response/response.encrypted';
import { LbBase64Service } from '@app/lb-base64';
import { LbJwtService } from '@app/lb-jwt';
import { LbKeysService } from '@app/lb-keys';
import { LbCryptoService } from '@app/lb-crypto';
import { Configuration } from 'src/config/configuration';
import { ConfigService } from '@nestjs/config';

describe('UserValidCodeV1Controller', () => {
  let app: INestApplication;
  let userController: UserValidCodeV1Controller;
  let validCodeService: ValidCodeService;

  const mockResponse: Response = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as any;

  const mockRequest: Request = {
    headers: {
      dev: 'true',
    },
  } as any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserValidCodeV1Controller],
      providers: [
        {
          provide: 'UserRepository',
          useClass: MongoRepository,
        },
        {
          provide: 'TokenRepository',
          useClass: MongoRepository,
        },
        {
          provide: 'KeyRepository',
          useClass: MongoRepository,
        },
        ConfigService<Configuration>,
        ValidCodeService,
        LbKeysService,
        LbJwtService,
        LbBase64Service,
        Codes,
        ResponseEncrypted,
        LbCryptoService,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userController = await moduleRef.resolve(UserValidCodeV1Controller);
    validCodeService = await moduleRef.resolve(ValidCodeService);
  });

  it('When receive code and processing with sucess', async () => {
    jest
      .spyOn(validCodeService, 'valid')
      .mockImplementation(() =>
        Promise.resolve({ accessToken: 'a', refreshToken: 'a' }),
      );
    await userController.valid('1', mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
  });
});
