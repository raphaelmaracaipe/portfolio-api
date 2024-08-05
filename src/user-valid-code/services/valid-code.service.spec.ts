import { INestApplication } from '@nestjs/common';
import { ValidCodeService } from './valid-code.service';
import { MongoRepository } from 'typeorm';
import { User } from '../../core/models/user.model';
import { Test } from '@nestjs/testing';
import { Token } from '../../core/models/token.model';
import { ObjectId } from 'mongodb';
import { Codes } from '../../core/codes/codes';
import { LbBase64Service } from '@app/lb-base64';
import { LbJwtService } from '@app/lb-jwt';
import { LbKeysService } from '@app/lb-keys';

describe('ValidCodeService', () => {
  let app: INestApplication;
  let validCodeService: ValidCodeService;
  let userRepository: MongoRepository<User>;
  let tokenRepository: MongoRepository<Token>;
  const timeToValidationCode = 30;

  const userDTO: User = {
    id: new ObjectId('644d70b4573a660aa0ee65a4'),
    phone: '+5599999999',
    name: 'test',
    photo: '==aa',
    deviceId: 'a',
    passphrase: 'AAAA',
    privateKey: 'BBBB',
    publicKey: 'CCCC',
    isDeleted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  let tokenDTO: Token = {
    token: 168280,
    timeValidUntilOfCode: 9999,
    idUser: '644d70b4573a660aa0ee65a4',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ValidCodeService,
        {
          provide: 'UserRepository',
          useClass: MongoRepository,
        },
        {
          provide: 'TokenRepository',
          useClass: MongoRepository,
        },
        LbKeysService,
        LbJwtService,
        LbBase64Service,
        Codes,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    validCodeService = await moduleRef.resolve(ValidCodeService);
    userRepository = moduleRef.get<MongoRepository<User>>('UserRepository');
    tokenRepository = moduleRef.get<MongoRepository<Token>>('TokenRepository');

    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() + timeToValidationCode);

    tokenDTO = {
      ...tokenDTO,
      timeValidUntilOfCode: timestamp.getTime(),
    };
  });

  it('Send code invalid should return error', async () => {
    try {
      await validCodeService.valid(parseInt('123A45'), 'bEV2fPGKf12SE8WaDQeU');
      expect(true).toEqual(false);
    } catch (err) {
      const { message } = err;
      expect('Exception Bad Request').toEqual(message);
    }
  });

  it('When code is not valid until should return error', async () => {
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - 40);
    jest.spyOn(userRepository, 'updateOne').mockImplementationOnce(null);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(userDTO);
    jest.spyOn(tokenRepository, 'findOne').mockResolvedValue(tokenDTO);
    jest.spyOn(tokenRepository, 'deleteMany').mockImplementationOnce(null);

    try {
      await validCodeService.valid(123456, 'bEV2fPGKf12SE8WaDQeU');
    } catch (err) {
      const { message } = err;
      expect('Exception Bad Request').toEqual(message);
    }
  });

  it('When code is valid and save should return tokens', async () => {
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() + 30);

    jest.spyOn(userRepository, 'updateOne').mockImplementationOnce(null);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(userDTO);
    jest.spyOn(tokenRepository, 'findOne').mockResolvedValue(tokenDTO);
    jest.spyOn(tokenRepository, 'deleteMany').mockImplementationOnce(null);

    const refreshToken = await validCodeService.valid(123456, 'bEV2fPGKf12SE8WaDQeU');
    expect(refreshToken).not.toEqual('');
  });
});
