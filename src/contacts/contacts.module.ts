import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsV1Controller } from "./controllers/contacts-v1.controller";
import { User } from "../core/models/user.model";
import { ContactConsultService } from "./services/contact-consult.service";
import { ResponseEncrypted } from "src/core/response/response.encrypted";
import { Key } from "src/core/models/key.model";
import { LbCryptoModule } from "@app/lb-crypto";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Key]),
    LbCryptoModule
  ],
  providers: [
    ContactConsultService,
    ResponseEncrypted
  ],
  controllers: [
    ContactsV1Controller
  ]
})
export class ContactsModule { }