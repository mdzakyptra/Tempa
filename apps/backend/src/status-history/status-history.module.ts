import { Module } from '@nestjs/common';
import { StatusHistoryController } from './status-history.controller';
import { StatusHistoryService } from './status-history.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [AuthModule],
  controllers: [StatusHistoryController],
  providers: [StatusHistoryService],
})
export class StatusHistoryModule {}
