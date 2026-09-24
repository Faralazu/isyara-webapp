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

## 2. Fitur & Halaman yang Sudah Selesai (100% Berfungsi)

### A. Routing & Halaman (`src/app/`)
| Rute | Status | Komponen Utama | Keterangan |
| :--- | :---: | :--- | :--- |
| `/` | ✅ Selesai | `src/app/page.tsx`, `CtaSection`, `HowItWorksSection`, `VisiSection`, `VisualBanner` | Landing page komprehensif, responsif, dan interaktif. |
| `/dictionary` | ✅ Selesai | `src/app/dictionary/page.tsx`, `DictionaryBrowser.tsx` | Kamus gestur A-Z dengan pencarian, filter, dan modal detail isyarat. |
| `/learn` | ✅ Selesai | `src/app/learn/page.tsx` | Mode latihan langkah-demi-langkah dengan feedback visual bagi pemula. |
| `/translate` | ✅ Selesai | `src/app/translate/page.tsx`, `TranslateClient.tsx`, `WebcamView.tsx` | Deteksi kamera real-time dengan overlay kanvas 21 titik tangan. |

### B. Custom Hooks & Integrasi MediaPipe (`src/hooks/` & `src/lib/`)
- `src/hooks/useWebcam.ts`: Pengelolaan stream WebRTC, penanganan permission kamera, resolusi, dan unmount cleanup.
- `src/hooks/useMediaPipe.ts`: Inisialisasi model MediaPipe HandLandmarker, integrasi canvas overlay, dan loop animasi frame `requestAnimationFrame`.
- `src/lib/mediapipe/handLandmarker.ts`: Loader instance MediaPipe Tasks Vision WASM.
- `src/lib/logger.ts` & `src/lib/utils.ts`: Logging terstandar dan utility helper styling (`cn`).

### C. Health & Testing Suite (`tests/`)
Semua 6 suite pengujian (44 skenario tes) berstatus **100% LULUS**:
1. `tests/logger.test.ts` (2 tests)
2. `tests/utils.test.ts` (4 tests)
3. `tests/mediapipe.test.ts` (15 tests)
4. `tests/webcam.test.ts` (14 tests)
5. `tests/navigation.test.ts` (3 tests)
6. `tests/home.test.ts` (6 tests)

Perintah verifikasi:
```bash
npm.cmd test
```

---

## 3. Nuansa Teknis & Batasan Arsitektur Penting

1. **Client-side vs Server-side**:
   - Komponen kamera (`WebcamView.tsx`), MediaPipe (`useMediaPipe.ts`), dan `TranslateClient.tsx` **wajib** menyertakan direktif `'use client';` karena mengakses Web APIs (`navigator.mediaDevices`, `HTMLVideoElement`, `HTMLCanvasElement`, WASM).
2. **Environment Windows**:
   - Di PowerShell Windows, script `.ps1` diblokir oleh ExecutionPolicy standar. Gunakan selalu `npm.cmd` (contoh: `npm.cmd test`, `npm.cmd run dev`).
3. **Tailwind CSS v4**:
   - Konfigurasi menggunakan `@tailwindcss/postcss` tanpa `tailwind.config.js` konvensional. Import style ada di `src/app/globals.css`.
4. **Model Klasifikasi (`public/model/`)**:
   - File model hasil training offline via Python (`training/`) dikonversi ke format web di `public/model/`. Pastikan format input tensor tetap 21 titik koordinat hand landmarks \((x, y, z)\).

---

## 4. Backlog / Target Pengembangan Selanjutnya

- [ ] Evaluasi performa rendering canvas dan FPS deteksi pada laptop/perangkat berspesifikasi hemat daya.
- [ ] Penambahan peredam getaran (smoothing filter / debouncing buffer) pada hasil prediksi teks terjemahan huruf.
- [ ] Peningkatan dataset training di `training/data/` untuk variasi sudut pencahayaan tangan.
