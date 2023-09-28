import { Module } from '@nestjs/common';
import { UserValidCodeV1Controller } from './controllers/user-valid-code-v1.controller';
import { ValidCodeService } from './services/valid-code.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Codes } from '../core/codes/codes';
import { ResponseEncrypted } from '../core/response/response.encrypted';
import { LbBase64Module } from '@app/lb-base64';
import { LbJwtModule } from '@app/lb-jwt';
import { LbKeysModule } from '@app/lb-keys';
import { LbCryptoModule } from '@app/lb-crypto';
import { User } from '../core/models/user.model';
import { Key } from '../core/models/key.model';
import { Token } from '../core/models/token.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Key, Token]),
    LbBase64Module,
    LbJwtModule,
    LbKeysModule,
    LbCryptoModule,
  ],
  providers: [ValidCodeService, Codes, ResponseEncrypted],
  controllers: [UserValidCodeV1Controller],
})
export class UserValidCodeModule {}
