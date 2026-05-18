import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('File Uploader Api Docs')
    .setDescription('File Uploaders all Api Documentation following the standard of OpenAPI')
    .setVersion('1.0')
    .build();

  app.useGlobalPipes(new ValidationPipe())

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  })

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/docs',
    apiReference({ content: document })
  )

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
