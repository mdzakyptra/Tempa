import { Module } from '@nestjs/common';
import { AiAssistantController } from './ai-assistant.controller';
import { AiAssistantService } from './ai-assistant.service';
import { AuthModule } from '../auth/auth.module';
import { ReportsModule } from '../reports/reports.module';


@Module({
  imports: [AuthModule, ReportsModule],
  controllers: [AiAssistantController],
  providers: [AiAssistantService],
})
export class AiAssistantModule {}
