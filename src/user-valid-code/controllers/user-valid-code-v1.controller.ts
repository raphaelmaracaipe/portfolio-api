import { Controller, Get, HttpStatus, Logger, Query, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { ValidCodeService } from '../services/valid-code.service';
import { ResponseEncrypted } from '../../core/response/response.encrypted';

@Controller('v1/users')
export class UserValidCodeV1Controller {

  private logger = new Logger(UserValidCodeV1Controller.name);

  constructor(
    private readonly validCodeService: ValidCodeService,
    private responseEncrypted: ResponseEncrypted,
  ) { }

  @Get('valid')
  async valid(
    @Query('code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.log("Call endpoint: (GET) v1/users/valid");

    const { device_id } = req.headers;
    const tokens = await this.validCodeService.valid(parseInt(code), device_id.toString());

    return this.responseEncrypted.encrypted({
      data: tokens,
      httpStatus: HttpStatus.CREATED,
      request: req,
      response: res,
    });
  }
}
