import { ApiProperty } from '@nestjs/swagger';

export class User {
  id?: string;
  @ApiProperty()
  phone: string;
  deviceId: string;
}
