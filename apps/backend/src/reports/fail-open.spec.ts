import { Logger } from '@nestjs/common';
import { JalurVitalService } from './jalur-vital.service';
import { GeminiEmbeddingService } from './gemini-embedding.service';


// Layanan luar (Mapbox, Gemini) NGGAK boleh nge-gagalin create laporan.
// Kalau salah satu down pas demo, warga harus tetap bisa lapor — cuma
// jalur_vital jadi false / embedding jadi null.
describe('Fail-open layanan eksternal', () => {
  const fetchAsli = global.fetch;

  // Test ini sengaja bikin layanan luar gagal, jadi WARN-nya pasti muncul —
  // dibungkam biar output jest bersih, bukan karena error-nya disembunyiin.
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    global.fetch = fetchAsli;
    jest.restoreAllMocks();
  });

  describe('JalurVitalService', () => {
    const service = new JalurVitalService();

    it('balikin false (bukan throw) waktu Overpass nolak', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 429 });
      await expect(service.isJalurVital(-6.2, 106.8)).resolves.toBe(false);
    });

    it('balikin false (bukan throw) waktu jaringan mati / timeout', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('TimeoutError'));
      await expect(service.isJalurVital(-6.2, 106.8)).resolves.toBe(false);
    });

    it('true kalau ada sekolah/RS/jalan utama di sekitar titik', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ elements: [{ type: 'node', id: 7938730274 }] }),
      });
      await expect(service.isJalurVital(-7.5466, 110.8499)).resolves.toBe(true);
    });

    it('false kalau sekitarnya kosong', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ elements: [] }),
      });
      await expect(service.isJalurVital(-6.2, 106.8)).resolves.toBe(false);
    });

    it('query-nya nyantumin radius & kelas jalan yang bener', async () => {
      const spy = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ elements: [] }) });
      global.fetch = spy;
      await service.isJalurVital(-6.2, 106.8);
      const calls = spy.mock.calls as unknown as [string, { body: URLSearchParams }][];
      const body = calls[0][1].body.get('data');
      expect(body).toContain('around:200,-6.2,106.8');
      expect(body).toContain('motorway|trunk|primary|secondary');
      expect(body).not.toContain('tertiary');
    });
  });

  describe('GeminiEmbeddingService', () => {
    const service = new GeminiEmbeddingService();

    it('balikin null (bukan throw) waktu Gemini mati', async () => {
      process.env.GEMINI_API_KEY = 'key-palsu';
      global.fetch = jest.fn().mockRejectedValue(new Error('ETIMEDOUT'));
      await expect(service.embed('jalan berlubang')).resolves.toBeNull();
    });
  });
});
