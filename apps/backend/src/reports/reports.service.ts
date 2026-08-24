import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { KAWASAN_JALUR_VITAL } from './constants/jalur-vital.constant';


@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  //<---------- create -------------->
  async create(dto: CreateReportDto, userId?: string) {
    return this.prisma.report.create({
      data: {
        id: randomUUID(),
        judul: dto.judul,
        deskripsi: dto.deskripsi,
        kawasan: dto.kawasan,
        jenis_kerusakan: dto.jenis_kerusakan,
        tingkat_bahaya: dto.tingkat_bahaya,
        estimasi_terdampak: dto.estimasi_terdampak,
        jalur_vital: KAWASAN_JALUR_VITAL.includes(dto.kawasan),
        dibuat_oleh: userId,
      },
    });
  }
}
