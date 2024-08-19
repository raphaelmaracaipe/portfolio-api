import { Module } from "@nestjs/common";
import { UserProfileV1Controller } from "./controllers/user-profile-v1.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/core/models/user.model";
import { Codes } from "src/core/codes/codes";
import { ResponseEncrypted } from "src/core/response/response.encrypted";
import { Key } from "src/core/models/key.model";
import { LbCryptoModule } from "@app/lb-crypto";
import { ProfileInsertService } from "./services/profie-insert.service";
import { ProfileSavedService } from "./services/profile-saved.service";

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
    ProfileInsertService,
    ProfileSavedService,
    Codes,
    ResponseEncrypted
  ]
})
export class UserProfileModule { }