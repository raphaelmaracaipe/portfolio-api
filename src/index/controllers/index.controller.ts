import { Controller, Get } from '@nestjs/common';

@Controller()
export class IndexController {
  @Get()
  getHello(): string {
    return 'Api online';
  }
}
