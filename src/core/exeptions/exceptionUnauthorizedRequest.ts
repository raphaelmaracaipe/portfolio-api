import { HttpException, HttpStatus } from '@nestjs/common';

export class ExceptionUnathorizedRequest extends HttpException {
  constructor(message) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
