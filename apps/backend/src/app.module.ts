import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { VotesModule } from './votes/votes.module';
import { StatusHistoryModule } from './status-history/status-history.module';
import { ReportsModule } from './reports/reports.module';
import { AiAssistantModule } from './ai-assistant/ai-assistant.module';
import { PhotosModule } from './photos/photos.module';


// Batas default (global). Endpoint sensitif override lewat @Throttle() sendiri
// (lihat auth, reports, votes controller) — lihat README backend untuk daftarnya.
@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    VotesModule,
    StatusHistoryModule,
    ReportsModule,
    AiAssistantModule,
    PhotosModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
