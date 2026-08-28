import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { GeminiEmbeddingService } from './gemini-embedding.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [AuthModule],
  controllers: [ReportsController],
  providers: [ReportsService, GeminiEmbeddingService],
  exports: [ReportsService],
})
export class ReportsModule {}
