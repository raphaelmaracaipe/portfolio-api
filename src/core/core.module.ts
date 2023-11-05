import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { ApiKeyStrategy } from './auth/apiKey.strategy';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Key } from './models/key.model';
import { Token } from './models/token.model';
import { CleanKeySchedule } from './schedules/clean_keys/clean_keys.schedule';
import { CleanKeyService } from './schedules/clean_keys/clean_keys.service';
import { CodesExpirationsSchedule } from './schedules/codes_expirations/codes_expirations.schedule';
import { CodesExpirationsService } from './schedules/codes_expirations/codes_expirations.service';
import { DecryptedService } from './middleware/decrypted/decrypted.service';
import { Codes } from './codes/codes';
import { LbCryptoService } from '@app/lb-crypto';
import { RegexService } from './regex/regex.service';

@Module({
  imports: [
    PassportModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Key, Token]),
  ],
  providers: [
    AuthService,
    ApiKeyStrategy,
    DecryptedService,
    Codes,
    LbCryptoService,
    RegexService,
  ],
})
export class CoreModule {}
