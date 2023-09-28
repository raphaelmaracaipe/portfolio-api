import { Injectable } from '@nestjs/common';

@Injectable()
export class Codes {
  ERROR_GENERAL = 1000;

  USER_SEND_CODE_PHONE_NOT_VALID = 2000;
  USER_SEND_CODE_INVALID = 2001;
  USER_SEND_DEVICE_ID_INVALID = 2003;
  USER_KEY_INVALID = 2004;

  DEVICE_ID_INVALID = 3001;
}
