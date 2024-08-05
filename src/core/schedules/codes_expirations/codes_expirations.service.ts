import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../../../core/models/token.model';
import { MongoRepository } from 'typeorm';

@Injectable()
export class CodesExpirationsService {

  private logger = new Logger(CodesExpirationsService.name);

  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: MongoRepository<Token>,
  ) { }

  async valid() {
    this.logger.log("start checking for expired tokens");
    const tokens = await this.tokenRepository.find();
    if (tokens.length === 0) {
      this.logger.log('nothing now');
    }

    const dateNow = new Date().getTime();
    this.logger.log(`dateNow: ${dateNow}`)
    this.logger.log(`total tokens to check: ${tokens.length}`);

    tokens.map(async (token) => {
      const { timeValidUntilOfCode, id } = token;
      if (timeValidUntilOfCode < dateNow) {
        this.logger.log(`token will go remove: ${token.id}`);
        await this.tokenRepository.delete({ id });
      }
    });
  }
}
