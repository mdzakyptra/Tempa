# Aspiraku — Antrean Kota

Aspiraku adalah aplikasi pelaporan kerusakan infrastruktur publik yang membuat alasan di balik urutan penanganan dapat dilihat warga. Laporan tidak hanya diurutkan dari waktu kirim, tetapi dari skor prioritas yang memadukan risiko, dampak, waktu tunggu, dan relevansi jalur vital.

## Tujuan

- Membantu warga mengirim laporan kerusakan dengan lokasi dan foto yang presisi.
- Menampilkan antrean penanganan yang terbuka, dapat difilter, dan dipetakan.
- Menjelaskan alasan skor setiap laporan secara terurai.
- Memungkinkan warga mendukung laporan yang penting bagi mereka.
- Memberi petugas alur aman untuk memperbarui status penanganan.

## Fitur

| Area | Kemampuan |
| --- | --- |
| Landing page | Narasi produk interaktif, FAQ, dan navigasi menuju pelaporan atau antrean. |
| Antrean | Peta titik/heatmap, daftar berurut skor, filter kawasan dan jenis kerusakan, serta pagination. |
| Lapor baru | Pilih titik lewat GPS, pencarian, atau peta; validasi form; deteksi laporan serupa; unggah foto terkompresi. |
| Detail laporan | Skor total dan komponennya, foto, lokasi, status, riwayat status, dan dukungan warga. |
| Panel petugas | Akses terbatas untuk memperbarui status laporan dan meninjau antrean. |
| Asisten antrean | Tanya jawab berbasis data skor laporan yang tersedia. |
| Responsif | Layout diuji untuk mobile, tablet, dan desktop; menu serta panel memiliki perilaku khusus mobile. |

## Alur aplikasi

```mermaid
flowchart LR
  W[Warga] --> L[Lapor baru]
  L --> P[Pilih lokasi dan isi laporan]
  P --> S{Ada laporan serupa?}
  S -->|Ya| M[Gabungkan sebagai duplikat]
  S -->|Tidak| R[Buat laporan]
  M --> R
  R --> F[Unggah dan tautkan foto]
  R --> Q[Hitung skor prioritas]
  Q --> A[Antrean dan peta publik]
  A --> D[Detail laporan]
  D --> V[Dukungan warga]
  D --> T[Petugas memperbarui status]
  T --> H[Riwayat status]
```

### Perjalanan warga

1. Buka **Lapor Baru** lalu tandai titik kerusakan melalui GPS, pencarian lokasi, atau klik peta.
2. Isi kawasan, jenis kerusakan, tingkat bahaya, estimasi warga terdampak, judul, dan deskripsi.
3. Sistem menampilkan kandidat laporan serupa berdasarkan kawasan, jenis kerusakan, serta kemiripan makna teks.
4. Warga dapat menautkan laporan sebagai duplikat atau melanjutkan membuat laporan baru.
5. Setelah laporan dibuat, foto dapat dikompresi di browser, diunggah langsung ke object storage dengan presigned URL, lalu ditautkan ke laporan.
6. Laporan muncul di antrean publik bersama skor dan lokasi. Warga lain dapat masuk lalu memberikan dukungan.
7. Saat petugas mengubah status, riwayatnya tersedia pada detail laporan.

### Perjalanan petugas

1. Masuk dengan akun petugas yang email-nya juga terdaftar pada `PETUGAS_PANEL_EMAILS`.
2. Buka **Panel Petugas** atau detail laporan dari antrean.
3. Tinjau konteks lokasi, foto, jumlah dukungan, dan rincian skor.
4. Perbarui status laporan. Backend mencatat perubahan sebagai riwayat status.

## Model prioritas

Skor akhir berada pada rentang 0–100 dan diurutkan menurun. Jika skornya sama, laporan yang lebih lama didahulukan.

| Komponen | Bobot | Makna |
| --- | ---: | --- |
| Tingkat bahaya | 35% | Risiko dari rendah sampai darurat. |
| Warga terdampak | 25% | Dampak relatif terhadap laporan aktif lain. |
| Lama menunggu | 20% | Menaik seiring waktu agar laporan lama tidak terabaikan. |
| Jalur vital | 20% | Penanda untuk lokasi yang termasuk jalur layanan penting. |

Komponen skor ditampilkan pada detail laporan dan halaman Metodologi. Duplikat tidak dihapus; laporan tersebut ditautkan ke laporan utama agar jejak dan dukungan tetap terjaga tanpa menghitung prioritas ganda.

## Arsitektur

```text
Browser (React + Vite + Tailwind)
  ├─ peta 3D / Mapbox dan geocoding lokasi
  ├─ React Query untuk data server
  ├─ Motion untuk transisi antarmuka
  └─ upload foto langsung ke object storage
             │ HTTP JSON + Bearer token
             ▼
API (NestJS)
  ├─ autentikasi JWT + refresh token
  ├─ laporan, skor, vote, status, foto, dan AI assistant
  ├─ validasi DTO, CORS, Helmet, rate limiting
  └─ Swagger di /api/docs
             │
             ├──────── PostgreSQL + pgvector (Prisma)
             └──────── S3-compatible storage / Cloudflare R2
```

## Tech Stack

| Lapisan | Teknologi | Peran |
| --- | --- | --- |
| Frontend | React 19, TypeScript, Vite | SPA cepat dengan type safety dan development server. |
| UI | Tailwind CSS 4, Lucide, Motion | Styling responsif, ikon, dan animasi/transisi antarmuka. |
| Routing & data | React Router 7, TanStack Query | Route aplikasi, cache, mutation, serta pengambilan data API. |
| Visualisasi lokasi | Mapbox GL, D3, Three.js, React Three Fiber | Peta interaktif, globe, heatmap, dan visual landing page. |
| Backend | NestJS 11, TypeScript | REST API modular dan terdokumentasi. |
| Database | PostgreSQL 16, pgvector, Prisma 7 | Data aplikasi, migrasi, query skor, dan pencarian kemiripan berbasis embedding. |
| Autentikasi | JWT, refresh token, bcrypt | Sesi aman dan penyimpanan password ter-hash. |
| API quality | Swagger, class-validator, Helmet, Throttler | Dokumentasi API, validasi input, header keamanan, dan rate limiting. |
| Storage foto | Cloudflare R2 / S3-compatible API, presigned URL | Upload foto langsung dari browser tanpa membebani API. |
| Infrastruktur lokal | Docker Compose, pgvector image, MinIO | Menjalankan database dan object storage secara lokal. |
| Layanan eksternal | Mapbox, Nominatim, Gemini, Groq | Peta, pencarian lokasi, embedding semantik, dan asisten tanya jawab. |

## Struktur repositori

```text
.
├── apps/
│   ├── frontend/              # React/Vite
│   │   ├── src/pages/         # Route-level pages
│   │   ├── src/components/    # UI dan fitur
│   │   └── src/lib/           # API client, auth, geocoding
│   └── backend/               # NestJS
│       ├── src/               # Modul API
│       ├── prisma/schema.prisma
│       ├── prisma/migrations/
│       └── prisma/seed.ts
├── docker-compose.yml         # PostgreSQL + MinIO lokal
└── package.json               # npm workspaces
```

## Menjalankan secara lokal

### Prasyarat

- Node.js 20 atau lebih baru.
- Docker dan Docker Compose.
- Token Mapbox untuk peta lengkap.
- API key Gemini untuk deteksi laporan serupa berbasis makna.
- API key Groq bila ingin memakai asisten tanya jawab.
- Kredensial S3/R2 bila ingin menguji upload foto sungguhan.

### 1. Instal dependensi dan layanan lokal

```bash
git clone <url-repositori>
cd Tempa
npm install
docker compose up -d
```

Docker Compose menyalakan PostgreSQL pada port `5432` dan MinIO pada port `9000`; konsol MinIO tersedia pada `9001`.

### 2. Konfigurasi environment

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

Nilai minimum untuk pengembangan lokal:

```dotenv
# apps/backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/antrean_kota"
PORT=3000
JWT_ACCESS_SECRET="ganti-dengan-secret-acak"
JWT_REFRESH_SECRET="ganti-dengan-secret-acak-lain"
CORS_ORIGINS="http://localhost:5173"
GEMINI_API_KEY=<api-key-gemini>
GROQ_API_KEY=<api-key-groq>

# apps/frontend/.env
VITE_API_URL=http://localhost:3000
VITE_MAPBOX_TOKEN=<token-mapbox>
```

Isi variabel lainnya dari `.env.example` sesuai fitur yang akan diuji. Jangan memasukkan file `.env` atau secret ke Git.

### 3. Buat skema dan data contoh

```bash
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
cd ../..
```

Seed dijalankan setelah migrasi agar data contoh, titik lokasi, dan akun pengembangan mengikuti struktur database saat ini.

### 4. Jalankan aplikasi

Gunakan dua terminal dari root repositori:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

Buka aplikasi di `http://localhost:5173`, API di `http://localhost:3000`, dan dokumentasi interaktif API di `http://localhost:3000/api/docs`.

## Perintah penting

| Tujuan | Perintah dari root |
| --- | --- |
| Frontend development | `npm run dev:frontend` |
| Backend development | `npm run dev:backend` |
| Build frontend | `npm run build:frontend` |
| Build backend | `npm run build:backend` |
| Lint frontend | `npm run lint --workspace apps/frontend` |
| Test backend | `npm run test --workspace apps/backend` |
| Migrasi database | `npm run prisma:migrate --workspace apps/backend` |
| Seed database | `npm run prisma:seed --workspace apps/backend` |

Sebelum mengirim perubahan, jalankan lint lalu build pada bagian yang diubah. Build frontend menjalankan type-check TypeScript sebelum Vite build.

## Rute antarmuka

| Rute | Deskripsi |
| --- | --- |
| `/` | Landing page Aspiraku. |
| `/auth` | Masuk dan pendaftaran akun. |
| `/antrean` | Antrean publik, peta, heatmap, dan daftar laporan. |
| `/laporan/:id` | Detail laporan; dapat menjadi overlay ketika dibuka dari antrean. |
| `/lapor-baru` | Form pengiriman laporan. |
| `/lapor-baru/hasil/:id` | Konfirmasi laporan dan alur foto. |
| `/metodologi` | Penjelasan bobot dan metode prioritas. |
| `/panel-petugas` | Panel perubahan status bagi petugas yang diizinkan. |

## Ringkasan API

Semua respons normal dibungkus oleh interceptor backend. Swagger adalah referensi kontrak paling lengkap dan selalu mengikuti DTO yang berjalan.

| Kelompok | Endpoint utama | Kegunaan |
| --- | --- | --- |
| Health | `GET /health` | Mengecek API dan koneksi database. |
| Auth | `POST /auth/register`, `/login`, `/refresh`, `/logout` | Akun dan token sesi. |
| Reports | `GET/POST /reports`, `GET /reports/:id` | Membaca dan membuat laporan. |
| Similarity | `GET /reports/similar`, `POST /reports/:id/merge` | Deteksi serta tautan duplikat. |
| Votes | `POST /votes` | Dukungan warga; wajib autentikasi. |
| Status | `PATCH /reports/:reportId/status`, `GET /reports/:reportId/status-history` | Perubahan dan riwayat status. |
| Photos | `POST /photos/presigned-upload`, `GET/POST /photos` | Upload langsung dan tautkan foto. |
| AI | `POST /ai-assistant/ask` | Tanya jawab mengenai antrean atau laporan. |

## Keamanan dan batasan

- `ValidationPipe` global memakai whitelist dan menolak field yang tidak dikenal.
- Helmet, CORS berbasis `CORS_ORIGINS`, serta rate limiting diterapkan pada backend.
- Endpoint login dan daftar dibatasi 5 permintaan/menit/IP; membuat laporan 10/menit/IP; vote 20/menit/IP; batas global 100/menit/IP.
- Access token berdurasi pendek dan refresh token disimpan terpisah.
- Panel petugas memakai peran akun dan allow-list `PETUGAS_PANEL_EMAILS`; gate frontend hanya untuk UX, otorisasi sebenarnya ada di backend.
- Foto tidak melewati server aplikasi saat upload: klien memakai presigned URL dari API.

## Catatan pengembangan

- `kawasan` adalah atribut lokasi administratif yang saat ini tersimpan pada laporan. Kota/provinsi belum menjadi kolom data tersendiri; filter tersebut perlu perubahan skema, API, form, dan migrasi sebelum dapat dibuat akurat.
- Peta memerlukan `VITE_MAPBOX_TOKEN`. Tanpanya, aplikasi tetap dapat berjalan tetapi area peta menampilkan pesan bahwa peta belum aktif.
- Gemini (`GEMINI_API_KEY`) membuat embedding untuk mendeteksi kemiripan makna antar laporan. Bila layanannya tidak tersedia, pembuatan laporan tetap berhasil, tetapi skor kemiripan semantik tidak tersedia.
- Asisten memerlukan `GROQ_API_KEY`. Siapkan key tersebut untuk menguji jawaban AI berbasis data laporan.
- Untuk deployment, isi CORS dengan domain frontend produksi, gunakan database terkelola PostgreSQL+pgvector, dan atur URL publik object storage/CDN pada `S3_PUBLIC_URL`.

## Kontribusi

1. Buat branch kerja untuk satu tugas yang terfokus.
2. Jaga perubahan tetap kecil dan sertakan migrasi/seed pada tahap fitur data yang relevan.
3. Uji tampilan pada mobile, tablet, dan desktop untuk perubahan antarmuka.
4. Jalankan lint dan build sebelum meminta review.
5. Jangan commit secret, file `.env`, output build, atau data produksi.

## Lisensi

Kode ini disiapkan untuk proyek Antrean Kota/Aspiraku. Lisensi dan ketentuan distribusi mengikuti keputusan pemilik repositori.
