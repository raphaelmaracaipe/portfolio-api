import { ApiProperty } from '@nestjs/swagger';

export class Code {
  @ApiProperty()
  key: string;
}
