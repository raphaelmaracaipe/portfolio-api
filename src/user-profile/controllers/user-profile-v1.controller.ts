import { Body, Controller, HttpStatus, Logger, Post, Req, Res } from "@nestjs/common";
import { Response, Request } from 'express';
import { Profile } from "../models/profile.interface";
import { ProfileService } from "../services/profie.service";
import { ResponseEncrypted } from "../../core/response/response.encrypted";

@Controller('v1/users')
export class UserProfileV1Controller {

  private logger = new Logger(UserProfileV1Controller.name);

  constructor(
    private readonly profileService: ProfileService,
    private readonly responseEncrypted: ResponseEncrypted
  ) { }

  @Post('profile')
  async register(
    @Body() profile: Profile,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.log("Call endpoint: (POST) v1/users/profile");
    const { device_id } = req.headers
    await this.profileService.insert(device_id.toString(), profile)

    return await this.responseEncrypted.encrypted({
      request: req,
      response: res,
      httpStatus: HttpStatus.OK
    });
  }

}