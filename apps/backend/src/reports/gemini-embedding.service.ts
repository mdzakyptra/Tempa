import { Injectable, Logger } from '@nestjs/common';
import {
  EMBEDDING_DIMENSIONS,
  GEMINI_EMBEDDING_URL,
} from './constants/embedding.constant';


interface GeminiEmbedResponse {
  embedding?: { values?: number[] };
}

// Gagal manggil Gemini (rate limit, key belum diset, dsb) sengaja nggak
// throw — balikin null, biar caller (ReportsService) bisa lanjut tanpa
// nge-gagalin create laporan atau deteksi duplikat cuma gara-gara AI down.
//<---------- GeminiEmbeddingService -------------->
@Injectable()
export class GeminiEmbeddingService {
  private readonly logger = new Logger(GeminiEmbeddingService.name);

  //<---------- embed -------------->
  async embed(text: string): Promise<number[] | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY belum diatur, skip embedding');
      return null;
    }

    try {
      const response = await fetch(GEMINI_EMBEDDING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          content: { parts: [{ text }] },
          outputDimensionality: EMBEDDING_DIMENSIONS,
        }),
      });

      if (!response.ok) {
        this.logger.warn(`Gemini embedding gagal: HTTP ${response.status}`);
        return null;
      }

      const body = (await response.json()) as GeminiEmbedResponse;
      const values = body.embedding?.values;
      if (!values || values.length !== EMBEDDING_DIMENSIONS) {
        this.logger.warn('Gemini embedding balikin format tidak sesuai');
        return null;
      }

      return values;
    } catch (error) {
      this.logger.warn(`Gemini embedding error: ${(error as Error).message}`);
      return null;
    }
  }
}
