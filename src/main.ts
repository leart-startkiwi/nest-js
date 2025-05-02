import { NestFactory } from '@nestjs/core';
import { appCreate } from './app.create';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     // forbidNonWhitelisted: true,
  //     transform: true,
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //   }),
  // );

  // const swaggerConfig = new DocumentBuilder()
  //   .setTitle('NestJs Intro')
  //   .setDescription('Use the base API URL as http://localhost:3000')
  //   .setTermsOfService('http://localhost:3000/terms-of-service')
  //   .setLicense('MIT License', 'http://localhost:3000/terms-of-service')
  //   .addServer('http://localhost:3000')
  //   .setVersion('1.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, swaggerConfig);
  // SwaggerModule.setup('api', app, document);

  // // Setup the aws sdk used for uploading the files to s3 bucket
  // const configService = app.get(ConfigService);
  // config.update({
  //   credentials: {
  //     accessKeyId: configService.get('appConfig.awsAccessKeyId') ?? '',
  //     secretAccessKey: configService.get('appConfig.awsSecretAccessKey') ?? '',
  //   },
  //   region: configService.get('appConfig.awsRegion'),
  // });

  // // enable cors
  // app.enableCors();

  // // add global interceptor
  // // app.useGlobalInterceptors(new DataResponseInterceptor());
  appCreate(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
