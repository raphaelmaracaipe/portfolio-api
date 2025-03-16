import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { apiKeyTypeList } from './auth.enum';
import { ApiKey } from '../models/apiKey.model';
import { RegexService } from '../regex/regex.service';
import { REGEX_API_KEY } from '../regex/regex.parttern';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeysRepository: MongoRepository<ApiKey>,
    private readonly regex: RegexService
  ) { }

  async validateApiKey(apikeyHeader: any): Promise<string> {
    const apiKeys = await this.checkIfExistsTokensRegistered();
    const apikeyFound: ApiKey = apiKeys.find((apikey) => apikey.apiKey == String(apikeyHeader))
    if(apikeyFound) {
      return apikeyFound.apiKey
    }
    return '';
  }

  private async checkIfExistsTokensRegistered(): Promise<ApiKey[]> {
    if (await this.apiKeysRepository.count() == 0) {
      return await this.createApiKeysAndSaveInDB()
    } else {
      return await this.apiKeysRepository.find({ cache: 6000 })
    }
  }

  private async createApiKeysAndSaveInDB(): Promise<ApiKey[]> {
    const listOfApiKeysToSave: ApiKey[] = [];

    apiKeyTypeList.forEach(typeOfApikey => {
      listOfApiKeysToSave.push({
        apiKey: this.regex.generateRandom(REGEX_API_KEY),
        type: typeOfApikey
      })
    })

    await this.apiKeysRepository.save(listOfApiKeysToSave)
    return listOfApiKeysToSave;
  }

}