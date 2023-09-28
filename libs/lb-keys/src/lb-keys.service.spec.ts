import { Test, TestingModule } from '@nestjs/testing';
import { LbKeysService } from './lb-keys.service';

describe('LbKeysService', () => {
  let service: LbKeysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LbKeysService],
    }).compile();

    service = module.get<LbKeysService>(LbKeysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
