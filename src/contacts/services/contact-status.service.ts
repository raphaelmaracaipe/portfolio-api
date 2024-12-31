import { Injectable, Logger } from '@nestjs/common';
import * as NodeCache from 'node-cache';

@Injectable()
export class ContactStatusService {
  private readonly logger = new Logger(ContactStatusService.name);
  private readonly cache = new NodeCache({ stdTTL: 30 * 60 });

  setStatus(phone: string): void {
    this.logger.log(`set status in cache ${phone}`);
    this.cache.set(phone, true);
  }

  async isOnline(phone: string): Promise<boolean> {
    const saved = this.cache.get<boolean>(phone) ?? false;
    this.logger.log(`get status in cache ${phone} -> ${saved}`);
    return saved;
  }
}