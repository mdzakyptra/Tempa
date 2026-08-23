import 'dotenv/config';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';


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
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
