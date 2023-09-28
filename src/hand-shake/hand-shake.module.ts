import { Module } from '@nestjs/common';
import { HandShakeV1Controller } from './controllers/hand-shake-v1.controller';
import { HandShakeService } from './services/hand-shake.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Codes } from '../core/codes/codes';
import { ResponseEncrypted } from '../core/response/response.encrypted';
import { LbCryptoModule } from '@app/lb-crypto';
import { Key } from '../core/models/key.model';
import { RegexService } from '../core/regex/regex.service';

@Module({
  imports: [TypeOrmModule.forFeature([Key]), LbCryptoModule],
  controllers: [HandShakeV1Controller],
  providers: [HandShakeService, Codes, ResponseEncrypted, RegexService],
})
export class HandShakeModule {}
