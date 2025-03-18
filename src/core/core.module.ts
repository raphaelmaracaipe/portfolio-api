import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { ApiKeyStrategy } from './auth/apiKey.strategy';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './models/token.model';
import { Codes } from './codes/codes';
import { LbCryptoService } from '@app/lb-crypto';
import { RegexService } from './regex/regex.service';
import { ApiKey } from './models/apiKey.model';
import { CodesExpirationsSchedule } from './schedules/codes_expirations/codes_expirations.schedule';
import { CodesExpirationsService } from './schedules/codes_expirations/codes_expirations.service';

@Module({
  imports: [
    PassportModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Token,
      ApiKey
    ]),
  ],
  providers: [
    AuthService,
    ApiKeyStrategy,
    Codes,
    LbCryptoService,
    RegexService,
    CodesExpirationsSchedule,
    CodesExpirationsService
  ],
})
export class CoreModule {}
