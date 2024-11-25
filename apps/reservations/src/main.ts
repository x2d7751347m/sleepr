import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Reservation example')
    .setDescription('Reservation API description')
    .setVersion('1.0')
    .addTag('reservation')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(configService.get('PORT'));
}
bootstrap();
