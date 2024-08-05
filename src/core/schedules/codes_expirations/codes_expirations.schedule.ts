import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CodesExpirationsService } from './codes_expirations.service';

@Injectable()
export class CodesExpirationsSchedule {
  constructor(private readonly codesServices: CodesExpirationsService) {}

  @Cron('10 * * * * *')
  async handleCron() {
    await this.codesServices.valid();
  }
}
