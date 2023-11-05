import { HttpStatus, INestApplication } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserCodeService } from '../services/user-code-service.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserSendCodeV1Controller } from './user-send-code-v1.controller';
import { MongoRepository } from 'typeorm';
import { Codes } from '../../core/codes/codes';
import { ResponseEncrypted } from '../../core/response/response.encrypted';
import { LbCryptoService } from '@app/lb-crypto';
import { Configuration } from 'src/config/configuration';
import { ConfigService } from '@nestjs/config';

describe('UserSendCodeV1Controller', () => {
  let app: INestApplication;
  let userController: UserSendCodeV1Controller;
  let userService: UserCodeService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserSendCodeV1Controller],
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
        LbCryptoService,
        UserCodeService,
        Codes,
        ResponseEncrypted,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userController = await moduleRef.resolve(UserSendCodeV1Controller);
    userService = await moduleRef.resolve(UserCodeService);
  });

  const mockResponse: Response = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as any;

  const mockRequest: Request = {
    headers: {
      device_id: 'AAA',
    },
  } as any;

  describe('Create', () => {
    it('Should return success code 200 with tokens of access', async () => {
      jest
        .spyOn(userService, 'generate')
        .mockImplementation(() => Promise.resolve());

      await userController.create(
        {
          deviceId: 'AAA',
          phone: '+555',
        },
        mockRequest,
        mockResponse,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('When happen error generic should show code 500 and message error', async () => {
      const msgError = { message: 'Happen generic error' };
      jest
        .spyOn(userService, 'generate')
        .mockImplementation(() => Promise.reject(msgError));
      try {
        await userController.create(
          {
            deviceId: 'AAA',
            phone: '+555',
          },
          mockRequest,
          mockResponse,
        );
      } catch (err) {
        expect(err.message).toEqual(msgError.message);
      }
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
