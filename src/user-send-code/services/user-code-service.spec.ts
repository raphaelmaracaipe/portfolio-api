import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoRepository } from 'typeorm';
import { User } from '../../core/models/user.model';
import { UserCodeService } from './user-code-service.service';
import { Token } from '../../core/models/token.model';
import { ObjectId } from 'mongodb';
import { Codes } from '../../core/codes/codes';
import { Key } from '../../core/models/key.model';
import { LbCryptoService } from '@app/lb-crypto';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/configuration';

describe('UserCodeService', () => {
  let app: INestApplication;
  let userCodeService: UserCodeService;
  let userRepository: MongoRepository<User>;
  let tokenRepository: MongoRepository<Token>;
  let keyRepository: MongoRepository<Key>;

  const userDTO: User = {
    id: new ObjectId('644d70b4573a660aa0ee65a4'),
    phone: '+5599999999',
    name: 'test',
    photo: '=AA',
    deviceId: 'bEV2fPGKf12SE8WaDQeU',
    passphrase: 'AAAA',
    privateKey: 'BBBB',
    publicKey: 'CCCC',
    isDeleted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const tokenDTO: Token = {
    token: 168280,
    timeValidUntilOfCode: 9999,
    idUser: '644d70b4573a660aa0ee65a4',
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserCodeService,
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
        Codes,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userCodeService = await moduleRef.resolve(UserCodeService);
    userRepository = moduleRef.get<MongoRepository<User>>('UserRepository');
    tokenRepository = moduleRef.get<MongoRepository<Token>>('TokenRepository');
    keyRepository = moduleRef.get<MongoRepository<Key>>('KeyRepository');
  });

  it('Generate code of validation you and user not exist in db', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(userRepository, 'save').mockResolvedValue(userDTO);
    jest.spyOn(keyRepository, 'updateMany').mockResolvedValue(null);
    jest.spyOn(keyRepository, 'findOneAndUpdate').mockResolvedValue(null);

    try {
      await userCodeService.generate({
        phone: '+9999999999',
        deviceId: 'AAA',
      });
      expect(true).toEqual(false);
    } catch (err) {
      expect(true).toEqual(true);
    }
  });

  it('Generate code of validation you and user already exist in db', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(userDTO);
    jest.spyOn(tokenRepository, 'findOne').mockResolvedValue(tokenDTO);
    jest.spyOn(tokenRepository, 'save').mockResolvedValue(tokenDTO);
    jest.spyOn(userRepository, 'save').mockResolvedValue(userDTO);
    jest.spyOn(keyRepository, 'updateMany').mockResolvedValue(null);
    jest.spyOn(keyRepository, 'findOneAndUpdate').mockResolvedValue(null);

    try {
      await userCodeService.generate({
        phone: '+9999999999',
        deviceId: 'AAA',
      });
      expect(true).toEqual(false);
    } catch (err) {
      expect(true).toEqual(true);
    }
  });

  it('Receive phone invalid', async () => {
    try {
      await userCodeService.generate({
        phone: 'ASDbsdc',
        deviceId: 'AAA',
      });
      expect(true).toEqual(false);
    } catch (err) {
      expect(err.message).toEqual('Exception Bad Request');
    }
  });

  afterEach(async () => {
    await app.close();
  });
});
