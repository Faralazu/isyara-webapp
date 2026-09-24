<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 🤖 AI Agent Guidelines: Isyara WebApp

## 1. Single Source of Truth
Sebelum mulai bekerja, pelajari file acuan berikut:
- **`PROJECT_STATUS.md`**: Status terkini seluruh fitur, tes, dan backlog pengembangan.
- **`README.md`**: Arsitektur teknis dan diagram alur sistem.

## 2. Environment & Perintah Wajib
- **OS**: Windows (PowerShell)
- **Eksekusi Script**: Selalu gunakan `npm.cmd` (jangan `npm` polos karena PowerShell Script Execution Policy).
  - Menjalankan Test: `npm.cmd test`
  - Menjalankan Dev Server: `npm.cmd run dev`
  - Build Proyek: `npm.cmd run build`
  - Linting: `npm.cmd run lint`
- **Verifikasi**: Setelah mengubah kode apa pun, jalankan `npm.cmd test` untuk memastikan semua 44 skenario tes tetap lolos tanpa regresi.

## 3. Aturan Arsitektur & Coding
- **Next.js 16 + React 19**:
  - Komponen apa pun yang menggunakan Browser API (kamera webcam, canvas, MediaPipe, `window`, `navigator`) WAJIB memiliki direktif `'use client';` di baris paling atas.
- **Styling**:
  - Tailwind CSS v4 (@tailwindcss/postcss) & shadcn/ui.
  - Jangan buat `tailwind.config.js` baru kecuali jika benar-benar diperlukan migrasi khusus.
- **Computer Vision & ML**:
  - MediaPipe Tasks Vision (`@mediapipe/tasks-vision`) dijalankan 100% on-device (client-side).
  - Koordinat landmark tangan selalu dinormalisasi ke 21 poin keypoints.

