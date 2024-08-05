import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import config from '../../config/config';
import { MongoRepository } from 'typeorm';
import { RegexService } from '../regex/regex.service';
import { ApiKey } from '../models/apiKey.model';

describe('AuthService', () => {
  let authService: AuthService;
  let apiKeyRepository: MongoRepository<ApiKey>

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
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
          provide: 'ApiKeyRepository',
          useClass: MongoRepository
        },
        AuthService,
        ConfigService,
        RegexService
      ],
    }).compile();

    authService = await moduleRef.resolve(AuthService);
    apiKeyRepository = moduleRef.get<MongoRepository<ApiKey>>('ApiKeyRepository')
  });

  it('when api key not register and send api key invalid', async () => {
    jest.spyOn(apiKeyRepository, 'count').mockResolvedValue(0)
    jest.spyOn(apiKeyRepository, 'save').mockResolvedValue(null)

    const apiKeyValid = await authService.validateApiKey('aaa')
    expect(apiKeyValid).toEqual('')
  })

  it('when api key exist in db and send api key valid', async () => {
    jest.spyOn(apiKeyRepository, 'count').mockResolvedValue(2)
    jest.spyOn(apiKeyRepository, 'find').mockResolvedValue([
      { apiKey: 'aaa', type: '0' },
      { apiKey: 'bbb', type: '1' }
    ])

    const apikeyValid = await authService.validateApiKey('aaa')
    expect(apikeyValid).toEqual('aaa')
  })
});
