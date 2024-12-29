import { Injectable, Logger } from '@nestjs/common';
import * as NodeCache from 'node-cache';

@Injectable()
export class ContactStatusService {
  
  private readonly logger = new Logger(ContactStatusService.name);
  private readonly cache = new NodeCache({ stdTTL: (30 * 60) });
  
  async setStatus(phone: string) {
    this.logger.log(`set status in cache ${phone}`);
    await this.cache.set(phone, true)
  }

  async isOnline(phone: string): Promise<boolean> {
    let saved = (await this.cache.get(phone) ? true: false)
    this.logger.log(`get status in cache ${phone} -> ${saved}`);
    return saved
  }
}
