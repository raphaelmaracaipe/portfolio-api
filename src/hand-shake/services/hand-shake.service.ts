import { ForbiddenException, HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Key } from '../../core/models/key.model';
import { Codes } from '../../core/codes/codes';
import { ExceptionBadRequest } from '../../core/exeptions/exceptionBadRequest';
import { MongoRepository } from 'typeorm';
import { RegexService } from '../../core/regex/regex.service';
import { REGEX_KEY } from '../../core/regex/regex.parttern';

@Injectable()
export class HandShakeService {
  private logger = new Logger(HandShakeService.name);

  constructor(
    @InjectRepository(Key)
    private readonly keyRepository: MongoRepository<Key>,
    private readonly regexService: RegexService,
    private readonly codes: Codes,
  ) { }

  async saveValue(key: string, deviceId: string) {
    await this.checkIfYourKeyIsValid(key);
    try {
      if ((await this.keyRepository.count({ deviceId })) == 0) {
        this.logger.log('Not exist key saved')
        await this.keyRepository.save({
          key,
          deviceId,
          createdAt: Date.now(),
        });
      }
    } catch (err) {
      this.logger.error(err);
      throw new ExceptionBadRequest(this.codes.ERROR_GENERAL);
    }
  }

  private async checkIfYourKeyIsValid(key: string) {
    if (!(await this.regexService.check(REGEX_KEY, key))) {
      this.logger.log('key invalid with base on the regex.');
      throw new ExceptionBadRequest(this.codes.USER_KEY_INVALID);
    }
  }
}
