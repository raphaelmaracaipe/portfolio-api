import helmet from 'helmet';
import { INestApplication } from '@nestjs/common';

export class SecurityConfig {
  static apply(app: INestApplication) {
    app.use(
      helmet({
        crossOriginEmbedderPolicy: true,
        xDnsPrefetchControl: false,
      }),
    );
  }
}
