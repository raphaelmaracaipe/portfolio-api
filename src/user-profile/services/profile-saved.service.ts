import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../core/models/user.model";
import { MongoRepository } from "typeorm";

@Injectable()
export class ProfileSavedService {

  private logger = new Logger(ProfileSavedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) { }

  async getProfile(deviceId: String): Promise<{ name: String, photo: String, reminder: String }> {
    this.logger.debug("Get profile saved in server")
    const { name, photo, reminder } = await this.userRepository.findOne({ where: { deviceId } })
    return { name, photo, reminder }
  }

}