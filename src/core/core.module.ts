import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { ApiKeyStrategy } from './auth/apiKey.strategy';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Key } from './models/key.model';
import { Token } from './models/token.model';
import { DecryptedService } from './middleware/decrypted/decrypted.service';
import { Codes } from './codes/codes';
import { LbCryptoService } from '@app/lb-crypto';
import { RegexService } from './regex/regex.service';
import { ApiKey } from './models/apiKey.model';
import { CleanKeySchedule } from './schedules/clean_keys/clean_keys.schedule';
import { CleanKeyService } from './schedules/clean_keys/clean_keys.service';
import { CodesExpirationsSchedule } from './schedules/codes_expirations/codes_expirations.schedule';
import { CodesExpirationsService } from './schedules/codes_expirations/codes_expirations.service';
import { User } from './models/user.model';

@Module({
  imports: [
    PassportModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Key, 
      Token,
      ApiKey,
      User
    ]),
  ],
  providers: [
    AuthService,
    ApiKeyStrategy,
    DecryptedService,
    Codes,
    LbCryptoService,
    RegexService,
    CleanKeySchedule,
    CleanKeyService,
    CodesExpirationsSchedule,
    CodesExpirationsService
  ],
})
export class CoreModule {}
