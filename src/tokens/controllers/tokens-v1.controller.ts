import { Body, Controller, HttpStatus, Logger, Post, Req, Res } from "@nestjs/common";
import { Response, Request } from 'express';
import { Token } from "../models/token.interface";
import { TokensServices } from "../../tokens/services/tokens.service";

@Controller('v1/tokens')
export class TokenV1Controller {

  private logger = new Logger(TokenV1Controller.name)

  constructor(
    private readonly tokensServices: TokensServices
  ) { }

  @Post('refresh')
  async refresh(
    @Body() token: Token,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.log("Call endpoint: (POST) v1/tokens/refresh");
    const { device_id } = req.headers

    const tokens = await this.tokensServices.valid(device_id.toString(), token)
    return res.status(HttpStatus.OK).send(tokens);
  }

}