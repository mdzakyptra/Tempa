-- JEK-58: index vektor buat kolom `embedding`, supaya pencarian kemiripan
-- (JEK-19, cosine distance operator `<=>`) nggak full-scan pas data udah
-- banyak. HNSW dipilih daripada IVFFlat karena: skala aplikasi ini kecil
-- (ratusan-ribuan laporan, bukan jutaan), HNSW nggak butuh parameter `lists`
-- yang perlu di-retune seiring data nambah kayak IVFFlat, dan recall-nya
-- lebih bagus di skala kecil. Opclass `vector_cosine_ops` cocok sama
-- operator `<=>` yang udah dipakai di seluruh kode (GeminiEmbeddingService,
-- findSimilar()). m=16, ef_construction=64 adalah default pgvector sendiri
-- — dituliskan eksplisit di sini biar kelihatan di migration history kalau
-- suatu saat perlu di-tuning ulang.
--
-- Pakai CREATE INDEX biasa (bukan CONCURRENTLY) — ini migrasi ke DB dev
-- lokal, nggak ada concurrent writer pas migrasi jalan.
CREATE INDEX IF NOT EXISTS "reports_embedding_hnsw_idx"
  ON "reports" USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
