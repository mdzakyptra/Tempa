// Klasifikasi jalur vital pakai Mapbox Tilequery API (lihat
// jalur-vital.service.ts) — cek POI/jalan asli di sekitar titik laporan,
// bukan daftar kawasan manual. Konstanta di sini cuma nentuin "deket"
// (radius) dan kategori mana yang dianggap vital.
export const JALUR_VITAL_RADIUS_METER = 150;

// properties.maki dari layer poi_label — cek langsung lewat curl Tilequery,
// bukan tebakan (school & hospital konfirmasi ada di data OSM Indonesia).
export const JALUR_VITAL_POI_MAKI: readonly string[] = ['school', 'college', 'hospital'];

// properties.class dari layer road — kelas jalan utama.
export const JALUR_VITAL_ROAD_CLASS: readonly string[] = ['motorway', 'trunk', 'primary', 'secondary'];
