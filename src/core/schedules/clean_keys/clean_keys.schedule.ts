import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CleanKeyService } from './clean_keys.service';

@Injectable()
export class CleanKeySchedule {
  constructor(private readonly cleanKeyService: CleanKeyService) {}

  @Cron('* * 2 * * *')
  async handleCron() {
    await this.cleanKeyService.clean();
  }
}
