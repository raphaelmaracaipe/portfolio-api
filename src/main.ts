import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MiddlewareConfig } from './config/middleware.config';
import { SecurityConfig } from './config/security.config';
import { HttpsConfig } from './config/https.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: HttpsConfig.getOptions(),
  });

  MiddlewareConfig.apply(app);
  SecurityConfig.apply(app);

  app.setGlobalPrefix('api');
  app.enableCors();

  await app.listen(3000);
}

bootstrap();
