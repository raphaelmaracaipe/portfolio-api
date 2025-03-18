import * as compression from 'compression';
import { json, urlencoded } from 'express';
import { INestApplication } from '@nestjs/common';

export class MiddlewareConfig {
  static apply(app: INestApplication) {
    app.use(compression());
    app.use(json({ limit: '100mb' }));
    app.use(urlencoded({ extended: true, limit: '100mb' }));
  }
}
