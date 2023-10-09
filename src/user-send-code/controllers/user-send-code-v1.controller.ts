import { Controller, Post, Res, HttpStatus, Body, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { User as UserInterface } from '../models/user.interface';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserCodeService } from '../services/user-code-service.service';
import { ResponseEncrypted } from '../../core/response/response.encrypted';

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
@ApiTags('Users')
@Controller('v1/users')
export class UserSendCodeV1Controller {
  constructor(
    private userCodeService: UserCodeService,
    private responseEncrypted: ResponseEncrypted,
  ) {}

  @Post('code')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Your request was reject.',
  })
  async create(
    @Body() userReceived: UserInterface,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const { phone } = userReceived;
    const { device_id } = req.headers;

    await this.userCodeService.generate({
      phone: phone.replace(/\D/g, ''),
      deviceId: device_id.toString(),
    });

    return this.responseEncrypted.encrypted({
      httpStatus: HttpStatus.OK,
      request: req,
      response: res,
    });
  }
}
