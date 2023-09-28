import { HttpException, HttpStatus } from '@nestjs/common';

export class ExceptionBadRequest extends HttpException {
  constructor(code) {
    super(code, HttpStatus.BAD_REQUEST);
  }
}
