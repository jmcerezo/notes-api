import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './auth/auth.module';
import { NoteModule } from './note/note.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;

  const config = new DocumentBuilder()
    .setTitle('Notes API')
    .setDescription('NestJS CRUD API with JWT and Passport Authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [AuthModule, NoteModule],
  });
  SwaggerModule.setup('/', app, document, {
    swaggerOptions: { tagsSorter: 'alpha', operationsSorter: 'alpha' },
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
