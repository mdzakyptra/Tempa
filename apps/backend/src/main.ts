import 'dotenv/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
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
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Railway (dan proxy sejenis) ada di depan app — tanpa ini req.ip kebaca
  // IP proxy internal buat semua user, bikin ThrottlerGuard rate-limit
  // rame-rame bareng, bukan per-user.
  app.set('trust proxy', 1);
  // CSP dilonggarin buat script/style inline yang dipakai Swagger UI (JEK-9) —
  // rekomendasi resmi NestJS docs (docs.nestjs.com/security/helmet).
  // Foto laporan gak lewat sini sama sekali (dilayani langsung dari S3/CDN,
  // lihat photos.service.ts), jadi crossOriginResourcePolicy default aman.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:'],
          scriptSrc: [`'self'`, `'unsafe-inline'`],
        },
      },
    }),
  );
  app.enableCors({ origin: buildCorsOrigins() });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
void bootstrap();
