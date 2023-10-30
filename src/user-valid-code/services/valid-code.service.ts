import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { LbBase64Service } from '@app/lb-base64';
import { LbJwtService } from '@app/lb-jwt';
import { LbKeysService } from '@app/lb-keys';
import { Codes } from '../../core/codes/codes';
import { ExceptionBadRequest } from '../../core/exeptions/exceptionBadRequest';
import { Token } from '../../core/models/token.model';
import { User } from '../../core/models/user.model';

@Injectable()
export class ValidCodeService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: MongoRepository<Token>,
    private readonly keys: LbKeysService,
    private readonly jwt: LbJwtService,
    private readonly base64: LbBase64Service,
    private readonly codes: Codes,
  ) { }

  async valid(
    code: number,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    await this.checkIfIsCodeValid(code);
    const userOfDB = await this.checkInDB(code);
    if (!userOfDB) {
      throw new ExceptionBadRequest(this.codes.ERROR_GENERAL);
    }

    const { phone, id } = userOfDB;
    const {
      refreshToken, accessToken, publicKey, privateKey, key
    } = await this.generateToken(phone);

    await this.tokenRepository.deleteMany({ idUser: id.toString() });
    await this.userRepository.updateOne(
      { _id: id },
      {
        $set: {
          publicKey: this.base64.encode(publicKey),
          privateKey: this.base64.encode(privateKey),
          passphrase: key,
          updatedAt: Date.now(),
        },
      },
    );

    return { refreshToken, accessToken };
  }

  private async generateToken(phone: string) {
    const { privateKey, publicKey, key } =
      await this.keys.generatePrivateAndPublicKey();

    const refreshToken = this.jwt.generate(
      { phone, type: 1001 },
      privateKey,
      key,
    );
    const accessToken = this.jwt.generate(
      { phone, type: 1002 },
      privateKey,
      key,
      30 * 60,
    );

    return { refreshToken, accessToken, privateKey, publicKey, key };
  }

  private async checkInDB(token: number): Promise<User> {
    const idUser = await this.checkTokenOfValidationInDB(token);
    return await this.userRepository.findOne({
      where: {
        isDeleted: false,
        _id: new ObjectId(idUser),
      },
    });
  }

  private async checkTokenOfValidationInDB(tokenNumber: number) {
    const returnOfDB = await this.tokenRepository.findOne({
      where: { token: tokenNumber },
    });

    if (!returnOfDB) {
      throw new ExceptionBadRequest(this.codes.USER_SEND_CODE_INVALID);
    }

    const dateNow = new Date().getTime();
    const { timeValidUntilOfCode, idUser } = returnOfDB;
    if (timeValidUntilOfCode < dateNow) {
      throw new ExceptionBadRequest(this.codes.USER_SEND_CODE_INVALID);
    }

    return idUser;
  }

  private checkIfIsCodeValid(code: number): void {
    if (isNaN(code) || code.toString().length !== 6) {
      throw new ExceptionBadRequest(this.codes.USER_SEND_CODE_INVALID);
    }
  }
}
