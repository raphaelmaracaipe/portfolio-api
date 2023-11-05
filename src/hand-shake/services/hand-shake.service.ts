import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Key } from '../../core/models/key.model';
import { Codes } from '../../core/codes/codes';
import { ExceptionBadRequest } from '../../core/exeptions/exceptionBadRequest';
import { MongoRepository } from 'typeorm';
import { RegexService } from '../../core/regex/regex.service';
import { REGEX_KEY } from '../../core/regex/regex';

@Injectable()
export class HandShakeService {
  constructor(
    @InjectRepository(Key)
    private readonly keyRepository: MongoRepository<Key>,
    private readonly regexService: RegexService,
    private readonly codes: Codes,
  ) {}

  async saveValue(key: string, deviceId: string) {
    await this.checkIfYourKeyIsValid(key);
    try {
      if ((await this.keyRepository.count({ deviceId })) == 0) {
        await this.keyRepository.save({
          key,
          deviceId,
          createdAt: Date.now(),
        });
      }
    } catch (err) {
      throw new ExceptionBadRequest(this.codes.ERROR_GENERAL);
    }
  }

  private async checkIfYourKeyIsValid(key: string) {
    if (!(await this.regexService.check(REGEX_KEY, key))) {
      throw new ExceptionBadRequest(this.codes.USER_KEY_INVALID);
    }
  }
}
