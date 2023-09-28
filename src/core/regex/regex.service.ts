import { Injectable } from '@nestjs/common';
import * as randexp from 'randexp';

@Injectable()
export class RegexService {
  public check(pattern: string, text: string): boolean {
    return new RegExp(pattern).test(text);
  }

  public generateRandom(regexString: string): string {
    try {
      const exp = new randexp(regexString);
      return exp.gen();
    } catch (e) {
      return '';
    }
  }
}
