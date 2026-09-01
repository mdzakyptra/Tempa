// Klasifikasi jalur vital pakai Mapbox Tilequery API — lihat
// jalur-vital.service.ts.
//
// Sempat dicoba Overpass API (data OSM lebih lengkap buat POI Indonesia),
// tapi ditolak: latensinya nggak stabil (terukur 1,2 / 5,5 / >8 detik buat
// titik yang sama karena antrean per-IP), jadi skor laporan nggak
// deterministik — koordinat sama bisa true lalu false. Mirror kumi.systems
// & private.coffee malah balik 502. Mapbox stabil ~200ms.
export const JALUR_VITAL_RADIUS_METER = 150;

// properties.maki dari layer poi_label. Cakupannya tipis di Indonesia
// (terukur cuma 5% dari 60 laporan nyata yang kedeteksi), jadi ini bonus,
// bukan andalan — penentu utamanya kelas jalan di bawah.
export const JALUR_VITAL_POI_MAKI: readonly string[] = ['school', 'college', 'hospital'];

// properties.class dari layer road. Ambangnya dikalibrasi ke 60 laporan
// nyata di production: motorway/trunk/primary/secondary kena 25% laporan,
// ditambah tertiary jadi 32% — masih tajam karena mayoritas laporan (48%)
// ada di kelas `street`. `street` & `service` sengaja di luar daftar.
export const JALUR_VITAL_ROAD_CLASS: readonly string[] = [
  'motorway',
  'trunk',
  'primary',
  'secondary',
  'tertiary',
];
