import { Body, Controller, HttpStatus, Logger, Post, Req, Res } from '@nestjs/common';
import { Code } from '../models/code.interface';
import { Response, Request } from 'express';
import { HandShakeService } from '../services/hand-shake.service';
import { ResponseEncrypted } from '../../core/response/response.encrypted';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../config/configuration';

@Controller('v1/handshake')
export class HandShakeV1Controller {
  private key = this.configService.get('KEY_DEFAULT');
  private iv = this.configService.get('IV_DEFAULT');
  private logger = new Logger(HandShakeV1Controller.name);

  constructor(
    private readonly handShakeService: HandShakeService,
    private readonly responseEncrypted: ResponseEncrypted,
    private readonly configService: ConfigService<Configuration>,
  ) { }

  @Post('')
  async create(
    @Body() codeBody: Code,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.log("Call endpoint: (POST) v1/handshake");
    const { device_id } = req.headers;
    const { key } = codeBody;

    await this.handShakeService.saveValue(key, device_id.toString());
    return await this.responseEncrypted.encrypted({
      request: req,
      response: res,
      httpStatus: HttpStatus.OK,
      iv: this.iv,
      key: this.key,
    });
  }
}
