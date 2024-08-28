import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../core/models/user.model";
import { MongoRepository } from "typeorm";

@Injectable()
export class ContactConsultService {
  private logger = new Logger(ContactConsultService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) { }

  async consult(
    contacts: string[]
  ): Promise<{name: string, photo: string, phone: string}[]> {
    this.logger.verbose('start consult of contacts send');
    const usersOfDB = await this.userRepository.find({ where: { phone: { $in: contacts } } })
    return usersOfDB.map(profile => ({
      name: profile.name,
      photo: profile.photo,
      phone: profile.phone
    }));
  }

}