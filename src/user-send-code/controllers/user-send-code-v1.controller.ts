import { Controller, Post, Res, HttpStatus, Body, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { User as UserInterface } from '../models/user.interface';
import { UserCodeService } from '../services/user-code-service.service';
import { ResponseEncrypted } from '../../core/response/response.encrypted';

@Controller('v1/users')
export class UserSendCodeV1Controller {
  constructor(
    private userCodeService: UserCodeService,
    private responseEncrypted: ResponseEncrypted,
  ) {}

  @Post('code')
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
