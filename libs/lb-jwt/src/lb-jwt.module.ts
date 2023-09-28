import { Module } from '@nestjs/common';
import { LbJwtService } from './lb-jwt.service';

@Module({
  providers: [LbJwtService],
  exports: [LbJwtService],
})
export class LbJwtModule {}
