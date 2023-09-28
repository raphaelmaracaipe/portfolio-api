import { HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';

export interface IResponse {
  data?: any;
  request: Request;
  response: Response;
  httpStatus: HttpStatus;
  iv?: string;
  key?: string;
}
