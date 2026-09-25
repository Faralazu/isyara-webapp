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
| `/dictionary` | ✅ Selesai | `src/app/dictionary/page.tsx`, `DictionaryBrowser.tsx` | Kamus gestur A-Z dengan pencarian, filter tipe tangan, dan panel detail isyarat. |
| `/learn` | 🟡 Sebagian | `src/app/learn/page.tsx` | UI hub belajar + kartu progres sudah ada. Guided lesson, Practice Mode, dan Quiz Mode belum diimplementasikan (Phase 3). |
| `/translate` | 🟡 Sebagian | `src/app/translate/page.tsx`, `TranslateClient.tsx`, `WebcamView.tsx`, `CanvasOverlay.tsx` | Deteksi 21 landmark per tangan (maks. 2 tangan) real-time + **overlay skeleton kanvas dual-warna (Kiri/Kanan) aktif** (Day 6). **Belum ada** klasifikasi huruf (Phase 2). |

### B. Custom Hooks & Integrasi MediaPipe (`src/hooks/` & `src/lib/`)
- `src/hooks/useWebcam.ts`: Pengelolaan stream WebRTC, penanganan permission kamera, resolusi, dan unmount cleanup.
- `src/hooks/useMediaPipe.ts`: Inisialisasi model MediaPipe HandLandmarker (singleton, dimuat maks. sekali per mount) dan penyedia fungsi `detect()` per frame.
- `src/lib/mediapipe/handLandmarker.ts`: Loader instance MediaPipe Tasks Vision WASM, pemformatan hasil deteksi, dan pemetaan error `E-MP-001`/`E-MP-002`.
- `src/lib/mediapipe/handSkeleton.ts`: Topologi 21 landmark (`HAND_CONNECTIONS`), palette warna Kiri (sky) / Kanan (amber), pemetaan koordinat `object-cover` + mirror (`x' = 1 - x`), dan renderer skeleton berbasis kontrak kanvas (testable tanpa DOM).
- `src/components/webcam/CanvasOverlay.tsx`: Komponen kanvas DPR-aware yang menggambar skeleton 2 tangan di atas video (outline gelap + tulang berwarna + 21 joint + chip label "Kiri"/"Kanan").
- `src/components/webcam/WebcamView.tsx`: Menyediakan slot `children` (node **atau** render-prop `{ mirrored }`) sehingga overlay selalu sinkron dengan status cermin.
- `src/components/translate/TranslateClient.tsx`: Pemilik loop deteksi `requestAnimationFrame`, panel inspeksi hasil, legenda warna, dan toggle tampil/sembunyi skeleton.
- `src/lib/logger.ts` & `src/lib/utils.ts`: Logging terstandar dan utility helper styling (`cn`).

> **Catatan penting**: klasifikasi huruf A-Z **belum berjalan**. Yang aktif saat ini adalah pelacakan koordinat tangan + visualisasi skeleton. Agar fitur terjemahan benar-benar berfungsi, Phase 2 (training model TF.js) harus diselesaikan lebih dulu.

### C. Health, Lint & Testing Suite (`tests/`)

| Pemeriksaan | Perintah | Status |
| :--- | :--- | :---: |
| Unit & integration test | `npm.cmd test` | ✅ 71/71 lulus (8 suite) |
| Lint (ESLint 9 + eslint-config-next) | `npm.cmd run lint` | ✅ 0 error, 0 warning |
| Type check | `npx.cmd tsc --noEmit` | ✅ bersih |
| Production build | `npm.cmd run build` | ✅ sukses (5 rute statis) |

Rincian 8 suite pengujian:
1. `tests/logger.test.ts` (2 tests)
2. `tests/utils.test.ts` (4 tests)
3. `tests/mediapipe.test.ts` (15 tests)
4. `tests/webcam.test.ts` (14 tests)
5. `tests/navigation.test.ts` (3 tests)
6. `tests/home.test.ts` (6 tests)
7. `tests/canvasOverlay.test.ts` (22 tests) — topologi skeleton, resolusi Kiri/Kanan, pemetaan `object-cover` + mirror, geometry builder, renderer kanvas
8. `tests/canvasOverlayComponent.test.tsx` (5 tests) — markup `CanvasOverlay` via render statis

**Aturan regresi**: setiap perubahan kode wajib mempertahankan 71 tes tetap lulus **dan** lint tetap 0 error sebelum dianggap selesai.

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

---

## 4. Backlog / Target Pengembangan Selanjutnya

### 🔴 Prioritas Berikutnya (urutan eksekusi)
- [ ] **Day 7 — Setup final Vitest & review Minggu 1**: rapikan `vitest.config.mts` (environment `jsdom` bila perlu), tambah unit test helper normalisasi 126 fitur (`normalizeLandmarks`), lalu refactor & bersihkan repo sebelum masuk Phase 2.
- [ ] **Phase 2 — Core ML Pipeline (Day 8–14)**: ekstraksi landmark 126 fitur (Python), training Keras, konversi ke TensorFlow.js, lalu integrasi `useModel` + `usePrediction`.
- [ ] **Phase 2 — Smoothing buffer**: peredam getaran (buffer 7 frame, min consensus 4) pada hasil prediksi. **Bergantung pada Phase 2** karena belum ada output prediksi yang perlu dihaluskan.

### 🟡 Peningkatan Lanjutan
- [ ] Evaluasi performa rendering canvas dan FPS deteksi pada laptop/perangkat berspesifikasi hemat daya (kaitkan dengan mitigasi SRD §6.3: auto-detect FPS < 10 → turunkan resolusi ke 320×240, disable canvas overlay via prop `showSkeleton`).
- [ ] Peningkatan dataset training di `training/data/` untuk variasi sudut pencahayaan tangan.
- [ ] Phase 3 — Dictionary detail page per huruf, Guided Lesson, Practice Mode, Quiz Mode, dan progress tracking `localStorage`.
- [ ] Phase 4 — Dark mode, bilingual switcher (ID/EN), PWA, SEO, dan deploy ke Vercel.

### ✅ Baru Selesai (25 Sep 2026)
- [x] **Day 6 — CanvasOverlay skeleton 2 tangan**: `handSkeleton.ts` (topologi 21 landmark, palette Kiri/Kanan, mapping `object-cover` + mirror), `CanvasOverlay.tsx` (DPR-aware, outline gelap, joint halo, chip label), render-prop `children` di `WebcamView`, legenda warna + toggle skeleton di `TranslateClient`.
- [x] Mengganti `console.log` mentah di loop deteksi dengan structured log `HAND_DETECTED` (throttle ~1/detik).
- [x] Commit & push pekerjaan Day 3–5 ke GitHub (design system, kamus interaktif, MediaPipe).
- [x] Pembersihan 12 lint error pre-existing di `handLandmarker.ts`, `useMediaPipe.ts`, dan `useWebcam.ts`.
- [x] Penambahan guard anti infinite-retry pada loader MediaPipe.
