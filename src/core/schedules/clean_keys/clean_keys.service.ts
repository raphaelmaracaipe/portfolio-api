import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Key } from '../../../core/models/key.model';
import { MongoRepository } from 'typeorm';

@Injectable()
export class CleanKeyService {
  constructor(
    @InjectRepository(Key)
    private readonly keyRepository: MongoRepository<Key>,
  ) {}

  async clean() {
    const timeNow = new Date();
    timeNow.setHours(timeNow.getHours() - 2);

    await this.keyRepository.deleteMany({
      $and: [
        {
          idUser: { $in: ['', null] },
        },
        {
          createdAt: { $lt: timeNow.getTime() },
        },
      ],
    });
  }
}
