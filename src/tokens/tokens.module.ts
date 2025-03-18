import { Module } from "@nestjs/common";
import { TokenV1Controller } from "./controllers/tokens-v1.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/core/models/user.model";
import { LbJwtModule } from "@app/lb-jwt";
import { Codes } from "src/core/codes/codes";
import { LbKeysModule } from "@app/lb-keys";
import { LbBase64Module } from "@app/lb-base64";
import { TokensServices } from "src/tokens/services/tokens.service";
import { LbCryptoModule } from "@app/lb-crypto";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    LbJwtModule,
    LbKeysModule,
    LbBase64Module,
    LbCryptoModule
  ],
  providers: [
    Codes,
    TokensServices
  ],
  controllers: [
    TokenV1Controller
  ]
})
export class TokensModule { }