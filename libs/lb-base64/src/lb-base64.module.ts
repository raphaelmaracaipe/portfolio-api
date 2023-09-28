import { Module } from '@nestjs/common';
import { LbBase64Service } from './lb-base64.service';

@Module({
  providers: [LbBase64Service],
  exports: [LbBase64Service],
})
export class LbBase64Module {}
