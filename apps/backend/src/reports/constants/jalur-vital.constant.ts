// Klasifikasi jalur vital pakai Overpass API (data OpenStreetMap) — lihat
// jalur-vital.service.ts. Sempat pakai Mapbox Tilequery, tapi layer POI-nya
// kosong buat mayoritas titik di Indonesia (diuji di Surakarta: SMA N 8 nggak
// kebaca sampai radius 500m, padahal OSM punya datanya). OSM juga nggak butuh
// token.
export const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

// Overpass publik kadang lambat (terukur 0,8 detik pas hangat, 12 detik pas
// cold). Ini dipanggil pas warga submit laporan, jadi dibatasi ketat —
// lewat batas, jatuh ke fail-open (jalur_vital = false), submit tetap cepat.
export const JALUR_VITAL_TIMEOUT_MS = 3000;

export const JALUR_VITAL_POI_RADIUS_METER = 200;
export const JALUR_VITAL_ROAD_RADIUS_METER = 150;

// Sengaja nggak masukin `tertiary` — kelas itu terlalu umum, hampir semua
// laporan bakal kehitung vital dan bobot 20%-nya kehilangan daya pembeda.
export const JALUR_VITAL_ROAD_CLASS = 'motorway|trunk|primary|secondary';
export const JALUR_VITAL_AMENITY = 'school|hospital|clinic|university';
