# 🤟 Isyara — AI BISINDO Sign Language Translator

> **Penerjemah Bahasa Isyarat Indonesia (BISINDO) Real-time Berbasis AI Langsung di Browser**

Isyara adalah aplikasi web modern yang dirancang untuk menjembatani komunikasi antara teman tuli dan teman dengar melalui penerjemahan Bahasa Isyarat Indonesia (BISINDO) alfabet A-Z secara real-time menggunakan kamera/webcam, serta dilengkapi modul belajar interaktif dan kamus isyarat.

---

## 🌟 Fitur Utama

- ⚡ **Real-time Camera Translation**: Deteksi 21 titik koordinat tangan via MediaPipe dan klasifikasi instan via TensorFlow.js langsung di browser (tanpa kirim video ke server).
- 🔒 **Privacy First & Fast**: Semua komputasi AI berjalan 100% di sisi klien (on-device browser inference).
- 📖 **Kamus Isyarat (Dictionary)**: Katalog lengkap alfabet BISINDO A-Z dengan gambar referensi dan panduan gestur.
- 🎯 **Mode Belajar Interaktif (Learn & Practice)**: Latihan interaktif dengan umpan balik visual langsung dari AI.
- 🎨 **Modern & Accessible UI**: Tampilan bersih, responsif, dan elegan menggunakan Next.js App Router, Tailwind CSS, serta shadcn/ui.

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                        │
│                                                          │
│  ┌──────────┐   ┌───────────────┐   ┌────────────────┐  │
│  │ Webcam   │──▶│ MediaPipe     │──▶│ TensorFlow.js  │  │
│  │ Stream   │   │ Hand          │   │ Classifier     │  │
│  │ (Video)  │   │ Landmarker    │   │ (BISINDO       │  │
│  │          │   │ (21 points)   │   │  Model)        │  │
│  └──────────┘   └───────┬───────┘   └───────┬────────┘  │
│                         │                    │           │
│                         ▼                    ▼           │
│               ┌─────────────────┐  ┌─────────────────┐  │
│               │ Canvas Overlay  │  │ Prediction UI   │  │
│               │ (Landmarks Mesh)│  │ (Hasil Huruf)   │  │
│               └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, TypeScript)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Computer Vision**: [@mediapipe/tasks-vision](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
- **ML Inference**: [TensorFlow.js](https://www.tensorflow.org/js)
- **ML Training Pipeline**: Python 3.12 (TensorFlow / Keras + MediaPipe)

---

## 📁 Struktur Direktori

```
isyara/
├── public/
│   ├── images/bisindo/           # Aset visual referensi huruf
│   └── model/                    # Model TensorFlow.js (model.json & shards)
├── src/
│   ├── app/                      # Next.js App Router (pages & routes)
│   ├── components/
│   │   ├── layout/               # Header, Footer, Navigation
│   │   ├── ui/                   # shadcn/ui primitives
│   │   ├── webcam/               # Webcam stream & Canvas overlay
│   │   ├── dictionary/           # Kartu dan grid kamus
│   │   └── learn/                # Modul latihan dan kuis
│   ├── hooks/                    # Custom React hooks (useWebcam, useMediaPipe, dll.)
│   └── lib/                      # Utilitas, konfigurasi MediaPipe & TF.js
├── training/                     # Pipeline training model Python offline
└── README.md
```

---

## 🚀 Memulai (Getting Started)

### 1. Prasyarat
- Node.js v18+ (disarankan v20+)
- npm atau pnpm/yarn/bun
- Git

### 2. Instalasi
```bash
# Clone repository
git clone https://github.com/Faralazu/isyara-webapp.git
cd isyara-webapp

# Install dependensi
npm install
```

### 3. Menjalankan Server Development
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 4. Build Production
```bash
npm run build
npm run start
```

---

## 📄 Lisensi

Didistribusikan di bawah lisensi MIT.
