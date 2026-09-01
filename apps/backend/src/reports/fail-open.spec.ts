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

    beforeEach(() => {
      process.env.MAPBOX_TOKEN = 'token-palsu';
    });

    it('balikin false (bukan throw) waktu Mapbox nolak', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 429 });
      await expect(service.isJalurVital(-6.2, 106.8)).resolves.toBe(false);
    });

    it('balikin false (bukan throw) waktu jaringan mati', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'));
      await expect(service.isJalurVital(-6.2, 106.8)).resolves.toBe(false);
    });

    it('balikin false waktu MAPBOX_TOKEN belum diatur', async () => {
      delete process.env.MAPBOX_TOKEN;
      global.fetch = jest.fn();
      await expect(service.isJalurVital(-6.2, 106.8)).resolves.toBe(false);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('true kalau ada sekolah/RS dekat titik', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          features: [{ properties: { maki: 'hospital', tilequery: { layer: 'poi_label' } } }],
        }),
      });
      await expect(service.isJalurVital(-6.2, 106.8)).resolves.toBe(true);
    });

    it('true di jalan kelas utama, termasuk tertiary (hasil kalibrasi)', async () => {
      for (const kelas of ['primary', 'tertiary']) {
        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({
            features: [{ properties: { class: kelas, tilequery: { layer: 'road' } } }],
          }),
        });
        await expect(service.isJalurVital(-6.2, 106.8)).resolves.toBe(true);
      }
    });

    it('false kalau cuma jalan kecil / POI biasa di sekitar', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          features: [
            { properties: { class: 'street', tilequery: { layer: 'road' } } },
            { properties: { class: 'service', tilequery: { layer: 'road' } } },
            { properties: { maki: 'restaurant', tilequery: { layer: 'poi_label' } } },
          ],
        }),
      });
      await expect(service.isJalurVital(-6.2, 106.8)).resolves.toBe(false);
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
