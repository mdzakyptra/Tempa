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

    // votes_count dijaga trigger DB (JEK-21), bukan dihitung ulang di sini
    const updated = await this.prisma.report.findUniqueOrThrow({
      where: { id: reportId },
      select: { votes_count: true },
    });

    return { report_id: reportId, votes_count: updated.votes_count };
  }
}
