import { INestApplication } from '@nestjs/common';
import { CleanKeyService } from './clean_keys.service';
import { MongoRepository } from 'typeorm';
import { Key } from '../../../core/models/key.model';
import { Test, TestingModule } from '@nestjs/testing';

describe('CleanKeyService', () => {
  let app: INestApplication;
  let cleanKeyService: CleanKeyService;
  let keyRepository: MongoRepository<Key>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'KeyRepository',
          useClass: MongoRepository,
        },
        CleanKeyService,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    cleanKeyService = await moduleRef.resolve(CleanKeyService);
    keyRepository = moduleRef.get<MongoRepository<Key>>('KeyRepository');
  });

  it('when call service to clean collection of keys', async () => {
    jest.spyOn(keyRepository, 'deleteMany').mockResolvedValueOnce(null);
    await cleanKeyService.clean();
  });

  afterEach(() => {
    app.close();
  });
});
