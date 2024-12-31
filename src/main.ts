import * as compression from 'compression';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureMiddleware(app);
  configureSecurity(app);

  app.setGlobalPrefix('api');
  app.enableCors();
  
  await app.listen(3000);
}

function configureMiddleware(app) {
  app.use(compression());
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ extended: true, limit: '100mb' }));
}

function configureSecurity(app) {
  app.use(helmet({
    crossOriginEmbedderPolicy: true,
    xDnsPrefetchControl: false,
  }));
}

bootstrap();