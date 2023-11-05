import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { MongoRepository } from 'typeorm';
import { IResponse } from './iresponse';
import { LbCryptoService } from '@app/lb-crypto';
import { Key } from '../../core/models/key.model';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/configuration';

@Injectable()
export class ResponseEncrypted {
  private key = this.configService.get('KEY_DEFAULT');
  private iv = this.configService.get('IV_DEFAULT');

  constructor(
    @InjectRepository(Key)
    private readonly keyRepository: MongoRepository<Key>,
    private readonly crypto: LbCryptoService,
    private readonly configService: ConfigService<Configuration>,
  ) { }

  async encrypted(iResponse: IResponse): Promise<Response> {
    const { response, httpStatus } = iResponse;
    return response
      .status(httpStatus)
      .send(await this.createBodyEncrypt(iResponse));
  }

  private async createBodyEncrypt(iResponse: IResponse): Promise<any> {
    const { request, data, iv } = iResponse;
    const { dev, seed } = request.headers;

    try {
      if (dev && dev === 'true') {
        return data;
      }


      let dataEncrypted = '{}';

      const seedDecryted = await this.decryptSeed(seed.toString());
      if ((!iv || iv == '') && (!iResponse.key || iResponse.key == '')) {
        const { device_id } = request.headers;
        const { key } = await this.keyRepository.findOne({
          where: { deviceId: device_id.toString() },
        });

        
        dataEncrypted = this.crypto.encryptAES(
          this.checkData(data),
          key,
          seedDecryted,
        );
      } else {
        dataEncrypted = this.crypto.encryptAES(
          this.checkData(data),
          iResponse.key,
          seedDecryted,
        );
      }

      return { data: dataEncrypted.toString() };
    } catch (e) {
      return data;
    }
  }

  private decryptSeed(seed: string): string {
    return this.crypto.decryptAES(decodeURIComponent(seed), this.key, this.iv);
  }

  private checkData(data?: any): any {
    if (!data) {
      return '{}';
    } else if (typeof data == 'object') {
      return JSON.stringify(data);
    } else {
      return data.toString();
    }
  }
}
