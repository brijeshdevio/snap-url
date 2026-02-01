import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { envConfig } from './config';

const originAllowed = envConfig.FRONTEND_URL;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: [originAllowed],
    credentials: true,
  });
  app.use(helmet());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => console.log('Server started on port', process.env.PORT))
  .catch((err) => console.error(err));
