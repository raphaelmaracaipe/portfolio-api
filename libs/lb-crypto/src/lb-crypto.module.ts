import { Module } from '@nestjs/common';
import { LbCryptoService } from './lb-crypto.service';

@Module({
  providers: [LbCryptoService],
  exports: [LbCryptoService],
})
export class LbCryptoModule {}
