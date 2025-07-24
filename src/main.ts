import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './exception-filters/prisma.exception-filter';
import { CatchAllErrorsExceptionFilter } from './exception-filters/catch-all-errors.exception-filter';
import { ValidationPipe } from '@nestjs/common';
import { InvalidRelationExceptionFilter } from './exception-filters/invalid-relation.exception-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  /**
   * https://docs.nestjs.com/security/cors
   */
  // const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  //   logger: WinstonModule.createLogger({
  //     instance: instance,
  //   }),
  // });

  // Defina o range de IPs permitido
  const allowedOriginPattern = /^http:\/\/192\.168\.(4|5|6)\.\d{1,3}$/;

  // Defina os endereços locais permitidos
  const allowedLocalOrigins = [
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:80',
    'http://192.168.4.21:5173',
    'http://192.168.4.21',
    'http://192.168.4.43',
    'http://192.168.4.43:5173',
    'http://192.168.4.43:5174',
    'http://192.168.4.43:80',
    'http://lord.service',
  ];
  // const allowedLocalOrigins = ['http://192.168.6.174'];

  app.enableCors({
    origin: function (origin, callback) {
      // Verifica se a origem corresponde ao padrão da expressão regular
      if (
        allowedLocalOrigins.includes(origin) ||
        allowedOriginPattern.test(origin) ||
        !origin
      ) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation'));
      }
    },
    credentials: true,
    allowedHeaders: 'Authorization, Content-Type',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  /**
   * httpAdapter é um objeto que contém métodos para lidar com requisições HTTP.
   */
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new CatchAllErrorsExceptionFilter(httpAdapter),
    new PrismaExceptionFilter(),
    new InvalidRelationExceptionFilter(),
  );
  // app.useGlobalFilters(
  //   new CatchAllErrorsExceptionFilter(httpAdapter),
  //   new PrismaExceptionFilter(),
  //   new InvalidRelationExceptionFilter(),
  // );

  /**
   * status 422: Unprocessable Entity indica que o servidor entende o tipo de conteúdo
   * da entidade da requisição, e a sintaxe da requisição esta correta, mas não foi possível
   * processar as instruções presentes.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );

  // Servir arquivos estáticos da pasta 'uploads/avatars'
  app.useStaticAssets(join(__dirname, '..', 'assets', 'images'), {
    prefix: '/assets/images/',
  });

  // Servir arquivos estáticos da pasta 'uploads/avatars'
  app.useStaticAssets(join(__dirname, '..', 'uploads', 'avatars'), {
    prefix: '/avatars/',
  });

  // Servir arquivos estáticos da pasta 'uploads/documents'
  app.useStaticAssets(join(__dirname, '..', 'uploads', 'documents'), {
    prefix: '/documents/',
  });

  /**
   * Documentação com Swagger
   */
  const config = new DocumentBuilder()
    .setTitle('API de usuários')
    .setDescription('API de usuários')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001, '0.0.0.0');
}
bootstrap();
