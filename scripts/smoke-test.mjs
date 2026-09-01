// Smoke test alur demo end-to-end lawan API yang lagi jalan.
// Jalanin: node scripts/smoke-test.mjs [BASE_URL]
// Default hantam production. Buat lokal: node scripts/smoke-test.mjs http://localhost:3000
//
// Butuh kredensial petugas buat step ubah status:
//   PETUGAS_EMAIL=... PETUGAS_PASSWORD=... node scripts/smoke-test.mjs
// Kalau gak diisi, step petugas di-skip (sisanya tetap jalan).
import assert from 'node:assert/strict';

const BASE = process.argv[2] ?? 'https://tempa-production-5de1.up.railway.app';
const EMAIL = process.env.PETUGAS_EMAIL;
const PASSWORD = process.env.PETUGAS_PASSWORD;

let passed = 0;
let failed = 0;
let skipped = 0;

//<---------- step -------------->
async function step(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`PASS  ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`FAIL  ${name}\n      ${error.message}`);
  }
}

//<---------- api -------------->
// Semua endpoint balikin envelope { success, message, data } (JEK-9).
async function api(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const json = await response.json().catch(() => null);
  return { status: response.status, json, data: json?.data };
}

async function main() {
  console.log(`Smoke test: ${BASE}\n`);

  await step('/health sehat + DB nyambung', async () => {
    const { status, data } = await api('/health');
    assert.equal(status, 200, `status ${status}`);
    assert.equal(data?.status, 'ok');
    assert.equal(data?.database, 'up', 'database bukan "up"');
  });

  let reports = [];
  await step('GET /reports balikin daftar terurut skor (tinggi dulu)', async () => {
    const { status, data } = await api('/reports');
    assert.equal(status, 200, `status ${status}`);
    assert.ok(Array.isArray(data), 'data bukan array');
    assert.ok(data.length > 0, 'daftar laporan kosong — demo butuh data');
    reports = data;

    const skor = data.map((r) => r.skor);
    const terurut = [...skor].sort((a, b) => b - a);
    assert.deepEqual(skor, terurut, 'urutan skor gak menurun');
  });

  await step('Rincian skor terbuka (4 komponen + bobot benar)', async () => {
    const laporan = reports[0];
    const k = laporan?.skor_komponen;
    assert.ok(k, 'skor_komponen gak ada');
    for (const key of ['bahaya', 'terdampak', 'lama_menunggu', 'jalur_vital']) {
      assert.equal(typeof k[key], 'number', `komponen ${key} bukan angka`);
    }

    // Skor total harus cocok sama bobot yang dipublikasi di /metodologi.
    const hitung = k.bahaya * 0.35 + k.terdampak * 0.25 + k.lama_menunggu * 0.2 + k.jalur_vital * 0.2;
    assert.ok(
      Math.abs(hitung - laporan.skor) < 0.5,
      `skor ${laporan.skor} gak cocok sama hitungan komponen ${hitung.toFixed(2)}`,
    );
  });

  await step('CORS ngizinin domain frontend produksi', async () => {
    const response = await fetch(`${BASE}/health`, {
      headers: { Origin: 'https://www.aspiraku.my.id' },
    });
    assert.equal(
      response.headers.get('access-control-allow-origin'),
      'https://www.aspiraku.my.id',
      'header CORS gak balik — frontend bakal ke-block',
    );
  });

  await step('Asisten AI jawab pakai data skor asli', async () => {
    const { status, data } = await api('/ai-assistant/ask', {
      method: 'POST',
      body: { pertanyaan: 'Kenapa laporan teratas ada di posisi pertama?', report_id: reports[0]?.id },
    });
    assert.equal(status, 201, `status ${status}`);
    assert.ok(data?.jawaban?.length > 20, 'jawaban kosong/kependekan');
  });

  if (!EMAIL || !PASSWORD) {
    skipped += 1;
    console.log('SKIP  Login petugas + ubah status (set PETUGAS_EMAIL & PETUGAS_PASSWORD)');
  } else {
    let token = null;

    await step('Login petugas dapat access token', async () => {
      const { status, data } = await api('/auth/login', {
        method: 'POST',
        body: { email: EMAIL, password: PASSWORD },
      });
      assert.equal(status, 200, `status ${status}`);
      assert.ok(data?.accessToken, 'accessToken gak ada');
      token = data.accessToken;
    });

    await step('Petugas bisa ubah status laporan (momen demo)', async () => {
      assert.ok(token, 'gak ada token dari step sebelumnya');
      const laporan = reports[0];
      const balik = laporan.status === 'menunggu' ? 'diproses' : 'menunggu';

      const { status, data } = await api(`/reports/${laporan.id}/status`, {
        method: 'PATCH',
        token,
        body: { status: balik, catatan: 'smoke test' },
      });
      assert.equal(status, 200, `status ${status}`);
      assert.equal(data?.status, balik, 'status gak berubah');

      // Balikin lagi biar data demo gak berubah gara-gara test.
      await api(`/reports/${laporan.id}/status`, {
        method: 'PATCH',
        token,
        body: { status: laporan.status, catatan: 'smoke test rollback' },
      });
    });
  }

  console.log(`\n${passed} pass, ${failed} fail, ${skipped} skip`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
