import { Injectable, Logger } from '@nestjs/common';
import {
  OVERPASS_URL,
  JALUR_VITAL_TIMEOUT_MS,
  JALUR_VITAL_POI_RADIUS_METER,
  JALUR_VITAL_ROAD_RADIUS_METER,
  JALUR_VITAL_ROAD_CLASS,
  JALUR_VITAL_AMENITY,
} from './constants/jalur-vital.constant';


interface OverpassResponse {
  elements?: unknown[];
}

// Sama kayak GeminiEmbeddingService — gagal manggil Overpass (down, lambat,
// rate limit) sengaja nggak throw, balikin false, biar create laporan tetap
// sukses. Mending jalur_vital salah "tidak" daripada warga gagal lapor.
//<---------- JalurVitalService -------------->
@Injectable()
export class JalurVitalService {
  private readonly logger = new Logger(JalurVitalService.name);

  //<---------- isJalurVital -------------->
  // Vital kalau di sekitar titik ada sekolah/RS/klinik/kampus, ATAU titiknya
  // pas di jalan kelas utama. Satu query Overpass buat dua-duanya — cukup
  // tahu ADA atau NGGAK, jadi `out ids 1` (berhenti di hasil pertama).
  async isJalurVital(lat: number, lng: number): Promise<boolean> {
    const query = `[out:json][timeout:10];(nwr["amenity"~"^(${JALUR_VITAL_AMENITY})$"](around:${JALUR_VITAL_POI_RADIUS_METER},${lat},${lng});way["highway"~"^(${JALUR_VITAL_ROAD_CLASS})$"](around:${JALUR_VITAL_ROAD_RADIUS_METER},${lat},${lng}););out ids 1;`;

    try {
      const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        // User-Agent wajib: Overpass nolak request tanpa UA yang jelas
        // dengan 406, dan kebijakan pemakaian OSM minta aplikasi
        // mengidentifikasi diri.
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Aspiraku/1.0 (https://www.aspiraku.my.id)',
        },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(JALUR_VITAL_TIMEOUT_MS),
      });

      if (!response.ok) {
        this.logger.warn(`Overpass gagal (${response.status}), skip cek jalur vital`);
        return false;
      }

      const data = (await response.json()) as OverpassResponse;
      return (data.elements?.length ?? 0) > 0;
    } catch (error) {
      this.logger.warn(`Overpass error, skip cek jalur vital: ${(error as Error).message}`);
      return false;
    }
  }
}
