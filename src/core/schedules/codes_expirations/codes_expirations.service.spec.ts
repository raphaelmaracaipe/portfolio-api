import { INestApplication } from '@nestjs/common';
import { CodesExpirationsService } from './codes_expirations.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Codes } from '../../../core/codes/codes';
import { MongoRepository } from 'typeorm';
import { Token } from '../../../core/models/token.model';

describe('CodesExpirationsService', () => {
  let app: INestApplication;
  let codesExpirationsService: CodesExpirationsService;
  let tokenRepository: MongoRepository<Token>;
  const timeToValidationCode = 30;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'TokenRepository',
          useClass: MongoRepository,
        },
        CodesExpirationsService,
        Codes,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    codesExpirationsService = await moduleRef.resolve(CodesExpirationsService);
    tokenRepository = moduleRef.get<MongoRepository<Token>>('TokenRepository');
  });

  it('when not exist data abount token in db', async () => {
    jest.spyOn(tokenRepository, 'find').mockResolvedValue([]);
    try {
      await codesExpirationsService.valid();
      expect(true).toEqual(true);
    } catch (e) {
      expect(false).toEqual(true);
    }
  });

  it('when exist but are in time', async () => {
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() + timeToValidationCode);

    jest
      .spyOn(tokenRepository, 'find')
      .mockResolvedValue([
        { idUser: '1', token: 1, timeValidUntilOfCode: timestamp.getTime() },
      ]);
    try {
      await codesExpirationsService.valid();
      expect(true).toEqual(true);
    } catch (e) {
      expect(false).toEqual(true);
    }
  });

  it('when exist but with time expired', async () => {
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - timeToValidationCode);

    jest
      .spyOn(tokenRepository, 'find')
      .mockResolvedValue([
        { idUser: '1', token: 1, timeValidUntilOfCode: timestamp.getTime() },
      ]);
    jest.spyOn(tokenRepository, 'delete').mockResolvedValue(null);

    try {
      await codesExpirationsService.valid();
      expect(true).toEqual(true);
    } catch (e) {
      expect(false).toEqual(true);
    }
  });

  afterEach(() => {
    app.close();
  });
});
