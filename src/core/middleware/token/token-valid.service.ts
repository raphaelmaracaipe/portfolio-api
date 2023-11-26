import { LbBase64Service } from "@app/lb-base64";
import { LbJwtService } from "@app/lb-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Codes } from "../../../core/codes/codes";
import { ExceptionBadRequest } from "../../../core/exeptions/exceptionBadRequest";
import { User } from "../../../core/models/user.model";
import { REGEX_DEVICE_ID } from "../../../core/regex/regex";
import { RegexService } from "../../../core/regex/regex.service";
import { TOKEN_TYPE_ACCESS } from "../../../core/tokens/tokens.const";
import { MongoRepository } from "typeorm";

export class TokenValidService {

  private authorization = ""
  private deviceId = ""

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
      if(type != TOKEN_TYPE_ACCESS) {
        throw new ExceptionBadRequest(this.codes.TOKEN_INVALID)  
      }
    } catch (e) {
      throw new ExceptionBadRequest(this.codes.TOKEN_INVALID)
    }
  }

  private async validUsers(deviceId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { deviceId } })
    if (!user) {
      throw new ExceptionBadRequest(this.codes.USER_NOT_FOUND)
    }
    return user
  }

  private validParams() {
    if (this.authorization == "" || this.authorization.indexOf('.') == -1) {
      throw new ExceptionBadRequest(this.codes.AUTORIZATION_INVALID);
    } else if (!this.regex.check(REGEX_DEVICE_ID, this.deviceId)) {
      throw new ExceptionBadRequest(this.codes.DEVICE_ID_INVALID)
    }
  }

}