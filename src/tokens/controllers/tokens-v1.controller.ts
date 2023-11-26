import { Body, Controller, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { Response, Request } from 'express';
import { Token } from "../models/token.interface";
import { TokensServices } from "../../tokens/services/tokens.service";
import { ResponseEncrypted } from "../../core/response/response.encrypted";

@Controller('v1/tokens')
export class TokenV1Controller {

  constructor(
    private readonly tokensServices: TokensServices,
    private readonly responseEncrypted: ResponseEncrypted,
  ) { }

  @Post('refresh')
  async refresh(
    @Body() token: Token,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const { device_id } = req.headers

    const tokens = await this.tokensServices.valid(device_id.toString(), token)
    return this.responseEncrypted.encrypted({
      data: tokens,
      httpStatus: HttpStatus.CREATED,
      request: req,
      response: res,
    });
  }

}