import { Injectable } from '@nestjs/common';
import { User, User as UserInterface } from '../models/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { LbCryptoService } from '@app/lb-crypto';
import { Codes } from '../../core/codes/codes';
import { ExceptionBadRequest } from '../../core/exeptions/exceptionBadRequest';
import { Key } from '../../core/models/key.model';
import { Token } from '../../core/models/token.model';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/configuration';

@Injectable()
export class UserCodeService {
  private isDev: boolean = this.configService.get('IS_DEV');
  private timeToValidationCode: number = this.configService.get(
    'TIME_TO_VALIDATION_CODE',
  );

  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: MongoRepository<Token>,
    @InjectRepository(Key)
    private readonly keyRepository: MongoRepository<Key>,
    private readonly crypto: LbCryptoService,
    private readonly codes: Codes,
    private readonly configService: ConfigService<Configuration>,
  ) {}

  async generate(user: UserInterface): Promise<void> {
    const { phone } = user;
    this.validateNumberPhone(phone);
    if (!user.deviceId) {
      throw new ExceptionBadRequest(this.codes.USER_SEND_DEVICE_ID_INVALID);
    }

    try {
      const idOfUserSavedInDb = await this.saveDataInDB(user);
      await this.generateKeyToValidationAccess(idOfUserSavedInDb);
    } catch (err) {
      throw new ExceptionBadRequest(this.codes.ERROR_GENERAL);
    }
  }

  private validateNumberPhone(phone: string) {
    let phoneTakeCare = phone;
    if (phoneTakeCare.indexOf('+') > -1) {
      phoneTakeCare = phoneTakeCare.replace('+', '');
    }

    if (isNaN(parseInt(phoneTakeCare))) {
      throw new ExceptionBadRequest(this.codes.USER_SEND_CODE_PHONE_NOT_VALID);
    }
  }

  private async saveDataInDB(user: UserInterface): Promise<string> {
    const { phone, deviceId } = user;

    const dataOfDB = await this.userRepository.findOne({
      where: { phone, isDeleted: false },
    });
    const returnOfSaved = await this.userRepository.save({
      ...dataOfDB,
      ...this.checkIfIsNewUserOrOldUserToInserValuesDefault(dataOfDB),
      phone,
      updatedAt: Date.now(),
    });

    this.saveUserInKey(returnOfSaved, deviceId);
    const { id } = returnOfSaved;
    return id.toString();
  }

  private async saveUserInKey(userSaved: User, deviceId: string) {
    const { id } = userSaved;

    await this.keyRepository.updateMany(
      { idUser: id.toString() },
      { $set: { idUser: '', updatedAt: Date.now() } },
    );
    await this.keyRepository.findOneAndUpdate(
      { deviceId },
      { $set: { idUser: id.toString(), updatedAt: Date.now() } },
    );
  }

  private async generateKeyToValidationAccess(idUserSaved: string) {
    const token = await this.checkInformationInTokenTable(idUserSaved);

    if (this.isDev) {
      console.log('codeToValidation', token);
    }
  }

  private async checkInformationInTokenTable(idUser: string): Promise<number> {
    const token = this.crypto.generateCode(100000, 999999);

    await this.tokenRepository.deleteMany({ idUser });
    await this.tokenRepository.save({
      idUser,
      token,
      timeValidUntilOfCode: this.addTimeOfValidationCode(),
    });

    return token;
  }

  private addTimeOfValidationCode(): number {
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() + this.timeToValidationCode);
    return timestamp.getTime();
  }

  private checkIfIsNewUserOrOldUserToInserValuesDefault(dataOfDB: User) {
    if (dataOfDB) {
      return {};
    }

    return {
      isDeleted: false,
      createdAt: Date.now(),
    };
  }
}
