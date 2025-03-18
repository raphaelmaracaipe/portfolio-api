import { Module } from "@nestjs/common";
import { UserProfileV1Controller } from "./controllers/user-profile-v1.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/core/models/user.model";
import { Codes } from "src/core/codes/codes";
import { LbCryptoModule } from "@app/lb-crypto";
import { ProfileInsertService } from "./services/profie-insert.service";
import { ProfileSavedService } from "./services/profile-saved.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
    LbCryptoModule
  ],
  controllers: [
    UserProfileV1Controller
  ],
  providers: [
    ProfileInsertService,
    ProfileSavedService,
    Codes
  ]
})
export class UserProfileModule { }