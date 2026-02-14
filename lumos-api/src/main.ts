/**
 * Lumos API - Authentication Backend
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
    })
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📧 Email verification links will be logged to console`);
  Logger.log(`🔒 Authentication endpoints:`);
  Logger.log(`   POST ${globalPrefix}/auth/signup`);
  Logger.log(`   POST ${globalPrefix}/auth/signin`);
  Logger.log(`   POST ${globalPrefix}/auth/verify-email`);
  Logger.log(`   POST ${globalPrefix}/auth/refresh`);
  Logger.log(`   POST ${globalPrefix}/auth/logout`);
  Logger.log(`   POST ${globalPrefix}/auth/forgot-password`);
  Logger.log(`   POST ${globalPrefix}/auth/reset-password`);
  Logger.log(`   GET  ${globalPrefix}/auth/me`);
}

bootstrap();
