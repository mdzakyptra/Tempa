import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';


@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaService) {}

  //<---------- vote -------------->
  async vote(userId: string, reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Laporan tidak ditemukan');
    }

    try {
      await this.prisma.vote.create({
        data: { report_id: reportId, user_id: userId },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Kamu sudah mendukung laporan ini');
      }
      throw error;
    }

    const votesCount = await this.prisma.vote.count({
      where: { report_id: reportId },
    });

    return { report_id: reportId, votes_count: votesCount };
  }
}
