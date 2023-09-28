import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Key } from './core/models/key.model';
import { HandShakeModule } from './hand-shake/hand-shake.module';
import { UserValidCodeModule } from './user-valid-code/user-valid-code.module';
import { UserSendCodeModule } from './user-send-code/user-send-code.module';
import { CoreModule } from './core/core.module';
import { AuthService } from './core/auth/auth.service';
import { AuthMiddleware } from './core/middleware/auth/auth.middleware';
import { DecryptedMiddleware } from './core/middleware/decrypted/decrypted.middleware';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { Codes } from './core/codes/codes';
import { RegexService } from './core/regex/regex.service';
import { DecryptedService } from './core/middleware/decrypted/decrypted.service';
import { LbCryptoService } from '@app/lb-crypto';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `envs/.${process.env.NODE_ENV}.env`,
      load: [config],
    }),
    TypeOrmModule.forFeature([Key]),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.URL_CONNECTION_DB,
      ssl: true,
      synchronize: true,
      autoLoadEntities: true,
      useUnifiedTopology: true,
    }),
    CoreModule,
    HandShakeModule,
    UserValidCodeModule,
    UserSendCodeModule,
  ],
  providers: [
    AuthService,
    Codes,
    DecryptedService,
    LbCryptoService,
    RegexService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('');
    consumer.apply(DecryptedMiddleware).forRoutes('');
  }
}
