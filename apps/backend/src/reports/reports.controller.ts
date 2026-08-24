import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportResponseDto } from './dto/report-response.dto';
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
  @ApiStandardResponse(ReportResponseDto, {
    description: 'Laporan berhasil dibuat',
  })
  create(
    @CurrentUser() user: JwtPayload | undefined,
    @Body() dto: CreateReportDto,
  ) {
    return this.reportsService.create(dto, user?.sub);
  }
}
