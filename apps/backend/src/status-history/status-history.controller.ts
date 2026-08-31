import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatusHistoryService } from './status-history.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateStatusResponseDto } from './dto/update-status-response.dto';
import { StatusHistoryResponseDto } from './dto/status-history-response.dto';
import { PetugasPanelOnly } from '../auth/decorators/petugas-panel-only.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ApiStandardResponse } from '../common/decorators/api-standard-response.decorator';


@ApiTags('Status Laporan')
@Controller('reports/:reportId')
export class StatusHistoryController {
  constructor(private readonly statusHistoryService: StatusHistoryService) {}

  //<---------- updateStatus -------------->
  @Patch('status')
  @PetugasPanelOnly()
  @ApiStandardResponse(UpdateStatusResponseDto, {
    description: 'Status berhasil diubah',
  })
  updateStatus(
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.statusHistoryService.updateStatus(reportId, user.sub, dto);
  }

  //<---------- getHistory -------------->
  @Get('status-history')
  @ApiStandardResponse(StatusHistoryResponseDto, {
    isArray: true,
    description: 'Riwayat status laporan, terurut waktu',
  })
  getHistory(@Param('reportId', ParseUUIDPipe) reportId: string) {
    return this.statusHistoryService.getHistory(reportId);
  }
}
