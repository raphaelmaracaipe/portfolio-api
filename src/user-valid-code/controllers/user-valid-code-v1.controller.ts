import { Controller, Get, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { ValidCodeService } from '../services/valid-code.service';
import { ResponseEncrypted } from '../../core/response/response.encrypted';

@Controller('v1/users')
export class UserValidCodeV1Controller {
  constructor(
    private readonly validCodeService: ValidCodeService,
    private responseEncrypted: ResponseEncrypted,
  ) {}

  @Get('valid')
  async valid(
    @Query('code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const tokens = await this.validCodeService.valid(parseInt(code));

    return this.responseEncrypted.encrypted({
      data: tokens,
      httpStatus: HttpStatus.CREATED,
      request: req,
      response: res,
    });
  }
}
