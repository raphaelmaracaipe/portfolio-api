import { readFileSync } from 'fs';
import { join } from 'path';

export class HttpsConfig {
  static getOptions() {
    return {
      key: readFileSync(join(__dirname, '../../certs/server.key')),
      cert: readFileSync(join(__dirname, '../../certs/server.cert')),
    };
  }
}
