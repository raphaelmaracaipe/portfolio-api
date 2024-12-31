import { INestApplication } from '@nestjs/common';
import { TokensServices } from './tokens.service';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoRepository } from 'typeorm';
import { User } from '../../core/models/user.model';
import { LbJwtService } from '@app/lb-jwt';
import { Codes } from '../../core/codes/codes';
import { LbKeysService } from '@app/lb-keys';
import { LbBase64Service } from '@app/lb-base64';
import {
  TOKEN_TYPE_ACCESS,
  TOKEN_TYPE_REFRESH,
} from '../../core/tokens/tokens.const';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../config/configuration';

describe('TokensServices', () => {
  let app: INestApplication;
  let tokenService: TokensServices;
  let jwtService: LbJwtService;
  let keyService: LbKeysService;
  let userRepository: MongoRepository<User>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UserRepository',
          useClass: MongoRepository,
        },
        TokensServices,
        Codes,
        LbJwtService,
        LbKeysService,
        LbBase64Service,
        ConfigService<Configuration>,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userRepository = await moduleRef.get<MongoRepository<User>>(
      'UserRepository',
    );
    tokenService = await moduleRef.resolve(TokensServices);
    keyService = await moduleRef.resolve(LbKeysService);
    jwtService = await moduleRef.resolve(LbJwtService);
  });

  it('when consult if user exist but not exist should return exception', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    try {
      await tokenService.valid('AAA', {
        refresh: 'refreshToken',
      });
      expect(true).toEqual(false);
    } catch {
      expect(true).toEqual(true);
    }
  });

  it('when check type token but token have type invalid should return exception', async () => {
    jest
      .spyOn(jwtService, 'verify')
      .mockResolvedValue({ type: TOKEN_TYPE_ACCESS });
    jest.spyOn(userRepository, 'findOne').mockResolvedValue({
      phone: '...',
      name: '...',
      deviceId: '...',
      photo: '...',
      passphrase: '...',
      publicKey: 'Li4u',
      privateKey: 'Li4u',
      createdAt: 0,
      updatedAt: 0,
      isDeleted: false,
      reminder: '...',
    });

    try {
      await tokenService.valid('AAA', {
        refresh: 'refreshToken',
      });
      expect(true).toEqual(false);
    } catch {
      expect(true).toEqual(true);
    }
  });

  it('when check type token but jwt return error should return exception', async () => {
    jest.spyOn(jwtService, 'verify').mockResolvedValue(() => {
      throw Error('test of fail');
    });
    jest.spyOn(userRepository, 'findOne').mockResolvedValue({
      phone: '...',
      name: '...',
      deviceId: '...',
      photo: '...',
      passphrase: '...',
      publicKey: 'Li4u',
      privateKey: 'Li4u',
      createdAt: 0,
      updatedAt: 0,
      isDeleted: false,
      reminder: '...',
    });

    try {
      await tokenService.valid('AAA', {
        refresh: 'refreshToken',
      });
      expect(true).toEqual(false);
    } catch {
      expect(true).toEqual(true);
    }
  });

  it('when success in all process and update with success in db should return tokens', async () => {
    jest.spyOn(jwtService, 'generate').mockResolvedValue('...');
    jest
      .spyOn(jwtService, 'verify')
      .mockResolvedValue({ type: TOKEN_TYPE_REFRESH });
    jest.spyOn(userRepository, 'updateOne').mockResolvedValue(null);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue({
      phone: '...',
      name: '...',
      deviceId: '...',
      photo: '...',
      passphrase: '...',
      publicKey: 'Li4u',
      privateKey: 'Li4u',
      createdAt: 0,
      updatedAt: 0,
      isDeleted: false,
      reminder: '...',
    });
    jest.spyOn(keyService, 'generatePrivateAndPublicKey').mockResolvedValue({
      privateKey: '...',
      publicKey: '...',
      key: '...',
    });

    try {
      const { refreshToken, accessToken } = await tokenService.valid('AAA', {
        refresh: 'refreshToken',
      });

      expect(accessToken).toEqual('...');
      expect(refreshToken).toEqual('...');
    } catch (e) {
      expect(true).toEqual(false);
    }
  });

  afterEach(async () => {
    await app.close();
  });
});
