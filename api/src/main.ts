import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { AppModule } from './app.module';
import { envConfig } from './config';
import { logger } from './lib';

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
  app.use(
    pinoHttp({
      logger,
      customLogLevel: function (req, res, err) {
        if (res.statusCode >= 500 || err) {
          return 'error';
        }
        if (res.statusCode >= 400) {
          return 'warn';
        }
        return 'info';
      },
    }),
  );
  await app.listen(envConfig.PORT);
}

bootstrap()
  .then(() => console.log('Server started on port', envConfig.PORT))
  .catch((err) => console.error(err));
