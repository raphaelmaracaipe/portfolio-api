import { Injectable } from '@nestjs/common';

@Injectable()
export class Codes {
  ERROR_GENERAL = 1000;

  USER_SEND_CODE_PHONE_NOT_VALID = 2000;
  USER_SEND_CODE_INVALID = 2001;
  USER_SEND_DEVICE_ID_INVALID = 2003;
  USER_KEY_INVALID = 2004;
  USER_NOT_FOUND = 2005;
  USER_FAIL_TO_INSERT_PROFILE = 2006;
   USER_INVALID_LOGIN_AGAIN = 2007;

  DEVICE_ID_INVALID = 3001;
  AUTHORIZATION_INVALID = 3002;
  TOKEN_INVALID = 3003;
  TOKEN_TYPE_INVALID = 3004;

  SEED_INVALID = 4001;
}
