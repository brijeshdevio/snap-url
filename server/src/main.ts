import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

const PORT = process.env.PORT ?? 3000;
const hosts = process.env.HOSTS_URI as string;
const allowHosts = hosts?.split(' ');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: allowHosts,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  await app.listen(PORT);
}
bootstrap()
  .then(() => console.log(`Server running on http://localhost:${PORT}`))
  .catch(console.error);
