import { INestApplication } from '@nestjs/common';
import { HandShakeService } from './hand-shake.service';
import { MongoRepository } from 'typeorm';
import { Key } from 'readline';
import { Test, TestingModule } from '@nestjs/testing';
import { Codes } from '../../core/codes/codes';
import { RegexService } from '../../core/regex/regex.service';
import { REGEX_DEVICE_ID, REGEX_KEY } from '../../core/regex/regex';

describe('HandShakeService', () => {
  let app: INestApplication;
  let handShakeService: HandShakeService;
  let keyRepository: MongoRepository<Key>;
  const regexService: RegexService = new RegexService();

  beforeEach(async () => {
    const modularRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'KeyRepository',
          useClass: MongoRepository,
        },
        HandShakeService,
        Codes,
        RegexService,
      ],
    }).compile();

    app = modularRef.createNestApplication();
    await app.init();

    handShakeService = await modularRef.resolve(HandShakeService);
    keyRepository = modularRef.get<MongoRepository<Key>>('KeyRepository');
  });

  it('when send data to save and not exist saved in db should return success', async () => {
    try {
      jest.spyOn(keyRepository, 'count').mockResolvedValue(0);
      jest.spyOn(keyRepository, 'save').mockImplementation(null);

      const deviceID = regexService.generateRandom(REGEX_DEVICE_ID);
      const key = regexService.generateRandom(REGEX_KEY);

      await handShakeService.saveValue(key, deviceID);
    } catch (e) {
      expect(true).toEqual(false);
    }
  });

  it('when send data to save and exist saved in db should return success', async () => {
    try {
      jest.spyOn(keyRepository, 'count').mockResolvedValue(1);

      const deviceID = regexService.generateRandom(REGEX_DEVICE_ID);
      const key = regexService.generateRandom(REGEX_KEY);

      await handShakeService.saveValue(key, deviceID);
    } catch (e) {
      expect(true).toEqual(false);
    }
  });

  afterEach(async () => {
    await app.close();
  });
});
