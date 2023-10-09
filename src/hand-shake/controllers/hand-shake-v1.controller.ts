import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Code } from '../models/code.interface';
import { Response, Request } from 'express';
import { HandShakeService } from '../services/hand-shake.service';
import { ResponseEncrypted } from '../../core/response/response.encrypted';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../config/configuration';

@ApiHeader({
  name: 'x-api-key',
  allowEmptyValue: false,
  description: 'Api key',
})
@ApiHeader({
  name: 'dev',
  required: true,
  allowEmptyValue: false,
  description: 'Disable encrypted body',
})
@ApiHeader({
  name: 'device_id',
  required: true,
  allowEmptyValue: false,
  description: 'Device Id generate in device',
})
@ApiTags('HandShake')
@Controller('v1/handshake')
export class HandShakeV1Controller {
  private key = this.configService.get('KEY_DEFAULT');
  private iv = this.configService.get('IV_DEFAULT');

  constructor(
    private readonly handShakeService: HandShakeService,
    private readonly responseEncrypted: ResponseEncrypted,
    private readonly configService: ConfigService<Configuration>,
  ) { }

  @Post('')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Your request was reject.',
  })
  async create(
    @Body() codeBody: Code,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
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
