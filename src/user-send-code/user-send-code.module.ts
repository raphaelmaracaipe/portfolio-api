import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSendCodeV1Controller } from './controllers/user-send-code-v1.controller';
import { UserCodeService } from './services/user-code-service.service';
import { ResponseEncrypted } from '../core/response/response.encrypted';
import { LbCryptoModule } from '@app/lb-crypto';
import { Codes } from '../core/codes/codes';
import { Key } from '../core/models/key.model';
import { Token } from '../core/models/token.model';
import { User } from '../core/models/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([Token, User, Key]), LbCryptoModule],
  providers: [UserCodeService, Codes, ResponseEncrypted],
  controllers: [UserSendCodeV1Controller],
})
export class UserSendCodeModule {}
