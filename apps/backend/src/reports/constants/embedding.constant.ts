export const GEMINI_EMBEDDING_MODEL = 'gemini-embedding-001';
export const GEMINI_EMBEDDING_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_EMBEDDING_MODEL}:embedContent`;

// Cocok sama kolom `embedding vector(768)` di schema.prisma — jangan diubah
// sendiri-sendiri, vektor lama jadi nggak sebanding kalau dimensi beda.
export const EMBEDDING_DIMENSIONS = 768;

// Ambang skor kemiripan kosinus (0-1) buat dianggap "kemungkinan duplikat".
// Dikalibrasi manual lewat gemini-embedding-001 (27 Agustus 2026) pakai
// contoh dari CLAUDE.md, hasilnya:
//   - Parafrase makna sama ("jalan berlubang" vs "aspal ambles")   -> 0.89
//   - Kalimat identik (kontrol atas)                               -> 1.00
//   - Topik beda tapi sama-sama infrastruktur (jalan vs lampu/      -> 0.70-0.75
//     drainase/trotoar)
// Jarak amannya di antara 0.75 dan 0.89 — dipilih 0.82 biar nggak kepancing
// laporan yang cuma sama-sama "infrastruktur kota" tapi beda masalah.
// Sesuaikan lagi kalau data seed asli (JEK-28) kasih pola berbeda.
export const SIMILARITY_THRESHOLD = 0.82;
