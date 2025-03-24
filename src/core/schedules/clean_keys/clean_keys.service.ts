import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Key } from '../../../core/models/key.model';
import { MongoRepository } from 'typeorm';
import { User } from '../../../core/models/user.model';

@Injectable()
export class CleanKeyService {
  private logger = new Logger(CleanKeyService.name);

  constructor(
    @InjectRepository(Key)
    private readonly keyRepository: MongoRepository<Key>,
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async clean() {
    const timeNow = new Date();
    timeNow.setHours(timeNow.getHours() - 2);

    this.logger.log(`timeNow: ${timeNow}`);

    const users = await this.userRepository.find({ select: ['_id'] });
    const idsOfUsers = users.map((user) => user.id.toString());

    await this.keyRepository.deleteMany({
      $or: [
        {
          idUser: {
            $nin: idsOfUsers,
          },
        },
        { idUser: { $in: ['', null] } },
      ],
      $and: [{ createdAt: { $lt: timeNow.getTime() } }],
    });
  }
}
