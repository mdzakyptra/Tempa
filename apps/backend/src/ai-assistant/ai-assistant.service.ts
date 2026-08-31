import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ReportsService } from '../reports/reports.service';
import { AskQuestionDto } from './dto/ask-question.dto';


// llama-3.3-70b-versatile udah di-deprecate Groq (404 model_not_found per
// 27 Agustus 2026) — diganti openai/gpt-oss-120b, model chat paling besar
// yang masih aktif di daftar model Groq buat akun ini.
const GROQ_MODEL = 'openai/gpt-oss-120b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `Kamu asisten tanya jawab untuk Aspiraku (nama teknis: Antrean Kota) — aplikasi pelaporan infrastruktur kota yang bikin antrean perbaikan jadi transparan. Warga lapor kerusakan, laporan otomatis diurutkan pakai skor prioritas (tingkat bahaya, jumlah warga terdampak, lama menunggu, kedekatan jalur vital), siapa aja bisa lihat kenapa satu laporan didahulukan dari yang lain.

Kalau ditanya soal Aspiraku secara umum (apa itu, cara kerja, rumus skor), jawab pakai penjelasan di atas.
Kalau ditanya soal laporan/posisi/skor tertentu, jawab HANYA berdasarkan data yang diberikan di bawah — jangan pernah mengarang angka skor, posisi, atau alasan yang gak ada di data itu. Kalau datanya gak cukup, ngaku jujur belum punya datanya, jangan sebut istilah teknis kayak "JSON" atau "data yang diberikan" ke warga — cukup bilang "data laporan yang ada".
Kalau ditanya kamu bisa bantu apa, jawab santai ngalir kayak ngobrol biasa, jangan daftar berpoin formal.

Jawab singkat, jelas, pakai Bahasa Indonesia sehari-hari, nada santai — bukan kaku/formal kayak robot customer service.`;

//<---------- AiAssistantService -------------->
@Injectable()
export class AiAssistantService {
  constructor(private readonly reportsService: ReportsService) {}

  //<---------- ask -------------->
  async ask(dto: AskQuestionDto): Promise<{ jawaban: string }> {
    const context = await this.buildContext(dto.report_id);
    const jawaban = await this.callGroq(dto.pertanyaan, context);
    return { jawaban };
  }

  //<---------- buildContext -------------->
  // Konteks selalu ditarik dari query skor yang sama persis dipakai
  // GET /reports (JEK-14) & GET /reports/:id (JEK-15), supaya jawaban model
  // gak bisa beda dari angka yang tampil di layar warga.
  private async buildContext(reportId?: string) {
    const { items: antrean } = await this.reportsService.findAll({});

    if (!reportId) {
      return {
        catatan: 'Warga belum menunjuk laporan spesifik, ini ringkasan antrean teratas.',
        total_laporan_aktif: antrean.length,
        lima_teratas: antrean.slice(0, 5).map((r, i) => this.toContextItem(r, i, antrean.length)),
      };
    }

    const index = antrean.findIndex((r) => r.id === reportId);
    if (index === -1) {
      throw new NotFoundException('Laporan tidak ditemukan di antrean aktif');
    }

    return {
      laporan_ditanyakan: this.toContextItem(antrean[index], index, antrean.length),
      laporan_di_depannya: index > 0 ? this.toContextItem(antrean[index - 1], index - 1, antrean.length) : null,
    };
  }

  //<---------- toContextItem -------------->
  private toContextItem(
    report: Awaited<ReturnType<ReportsService['findAll']>>['items'][number],
    index: number,
    total: number,
  ) {
    return {
      id: report.id,
      judul: report.judul,
      kawasan: report.kawasan,
      jenis_kerusakan: report.jenis_kerusakan,
      tingkat_bahaya: report.tingkat_bahaya,
      status: report.status,
      votes_count: report.votes_count,
      dibuat_pada: report.dibuat_pada,
      posisi_antrean: index + 1,
      total_laporan_aktif: total,
      skor: report.skor,
      skor_komponen: report.skor_komponen,
    };
  }

  //<---------- callGroq -------------->
  private async callGroq(pertanyaan: string, context: unknown): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('GROQ_API_KEY belum diatur di server');
    }

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.2,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Data antrean (JSON):\n${JSON.stringify(context)}\n\nPertanyaan warga: ${pertanyaan}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new InternalServerErrorException('Gagal menghubungi layanan AI, coba lagi sebentar lagi');
    }

    const body = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const jawaban = body.choices?.[0]?.message?.content?.trim();
    if (!jawaban) {
      throw new InternalServerErrorException('Layanan AI tidak memberikan jawaban');
    }

    return jawaban;
  }
}
