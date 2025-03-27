import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from './auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(private authService: AuthService) {
    super({ header: 'x-api-key', prefix: '' }, true, async (apikey, done) => {
      const checkKey = await this.authService.validateApiKey(apikey);
      if (!checkKey) {
        return done(false);
      }
      return done(true);
    });
  }
}