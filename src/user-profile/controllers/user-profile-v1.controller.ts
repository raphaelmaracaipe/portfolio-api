import { Body, Controller, Get, HttpStatus, Logger, Post, Req, Res } from "@nestjs/common";
import { Response, Request } from 'express';
import { Profile } from "../models/profile.interface";
import { ResponseEncrypted } from "../../core/response/response.encrypted";
import { ProfileInsertService } from "../services/profie-insert.service";
import { ProfileSavedService } from "../services/profile-saved.service";

@Controller('v1/users')
export class UserProfileV1Controller {

  private logger = new Logger(UserProfileV1Controller.name);

  constructor(
    private readonly profileInsertService: ProfileInsertService,
    private readonly profileSavedService: ProfileSavedService,
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
    await this.profileInsertService.insert(device_id.toString(), profile)

    return await this.responseEncrypted.encrypted({
      request: req,
      response: res,
      httpStatus: HttpStatus.OK
    });
  }

  @Get('profile')
  async getProfile(
    @Req() req: Request,
    @Res() res: Response
  ) {
    this.logger.log("Call endpoint: (GET) v1/users/profile");
    const { device_id } = req.headers

    const userProfile = await this.profileSavedService.getProfile(device_id.toString())
    return await this.responseEncrypted.encrypted({
      data: userProfile,
      request: req,
      response: res,
      httpStatus: HttpStatus.OK
    });
  }

}