import 'dotenv/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';


//<---------- buildCorsOrigins -------------->
// Domain diizinkan diatur lewat CORS_ORIGINS (pisah koma) di .env — tinggal
// tambahin domain produksi frontend (JEK-56) di sana pas udah final, tanpa
// perlu ubah kode.
function buildCorsOrigins(): string[] {
  const origins = process.env.CORS_ORIGINS;
  if (!origins) return ['http://localhost:5173'];
  return origins.split(',').map((origin) => origin.trim());
}

//<---------- setupSwagger -------------->
function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Antrean Kota API')
    .setDescription('API pelaporan infrastruktur kota Antrean Kota')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}

//<---------- bootstrap -------------->
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: buildCorsOrigins() });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
