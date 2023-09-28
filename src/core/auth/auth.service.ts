import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/configuration';

@Injectable()
export class AuthService {
  private apiKeys: string = this.configService.get('API_KEYS');

  constructor(private readonly configService: ConfigService<Configuration>) {}

  validateApiKey(apikey: any): string {
    return this.apiKeys.split(';').find((apiK) => apikey === apiK);
  }
}
