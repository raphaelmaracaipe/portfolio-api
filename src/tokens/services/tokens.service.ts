import { LbBase64Service } from "@app/lb-base64";
import { LbJwtService } from "@app/lb-jwt";
import { LbKeysService } from "@app/lb-keys";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Codes } from "src/core/codes/codes";
import { ExceptionBadRequest } from "src/core/exeptions/exceptionBadRequest";
import { User } from "src/core/models/user.model";
import { TOKEN_TYPE_REFRESH, TOKEN_TYPE_ACCESS } from "src/core/tokens/tokens.const";
import { Token } from "src/tokens/models/token.interface";
import { MongoRepository } from "typeorm";

@Injectable()
export class TokensServices {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly jwt: LbJwtService,
    private readonly codes: Codes,
    private readonly keys: LbKeysService,
    private readonly base64: LbBase64Service
  ) { }

  async valid(deviceId: string, token: Token) {
    const { publicKey, phone, id } = await this.validUser(deviceId)

    const { refresh } = token
    await this.validToken(refresh, publicKey)

    return await this.generatedAndSavedNewTokens(phone, deviceId, id)
  }

  private async generateToken(phone: string) {
    const { privateKey, publicKey, key } = await this.keys.generatePrivateAndPublicKey();

    const refreshToken = this.jwt.generate(
      { phone, type: TOKEN_TYPE_REFRESH },
      privateKey,
      key,
    );
    const accessToken = this.jwt.generate(
      { phone, type: TOKEN_TYPE_ACCESS },
      privateKey,
      key,
      30 * 60,
    );

    return { refreshToken, accessToken, privateKey, publicKey, key };
  }

  private async validUser(deviceId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { deviceId } })
    if (!user) {
      throw new ExceptionBadRequest(this.codes.USER_NOT_FOUND)
    }
    return user
  }

  private async validToken(refresh: string, publicKey: string) {
    try {
      const { type } = await this.jwt.verify(refresh, this.base64.decode(publicKey))
      if (type != TOKEN_TYPE_REFRESH) {
        throw new ExceptionBadRequest(this.codes.TOKEN_INVALID)
      }
    } catch (e) {
      throw new ExceptionBadRequest(this.codes.TOKEN_INVALID)
    }
  }

  private async generatedAndSavedNewTokens(
    phone: string,
    deviceId: string,
    id: string
  ): Promise<{ refreshToken, accessToken }> {
    const {
      refreshToken, accessToken, publicKey, privateKey, key
    } = await this.generateToken(phone);

    await this.userRepository.updateOne(
      { _id: id },
      {
        $set: {
          deviceId: deviceId,
          publicKey: this.base64.encode(publicKey),
          privateKey: this.base64.encode(privateKey),
          passphrase: key,
          updatedAt: Date.now(),
        },
      },
    );

    return { refreshToken, accessToken }
  }

}