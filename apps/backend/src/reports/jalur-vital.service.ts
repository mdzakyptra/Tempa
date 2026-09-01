import { Injectable, Logger } from '@nestjs/common';
import {
  JALUR_VITAL_RADIUS_METER,
  JALUR_VITAL_POI_MAKI,
  JALUR_VITAL_ROAD_CLASS,
} from './constants/jalur-vital.constant';


interface TilequeryFeature {
  properties?: {
    class?: string;
    maki?: string;
    tilequery?: { layer?: string };
  };
}

interface TilequeryResponse {
  features?: TilequeryFeature[];
}

// Sama kayak GeminiEmbeddingService — gagal manggil Mapbox (token belum
// diset, rate limit, down) sengaja nggak throw, balikin false, biar create
// laporan tetap sukses. Mending jalur_vital salah "tidak" daripada bikin
// warga gagal lapor gara-gara Mapbox down.
//<---------- JalurVitalService -------------->
@Injectable()
export class JalurVitalService {
  private readonly logger = new Logger(JalurVitalService.name);

  //<---------- isJalurVital -------------->
  // Vital kalau titiknya ada di jalan kelas utama, ATAU ada sekolah/RS di
  // sekitarnya. Satu request Tilequery nutup dua-duanya — layer asalnya
  // dibedain lewat properties.tilequery.layer.
  async isJalurVital(lat: number, lng: number): Promise<boolean> {
    const token = process.env.MAPBOX_TOKEN;
    if (!token) {
      this.logger.warn('MAPBOX_TOKEN belum diatur, skip cek jalur vital');
      return false;
    }

    const url =
      `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${lng},${lat}.json` +
      `?radius=${JALUR_VITAL_RADIUS_METER}&limit=50&access_token=${token}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        this.logger.warn(`Tilequery gagal (${response.status}), skip cek jalur vital`);
        return false;
      }

      const data = (await response.json()) as TilequeryResponse;
      const features = data.features ?? [];

      return features.some((feature) => {
        const props = feature.properties;
        const layer = props?.tilequery?.layer;

        if (layer === 'poi_label') return JALUR_VITAL_POI_MAKI.includes(props?.maki ?? '');
        if (layer === 'road') return JALUR_VITAL_ROAD_CLASS.includes(props?.class ?? '');
        return false;
      });
    } catch (error) {
      this.logger.warn(`Tilequery error, skip cek jalur vital: ${(error as Error).message}`);
      return false;
    }
  }
}
