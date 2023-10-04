import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { MongoRepository } from 'typeorm';
import { LbCryptoService } from '@app/lb-crypto';
import { Key } from '../../../core/models/key.model';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/configuration';
import { Codes } from '../../../core/codes/codes';
import { ExceptionBadRequest } from '../../../core/exeptions/exceptionBadRequest';
import { RegexService } from '../../../core/regex/regex.service';
import { REGEX_DEVICE_ID, REGEX_SEED } from '../../../core/regex/regex';

export class DecryptedService {
  private key = this.configService.get('KEY_DEFAULT');
  private iv = this.configService.get('IV_DEFAULT');

  constructor(
    @InjectRepository(Key)
    private readonly keyRepository: MongoRepository<Key>,
    private readonly codes: Codes,
    private readonly crypto: LbCryptoService,
    private readonly configService: ConfigService<Configuration>,
    private readonly regex: RegexService,
  ) { }

  async start(req: Request, next: (error?: any) => void) {
    const { seed, dev, device_id } = req.headers;
    this.validDeviceId(String(device_id));
    if (dev && dev === 'true') {
      return next();
    }

    const seedDecryptedAndValid = await this.decryptSeedAndValid(seed.toString());
    this.processOfDecryptBody(req, seedDecryptedAndValid, next);
  }

  private validDeviceId(deviceId: string) {
    if (!this.regex.check(REGEX_DEVICE_ID, deviceId)) {
      throw new ExceptionBadRequest(this.codes.DEVICE_ID_INVALID);
    }
  }

  private async decryptSeedAndValid(seed: string): Promise<string> {
    const seedDecrypted = await this.crypto.decryptAES(decodeURIComponent(seed), this.key, this.iv);
    if (!this.regex.check(REGEX_SEED, seedDecrypted)) {
      throw new ExceptionBadRequest(this.codes.SEED_INVALID);
    }
    return seedDecrypted
  }

  private async processOfDecryptBody(
    req: Request,
    seed: string,
    next: (error?: any) => void,
  ) {
    try {
      const { device_id } = req.headers;
      const dataOfBodyEncrypted: { data: any } = req.body;

      let key = this.key;
      const keyRegistered = await this.keyRepository.findOne({
        where: { deviceId: device_id },
      });
      if (keyRegistered) {
        key = keyRegistered.key;
      }

      req.body = JSON.parse(
        this.crypto.decryptAES(dataOfBodyEncrypted.data, key, seed),
      );
      next();
    } catch (e) {
      next(e);
    }
  }
}
