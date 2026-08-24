import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStatusDto } from './dto/update-status.dto';


@Injectable()
export class StatusHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  //<---------- updateStatus -------------->
  async updateStatus(reportId: string, petugasId: string, dto: UpdateStatusDto) {
    return this.prisma.$transaction(async (tx) => {
      const report = await tx.report.findUnique({ where: { id: reportId } });

      if (!report) {
        throw new NotFoundException('Laporan tidak ditemukan');
      }

      const updatedReport = await tx.report.update({
        where: { id: reportId },
        data: { status: dto.status },
      });

      const riwayat = await tx.statusHistory.create({
        data: {
          id: randomUUID(),
          report_id: reportId,
          status_lama: report.status,
          status_baru: dto.status,
          catatan: dto.catatan,
          diubah_oleh: petugasId,
        },
      });

      return {
        report_id: updatedReport.id,
        status: updatedReport.status,
        riwayat_terbaru: riwayat,
      };
    });
  }

  //<---------- getHistory -------------->
  async getHistory(reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Laporan tidak ditemukan');
    }

    return this.prisma.statusHistory.findMany({
      where: { report_id: reportId },
      orderBy: { diubah_pada: 'asc' },
    });
  }
}
