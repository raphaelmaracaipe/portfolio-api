import { Injectable } from "@nestjs/common";
import { Profile } from "../models/profile.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/core/models/user.model";
import { MongoRepository } from "typeorm";
import { ExceptionBadRequest } from "src/core/exeptions/exceptionBadRequest";
import { Codes } from "src/core/codes/codes";

@Injectable()
export class ProfileService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly codes: Codes
  ) { }

  async insert(deviceId: string, profile: Profile) {
    try {
      const { photo, name } = profile
      await this.userRepository.updateOne({
        deviceId
      }, {
        $set: {
          photo,
          name
        }
      })
    } catch (e) {
      throw new ExceptionBadRequest(this.codes.USER_FAIL_TO_INSERT_PROFILE)
    }
  }

}