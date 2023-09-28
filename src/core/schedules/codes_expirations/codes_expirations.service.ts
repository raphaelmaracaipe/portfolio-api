import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../../../core/models/token.model';
import { MongoRepository } from 'typeorm';

@Injectable()
export class CodesExpirationsService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: MongoRepository<Token>,
  ) {}

  async valid() {
    const tokens = await this.tokenRepository.find();
    if (tokens.length === 0) {
      console.log('nothing now');
    }

    const dateNow = new Date().getTime();
    tokens.map(async (token) => {
      const { timeValidUntilOfCode, id } = token;
      if (timeValidUntilOfCode < dateNow) {
        await this.tokenRepository.delete({ id });
      }
    });
  }
}
