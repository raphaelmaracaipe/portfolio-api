import { LbBase64Service } from "@app/lb-base64";
import { LbJwtService } from "@app/lb-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Codes } from "../../../core/codes/codes";
import { User } from "../../../core/models/user.model";
import { REGEX_DEVICE_ID } from "../../regex/regex.parttern";
import { RegexService } from "../../../core/regex/regex.service";
import { TOKEN_TYPE_ACCESS } from "../../../core/tokens/tokens.const";
import { MongoRepository } from "typeorm";
import { ExceptionUnathorizedRequest } from "../../../core/exeptions/exceptionUnauthorizedRequest";
import { Logger } from "@nestjs/common";

export class TokenValidService {

  private authorization = ""
  private deviceId = ""
  private logger = new Logger(TokenValidService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly jwt: LbJwtService,
    private readonly codes: Codes,
    private readonly regex: RegexService,
    private readonly base64: LbBase64Service
  ) { }

  async valid(authorization: string, deviceId: string) {
    this.authorization = authorization
    this.deviceId = decodeURIComponent(deviceId)
    this.validParams();

    try {
      const { publicKey } = await this.validUsers(deviceId);
      const publicDecripted = this.base64.decode(publicKey)
      const { type } = this.jwt.verify(this.authorization, publicDecripted)
      if (type != TOKEN_TYPE_ACCESS) {
        this.logger.error('token send is access');
        throw new ExceptionUnathorizedRequest(this.codes.TOKEN_TYPE_INVALID)
      }
    } catch (e) {
      this.logger.error('erro to process in validation token', e);
      throw new ExceptionUnathorizedRequest(this.codes.TOKEN_INVALID)
    }
  }

  private async validUsers(deviceId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { deviceId } })
    if (!user) {
      this.logger.error('not found user in db');
      throw new ExceptionUnathorizedRequest(this.codes.USER_NOT_FOUND)
    }

    this.logger.verbose('user found');
    return user
  }

  private validParams() {
    if (this.authorization == "" || this.authorization.indexOf('.') == -1) {
      this.logger.error('Authorization invalid');
      throw new ExceptionUnathorizedRequest(this.codes.AUTHORIZATION_INVALID);
    } else if (!this.regex.check(REGEX_DEVICE_ID, this.deviceId)) {
      this.logger.error('Device id invalid');
      throw new ExceptionUnathorizedRequest(this.codes.DEVICE_ID_INVALID)
    }
  }

}