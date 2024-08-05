import { Module } from "@nestjs/common";
import { UserProfileV1Controller } from "./controllers/user-profile-v1.controller";
import { ProfileService } from "./services/profie.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/core/models/user.model";
import { Codes } from "src/core/codes/codes";
import { ResponseEncrypted } from "src/core/response/response.encrypted";
import { Key } from "src/core/models/key.model";
import { LbCryptoModule } from "@app/lb-crypto";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Key
    ]),
    LbCryptoModule
  ],
  controllers: [
    UserProfileV1Controller
  ],
  providers: [
    ProfileService,
    Codes,
    ResponseEncrypted
  ]
})
export class UserProfileModule { }