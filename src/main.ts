import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use the built-in Logger
  const logger = new Logger('Bootstrap');

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable Validation
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Location Tree API')
    .setDescription('API for managing location tree structure')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Seed the database using SeedService
  // uncomment the following lines to enable seeding
  // const seedService = app.get(SeedService);
  // await seedService.seedData();

  // Get port from .env
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000); // Default to 3000 if not specified
  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();