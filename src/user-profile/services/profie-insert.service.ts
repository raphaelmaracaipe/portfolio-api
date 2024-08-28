import { Injectable, Logger } from "@nestjs/common";
import { Profile } from "../models/profile.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../core/models/user.model";
import { MongoRepository } from "typeorm";
import { ExceptionBadRequest } from "../../core/exeptions/exceptionBadRequest";
import { Codes } from "../../core/codes/codes";

@Injectable()
export class ProfileInsertService {

  private logger = new Logger(ProfileInsertService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly codes: Codes
  ) { }

  async insert(deviceId: string, profile: Profile) {
    try {
      const { photo, name } = profile
      this.logger.log('Received data of profiles');
      await this.userRepository.updateOne({
        deviceId
      }, {
        $set: {
          photo,
          name
        }
      })
    } catch (e) {
      this.logger.error(e);
      throw new ExceptionBadRequest(this.codes.USER_FAIL_TO_INSERT_PROFILE)
    }
  }

}