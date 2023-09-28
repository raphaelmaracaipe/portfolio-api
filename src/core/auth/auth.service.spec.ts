import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import config from '../../config/config';

describe('AuthService', () => {
  let authService: AuthService;

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
      providers: [AuthService, ConfigService],
    }).compile();

    authService = await moduleRef.resolve(AuthService);
  });

  it('When send key invalid', () => {
    const validationKey = authService.validateApiKey('a');
    expect(validationKey).toEqual(undefined);
  });

  it('When send key valid', () => {
    const apiKey = 'aaaa';
    const validationKey = authService.validateApiKey(apiKey);
    expect(validationKey).toEqual(apiKey);
  });
});
