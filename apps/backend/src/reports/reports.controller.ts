import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportResponseDto } from './dto/report-response.dto';
import { ListReportsQueryDto } from './dto/list-reports-query.dto';
import { FindSimilarQueryDto } from './dto/find-similar-query.dto';
import { MergeReportDto } from './dto/merge-report.dto';
import { ReportListItemDto } from './dto/report-list-item.dto';
import { ReportSimilarItemDto } from './dto/report-similar-item.dto';
import { OptionalAuth } from '../auth/decorators/optional-auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ApiStandardResponse } from '../common/decorators/api-standard-response.decorator';


@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  //<---------- create -------------->
  @Post()
  @OptionalAuth()
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @ApiStandardResponse(ReportResponseDto, {
    description: 'Laporan berhasil dibuat',
  })
  create(
    @CurrentUser() user: JwtPayload | undefined,
    @Body() dto: CreateReportDto,
  ) {
    return this.reportsService.create(dto, user?.sub);
  }

  //<---------- findAll -------------->
  @Get()
  @ApiStandardResponse(ReportListItemDto, {
    isArray: true,
    description: 'Daftar laporan terurut skor prioritas, tertinggi dulu',
  })
  findAll(@Query() query: ListReportsQueryDto) {
    return this.reportsService.findAll(query);
  }

  //<---------- findSimilar -------------->
  // Wajib didaftar sebelum findOne(':id') di controller ini, supaya
  // "/reports/similar" nggak ketangkep router sebagai ParseUUIDPipe(':id').
  @Get('similar')
  @ApiStandardResponse(ReportSimilarItemDto, {
    isArray: true,
    description: 'Laporan existing yang kawasan & jenis kerusakannya cocok, dan/atau maknanya mirip (embedding)',
  })
  findSimilar(@Query() query: FindSimilarQueryDto) {
    return this.reportsService.findSimilar(query);
  }

  //<---------- findOne -------------->
  @Get(':id')
  @ApiStandardResponse(ReportListItemDto, {
    description: 'Detail satu laporan beserta rincian skor',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportsService.findOne(id);
  }

  //<---------- merge -------------->
  @Post(':id/merge')
  @OptionalAuth()
  @ApiStandardResponse(ReportResponseDto, {
    description: 'Laporan berhasil ditautkan sebagai duplikat',
  })
  merge(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: MergeReportDto,
  ) {
    return this.reportsService.merge(id, dto);
  }
}
