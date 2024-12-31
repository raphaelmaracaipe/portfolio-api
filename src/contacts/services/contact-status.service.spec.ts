import { Test, TestingModule } from '@nestjs/testing';
import { ContactStatusService } from './contact-status.service';
import * as NodeCache from 'node-cache';

describe('ContactStatusService', () => {
  let service: ContactStatusService;
  let cache: NodeCache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactStatusService],
    }).compile();

    service = module.get<ContactStatusService>(ContactStatusService);
    cache = new NodeCache();
    (service as any).cache = cache; // Injeta o NodeCache mockado
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set status in cache', () => {
    const phone = '123456789';
    const setSpy = jest.spyOn(cache, 'set');
    const logSpy = jest.spyOn(service['logger'], 'log');

    service.setStatus(phone);

    expect(setSpy).toHaveBeenCalledWith(phone, true);
    expect(logSpy).toHaveBeenCalledWith(`set status in cache ${phone}`);
  });

  it('should return true if phone is online', async () => {
    const phone = '123456789';
    jest.spyOn(cache, 'get').mockReturnValue(true);
    const logSpy = jest.spyOn(service['logger'], 'log');

    const result = await service.isOnline(phone);

    expect(result).toBe(true);
    expect(logSpy).toHaveBeenCalledWith(`get status in cache ${phone} -> true`);
  });

  it('should return false if phone is offline', async () => {
    const phone = '123456789';
    jest.spyOn(cache, 'get').mockReturnValue(undefined);
    const logSpy = jest.spyOn(service['logger'], 'log');

    const result = await service.isOnline(phone);

    expect(result).toBe(false);
    expect(logSpy).toHaveBeenCalledWith(
      `get status in cache ${phone} -> false`,
    );
  });
});
