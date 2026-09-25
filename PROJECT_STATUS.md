# 📍 Status & Kondisi Terkini Proyek: Isyara WebApp

> Dokumen ini diperbarui secara berkala sebagai **Single Source of Truth** untuk developer dan AI Coding Agent (Claude Code, Cursor, Windsurf, Copilot, dll.) agar langsung memahami kondisi website tanpa halusinasi.
> Terakhir diperbarui: 25 September 2026
---

## 1. Ringkasan Proyek
- **Nama Aplikasi**: Isyara (`isyara-webapp`)
- **Tujuan**: Aplikasi web modern penerjemah Bahasa Isyarat Indonesia (BISINDO) A-Z real-time berbasis browser (100% on-device AI inference), dilengkapi modul kamus dan pembelajaran interaktif.
- **Teknologi Utama**:
  - Next.js 16.3 (App Router, Turbopack)
  - React 19.2 + TypeScript 5
  - Tailwind CSS v4 (@tailwindcss/postcss) & shadcn/ui
  - @mediapipe/tasks-vision (Hand Landmarker 21 titik)
  - Vitest v5 (Testing runner)

---

## 2. Fitur & Halaman (Status per 25 September 2026)

> Legenda: ✅ Selesai · 🟡 Sebagian (UI ada, logika inti belum) · ⬜ Belum dimulai

### A. Routing & Halaman (`src/app/`)
| Rute | Status | Komponen Utama | Keterangan |
| :--- | :---: | :--- | :--- |
| `/` | ✅ Selesai | `src/app/page.tsx`, `CtaSection`, `HowItWorksSection`, `VisiSection`, `VisualBanner` | Landing page komprehensif, responsif, dan interaktif. |
| `/dictionary` | ✅ Selesai | `src/app/dictionary/page.tsx`, `DictionaryBrowser.tsx`, `src/lib/dictionary/data.ts` | Kamus gestur A-Z dengan pencarian, filter tipe tangan, dan panel detail isyarat. Dataset 26 huruf kini **satu sumber kebenaran** di `src/lib/dictionary/data.ts` (dipakai juga oleh landing page & Learn hub). |
| `/learn` | 🟡 Sebagian | `src/app/learn/page.tsx` | UI hub belajar + kartu progres sudah ada. Guided lesson, Practice Mode, dan Quiz Mode belum diimplementasikan (Phase 3). |
| `/translate` | 🟡 Sebagian | `src/app/translate/page.tsx`, `TranslateClient.tsx`, `WebcamView.tsx`, `CanvasOverlay.tsx` | Deteksi 21 landmark per tangan (maks. 2 tangan) real-time + **overlay skeleton kanvas dual-warna (Kiri/Kanan) aktif** (Day 6). **Belum ada** klasifikasi huruf (Phase 2). |

### B. Custom Hooks & Integrasi MediaPipe (`src/hooks/` & `src/lib/`)
- `src/hooks/useWebcam.ts`: Pengelolaan stream WebRTC, penanganan permission kamera, resolusi, dan unmount cleanup.
- `src/hooks/useMediaPipe.ts`: Inisialisasi model MediaPipe HandLandmarker (singleton, dimuat maks. sekali per mount) dan penyedia fungsi `detect()` per frame.
- `src/lib/mediapipe/handLandmarker.ts`: Loader instance MediaPipe Tasks Vision WASM, pemformatan hasil deteksi, dan pemetaan error `E-MP-001`/`E-MP-002`.
- `src/lib/mediapipe/handSkeleton.ts`: Topologi 21 landmark (`HAND_CONNECTIONS`), palette warna Kiri (sky) / Kanan (amber), pemetaan koordinat `object-cover` + mirror (`x' = 1 - x`), dan renderer skeleton berbasis kontrak kanvas (testable tanpa DOM).
- `src/lib/tensorflow/normalize.ts`: Normalisasi dual-hand 126 fitur (SRD §5.1) — centering relatif wrist per tangan, penskalaan `max Euclidean distance` (invarian ukuran/jarak), slot deterministik Kiri `0..62` / Kanan `63..125` dengan zero-padding, plus validasi input §5.6. **Ini kontrak yang wajib direplikasi oleh pipeline Python di `training/`.** Diekspor juga `LANDMARKS_PER_HAND`, `FEATURES_PER_HAND`, dan `TOTAL_FEATURES` sebagai satu-satunya sumber angka 21/63/126 untuk seluruh UI.
- `src/lib/dictionary/data.ts`: Dataset alfabet BISINDO 26 huruf (`BISINDO_ALPHABET`) + helper `findSign`, `getSignTypeLabel`, `countSignsByType`, `getLearnPreviewLetters`. Modul bebas `"use client"` agar bisa dipakai server & client component.
- `src/lib/constants.ts`: Konstanta proyek bersama (`GITHUB_REPO_URL`, `APP_NAME`, `APP_TAGLINE`) untuk mencegah duplikasi tautan/nama di Header & Footer.
- `src/components/webcam/CanvasOverlay.tsx`: Komponen kanvas DPR-aware yang menggambar skeleton 2 tangan di atas video (outline gelap + tulang berwarna + 21 joint + chip label "Kiri"/"Kanan").
- `src/components/webcam/WebcamView.tsx`: Menyediakan slot `children` (node **atau** render-prop `{ mirrored }`) sehingga overlay selalu sinkron dengan status cermin.
- `src/components/translate/TranslateClient.tsx`: Pemilik loop deteksi `requestAnimationFrame`, panel inspeksi hasil, legenda warna, dan toggle tampil/sembunyi skeleton.
- `src/lib/logger.ts` & `src/lib/utils.ts`: Logging terstandar dan utility helper styling (`cn`).

> **Catatan penting**: klasifikasi huruf A-Z **belum berjalan**. Yang aktif saat ini adalah pelacakan koordinat tangan + visualisasi skeleton. Agar fitur terjemahan benar-benar berfungsi, Phase 2 (training model TF.js) harus diselesaikan lebih dulu.

### C. Health, Lint & Testing Suite (`tests/`)

| Pemeriksaan | Perintah | Status |
| :--- | :--- | :---: |
| Unit & integration test | `npm.cmd test` | ✅ 150/150 lulus (14 suite) |
| Coverage gate (target SRD §9.2 ≥ 80%) | `npm.cmd run test:coverage` | ✅ 97.0% lines · 85.0% branches |
| Lint (ESLint 9 + eslint-config-next) | `npm.cmd run lint` | ✅ 0 error, 0 warning |
| Type check | `npx.cmd tsc --noEmit` | ✅ bersih |
| Production build | `npm.cmd run build` | ✅ sukses (5 rute statis) |

Rincian 14 suite pengujian (150 tes):

**Tier unit (pure logic)** — target SRD §9.2:
1. `tests/normalize.test.ts` (24) — layout 126 fitur, slot Kiri/Kanan, zero-padding, invariansi skala/translasi, validasi input §5.6
2. `tests/logger.test.ts` (8) — routing level, filter `setLogLevel`, format timestamp ISO, singleton
3. `tests/dictionaryData.test.ts` (12) — 26 huruf A-Z, kelengkapan record, lookup case-insensitive, label tipe tangan
4. `tests/utils.test.ts` (4)
5. `tests/mediapipe.test.ts` (15)
6. `tests/webcam.test.ts` (14)
7. `tests/canvasOverlay.test.ts` (22)
8. `tests/canvasOverlayComponent.test.tsx` (5)
9. `tests/handLandmarkerLifecycle.test.ts` (5) — guard SSR, reset, penanganan error deteksi
10. `tests/navigation.test.ts` (3)
11. `tests/home.test.ts` (7) — termasuk assertion bahwa konten banner berasal dari dataset kamus

**Tier integration (jsdom + React Testing Library)** — SRD §9.1:
12. `tests/useWebcam.integration.test.tsx` (11) — state machine §3.3, permission, disconnect, cleanup unmount
13. `tests/useMediaPipe.integration.test.tsx` (12) — load-once, progress, error mapping, timestamp injectable, `retry()`
14. `tests/handLandmarkerLoader.integration.test.tsx` (8) — dedup promise, GPU→CPU fallback, cache & reset

**Aturan regresi**: setiap perubahan kode wajib mempertahankan 150 tes tetap lulus, coverage tetap di atas gate 80%, **dan** lint tetap 0 error sebelum dianggap selesai.

---

## 3. Nuansa Teknis & Batasan Arsitektur Penting

1. **Client-side vs Server-side**:
   - Komponen kamera (`WebcamView.tsx`), MediaPipe (`useMediaPipe.ts`), dan `TranslateClient.tsx` **wajib** menyertakan direktif `'use client';` karena mengakses Web APIs (`navigator.mediaDevices`, `HTMLVideoElement`, `HTMLCanvasElement`, WASM).
2. **Environment Windows**:
   - Di PowerShell Windows, script `.ps1` diblokir oleh ExecutionPolicy standar. Gunakan selalu `npm.cmd` (contoh: `npm.cmd test`, `npm.cmd run dev`).
   - Output `git push` kadang tampak seperti error (`NativeCommandError`) karena git menulis progres ke stderr. Selalu konfirmasi dengan `git ls-remote origin main`.
3. **Tailwind CSS v4**:
   - Konfigurasi menggunakan `@tailwindcss/postcss` tanpa `tailwind.config.js` konvensional. Import style ada di `src/app/globals.css`.
4. **Model Klasifikasi (`public/model/`)**:
   - File model hasil training offline via Python (`training/`) dikonversi ke format web di `public/model/`. **Saat ini folder masih kosong** (hanya `.gitkeep`), begitu pula `training/`.
   - Format input tensor yang disepakati: **126 fitur** = 2 tangan × 21 landmark × 3 koordinat `(x, y, z)`. Tangan kiri menempati indeks `0..62`, tangan kanan `63..125`; slot tangan yang tidak terdeteksi diisi padding `0.0` (lihat `docs/IMPLEMENTATION_PLAN.md` §ML Pipeline).
5. **Aturan React Hooks (React 19 + eslint-plugin-react-hooks v7)**:
   - Dilarang memanggil `setState` secara sinkron di dalam body `useEffect` (rule `react-hooks/set-state-in-effect`) karena memicu cascading render.
   - Pola yang dipakai di proyek ini: state awal disemai dari props (`useState(autoLoad)`), pembaruan state dilakukan di *async continuation* (`.then`/`.catch`), atau didefer via `queueMicrotask`.
   - `ref.current` yang dibaca di dalam cleanup effect harus disalin ke variabel lokal saat effect berjalan.
6. **Tipe MediaPipe**:
   - Gunakan tipe resmi dari `@mediapipe/tasks-vision` (`HandLandmarker`, `NormalizedLandmark`, `Category`). Hindari `any`; bila butuh fixture ringan untuk test, pakai kontrak struktural seperti `RawLandmarkResult` / `VideoHandLandmarker` di `src/lib/mediapipe/handLandmarker.ts`.
7. **Overlay Skeleton & Cermin Video (Day 6)**:
   - `<video>` di-mirror via CSS (`scale-x-[-1]`) sedangkan wrapper `children` tidak. Proyeksi x karena itu memakai `x' = 1 - x` bila `mirrored` aktif (`projectLandmark`).
   - Video memakai `object-cover`, sehingga koordinat ternormalisasi tidak boleh dikalikan lebar kanvas secara langsung — gunakan `computeCoverTransform()` (uniform scale + offset tengah).
   - `CanvasOverlay` sengaja **tidak** memanggil `getBoundingClientRect()` di render; pengukuran & penggambaran dilakukan di dalam `useEffect` (kepatuhan `react-hooks/set-state-in-effect` dan aturan React refs).
   - Warna pembeda: **Kiri = sky-400 (`#38bdf8`)**, **Kanan = amber-400 (`#fbbf24`)**; legenda warna di panel `TranslateClient` memakai `getHandStyle()` sebagai satu-satunya sumber kebenaran palette.
8. **Stabilitas Hook & Callback (Day 7)**:
   - Opsi hook (`onStreamReady`, `onLoaded`, `onError`, `constraints`) disimpan di **ref** lalu disinkronkan lewat `useEffect`. Tanpa ini, arrow function inline dari parent akan mengubah identitas callback → effect mount ikut re-run → cleanup-nya **mematikan stream kamera yang sedang sehat**.
   - Effect mount/unmount di `useWebcam` memakai dependency `[]`; hanya unmount sungguhan yang melepas perangkat.
   - `useMediaPipe` menyediakan `retry()` untuk pulih dari `E-MP-001` (SRD §6.3) dan `detect(video, timestampMs?)` — timestamp eksplisit penting karena mode VIDEO MediaPipe mensyaratkan nilai yang **strictly increasing**; frame dengan timestamp tidak naik akan ditolak dan diam-diam hilang.
   - `normalizeLandmarks` mengembalikan `null` (bukan throw) untuk input tidak valid, dengan log `NORMALIZE_REJECTED`. Ini titik di mana `E-ML-002` akan dipetakan saat Phase 2.
9. **Sumber Angka 21/63/126**:
   - Selalu impor `LANDMARKS_PER_HAND` / `FEATURES_PER_HAND` / `TOTAL_FEATURES` dari `src/lib/tensorflow/normalize.ts`. Jangan tulis literal `21`, `63`, atau `126` di UI — kontrak model bisa berubah dan angka yang tersebar akan ikut basi.

---

## 4. Backlog / Target Pengembangan Selanjutnya

### 🔴 Prioritas Berikutnya (urutan eksekusi)
- [ ] **Phase 2 — Core ML Pipeline (Day 8–14)**: setup Python env + dataset BISINDO (Day 8), ekstraksi landmark 126 fitur (Day 9), normalisasi & augmentasi (Day 10), training Keras (Day 11), konversi ke TensorFlow.js (Day 12), lalu integrasi `useModel` + `usePrediction` (Day 13–14).
  - **Wajib**: pipeline Python harus mereplikasi `src/lib/tensorflow/normalize.ts` secara persis (urutan slot Kiri/Kanan, padding 0.0, skala per-tangan) agar model menerima distribusi fitur yang sama seperti saat inference.
- [ ] **Phase 2 — Smoothing buffer**: peredam getaran (buffer 7 frame, min consensus 4) pada hasil prediksi. **Bergantung pada Phase 2** karena belum ada output prediksi yang perlu dihaluskan. Kontrak `SmoothingBuffer` & test case-nya sudah tertulis di SRD §5.2 & §9.3.

### 🟡 Peningkatan Lanjutan
- [ ] Evaluasi performa rendering canvas dan FPS deteksi pada laptop/perangkat berspesifikasi hemat daya (kaitkan dengan mitigasi SRD §6.3: auto-detect FPS < 10 → turunkan resolusi ke 320×240, disable canvas overlay via prop `showSkeleton`).
- [ ] Peningkatan dataset training di `training/data/` untuk variasi sudut pencahayaan tangan.
- [ ] Phase 3 — Dictionary detail page per huruf, Guided Lesson, Practice Mode, Quiz Mode, dan progress tracking `localStorage`.
- [ ] Phase 4 — Dark mode, bilingual switcher (ID/EN), PWA, SEO, dan deploy ke Vercel.

### ✅ Baru Selesai (25 Sep 2026)
- [x] **Day 7 — Setup final Vitest + normalizer 126 fitur + review Minggu 1**: `src/lib/tensorflow/normalize.ts` (SRD §5.1) dengan 24 unit test; coverage gate v8 80% di `vitest.config.mts` + script `test:coverage`; tier integration (jsdom + React Testing Library) untuk `useWebcam`, `useMediaPipe`, dan loader MediaPipe.
- [x] **Perbaikan hasil review Minggu 1**: (a) callback & constraints hook dipindah ke ref sehingga stream tidak lagi mati saat parent re-render; (b) `useMediaPipe` mendapat `retry()` dan `detect()` menerima timestamp eksplisit; (c) dataset kamus 26 huruf diekstrak ke `src/lib/dictionary/data.ts` (menghapus duplikasi A/B/I/L di 3 file yang sudah saling menyimpang); (d) konstanta `GITHUB_REPO_URL`/`APP_NAME` terpusat; (e) a11y: `aria-pressed` pada filter kamus, `aria-label` pada input pencarian, `role="status"` pada panel detail, perbaikan heading jump, `aria-hidden` pada ikon dekoratif; (f) `MappedError` & `Handedness` sebagai tipe bersama; (g) hapus 5 SVG tak terpakai + dependency `cn` dan `framer-motion` yang tidak pernah diimpor.
- [x] **Day 6 — CanvasOverlay skeleton 2 tangan**: `handSkeleton.ts` (topologi 21 landmark, palette Kiri/Kanan, mapping `object-cover` + mirror), `CanvasOverlay.tsx` (DPR-aware, outline gelap, joint halo, chip label), render-prop `children` di `WebcamView`, legenda warna + toggle skeleton di `TranslateClient`.
- [x] Mengganti `console.log` mentah di loop deteksi dengan structured log `HAND_DETECTED` (throttle ~1/detik).
- [x] Commit & push pekerjaan Day 3–5 ke GitHub (design system, kamus interaktif, MediaPipe).
- [x] Pembersihan 12 lint error pre-existing di `handLandmarker.ts`, `useMediaPipe.ts`, dan `useWebcam.ts`.
- [x] Penambahan guard anti infinite-retry pada loader MediaPipe.
