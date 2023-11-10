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

@Module({
  imports: [
    PassportModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Key, 
      Token,
      ApiKey
    ]),
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
