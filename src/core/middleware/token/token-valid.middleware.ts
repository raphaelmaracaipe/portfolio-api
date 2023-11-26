import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response, Request } from 'express';
import { TokenValidService } from "./token-valid.service";
import { Codes } from "src/core/codes/codes";

@Injectable()
export class TokenValidMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenValidService: TokenValidService,
    private readonly codes: Codes
  ) { }

  async use(req: Request, res: Response, next: (error?: any) => void) {
    const { authorization, device_id } = req.headers

    const authorizationCleaned = authorization.replace("Bearer ", "")
    await this.tokenValidService.valid(authorizationCleaned, device_id.toString())

    next()
  }
}