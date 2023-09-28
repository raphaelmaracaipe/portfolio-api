import { Module } from '@nestjs/common';
import { LbEmailService } from './lb-email.service';

@Module({
  providers: [LbEmailService],
  exports: [LbEmailService],
})
export class LbEmailModule {}
