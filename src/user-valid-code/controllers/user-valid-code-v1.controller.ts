import { Controller, Get, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidCodeService } from '../services/valid-code.service';
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
export class UserValidCodeV1Controller {
  constructor(
    private readonly validCodeService: ValidCodeService,
    private responseEncrypted: ResponseEncrypted,
  ) {}

  @Get('valid')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Your request want reject.',
  })
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
