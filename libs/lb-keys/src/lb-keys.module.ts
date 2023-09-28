import { Module } from '@nestjs/common';
import { LbKeysService } from './lb-keys.service';

@Module({
  providers: [LbKeysService],
  exports: [LbKeysService],
})
export class LbKeysModule {}
