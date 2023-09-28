import { HttpException, HttpStatus } from '@nestjs/common';

export class ExceptionInternalServer extends HttpException {
  constructor(message) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
