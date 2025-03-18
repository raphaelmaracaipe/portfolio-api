import { Injectable, Logger } from '@nestjs/common';
import { User, User as UserInterface } from '../models/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { LbCryptoService } from '@app/lb-crypto';
import { Codes } from '../../core/codes/codes';
import { ExceptionBadRequest } from '../../core/exeptions/exceptionBadRequest';
import { Token } from '../../core/models/token.model';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/configuration';

@Injectable()
export class UserCodeService {
  private logger = new Logger(UserCodeService.name);
  private isDev: boolean = this.configService.get('IS_DEV');
  private timeToValidationCode: number = this.configService.get(
    'TIME_TO_VALIDATION_CODE',
  );

  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: MongoRepository<Token>,
    private readonly crypto: LbCryptoService,
    private readonly codes: Codes,
    private readonly configService: ConfigService<Configuration>,
  ) {}

  async generate(user: UserInterface): Promise<void> {
    const { phone } = user;
    this.validateNumberPhone(phone);
    if (!user.deviceId) {
      this.logger.error('Device id invalid');
      throw new ExceptionBadRequest(this.codes.USER_SEND_DEVICE_ID_INVALID);
    }

    try {
      const idOfUserSavedInDb = await this.saveDataInDB(user);
      await this.generateKeyToValidationAccess(idOfUserSavedInDb);
    } catch (err) {
      this.logger.error(err);
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
    const { phone } = user;

    const dataOfDB = await this.userRepository.findOne({
      where: { phone, isDeleted: false },
    });
    const returnOfSaved = await this.userRepository.save({
      ...dataOfDB,
      ...this.checkIfIsNewUserOrOldUserToInserValuesDefault(dataOfDB),
      phone,
      updatedAt: Date.now(),
    });

    const { id } = returnOfSaved;
    return id.toString();
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
