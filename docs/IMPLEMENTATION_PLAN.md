# 🤟 Isyara — AI BISINDO Sign Language Translator

> **Project-1 | Periode:** 22 Sep – 21 Okt 2026  
> **Metode ATM:** Amati (NeuroBuddy, SAM 2, SightSence) → Tiru → Modifikasi (BISINDO)  
> **Tipe:** Web App (Next.js + TensorFlow.js + MediaPipe)

---

## 🎯 Visi Project

**Isyara** (dari kata *"Isyarat"*) adalah web app yang menerjemahkan Bahasa Isyarat Indonesia (BISINDO) secara real-time menggunakan webcam. Dilengkapi dengan mode belajar interaktif agar siapapun bisa belajar BISINDO.

### Mengapa BISINDO?
- BISINDO adalah bahasa isyarat **alami** yang digunakan komunitas tuli Indonesia sehari-hari
- Berbeda dengan SIBI (Sistem Isyarat Bahasa Indonesia) yang kaku dan formal
- **Belum ada web app** yang fokus translate BISINDO secara real-time
- Potensi impact ke **2.7 juta** penyandang disabilitas pendengaran di Indonesia

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                        │
│                                                          │
│  ┌──────────┐   ┌───────────────┐   ┌────────────────┐  │
│  │ Webcam   │──▶│ MediaPipe     │──▶│ TensorFlow.js  │  │
│  │ Stream   │   │ Hand          │   │ Classifier     │  │
│  │ (Video)  │   │ Landmarker    │   │ (BISINDO       │  │
│  │          │   │ (Max 2 hands, │   │  Model: 126    │  │
│  │          │   │  2×21 points) │   │  inputs)       │  │
│  └──────────┘   └───────┬───────┘   └───────┬────────┘  │
│                         │                    │           │
│                         ▼                    ▼           │
│               ┌─────────────────┐  ┌─────────────────┐  │
│               │ Canvas Overlay  │  │ Prediction UI   │  │
│               │ (Draw landmarks)│  │ (Show letter/   │  │
│               │                 │  │  confidence %)  │  │
│               └─────────────────┘  └─────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │              Next.js 16 (React 19)               │    │
│  │  • Translate Page (dual-hand real-time detection)│    │
│  │  • Learn Page (guided lessons + practice + quiz) │    │
│  │  • Dictionary Page (26 BISINDO signs A-Z)        │    │
│  │  • i18n Bilingual Switch (ID 🇮🇩 / EN 🇬🇧)         │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 OFFLINE / BUILD TIME                     │
│                                                          │
│  Python Pipeline:                                        │
│  ┌──────────┐   ┌───────────┐   ┌──────────────────┐   │
│  │ BISINDO  │──▶│ MediaPipe │──▶│ Train Keras      │   │
│  │ Dataset  │   │ Extract   │   │ Model (126 feat) │   │
│  │ (A-Z)    │   │ 2 Hands   │   │ Convert to TF.js │   │
│  └──────────┘   └───────────┘   └──────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Alur Kerja Singkat:
1. **Webcam** menangkap video gerakan tangan user (mendukung 1 atau 2 tangan sesuai kebutuhan alfabet BISINDO).
2. **MediaPipe Hand Landmarker** mendeteksi hingga 2 tangan (`max_num_hands: 2`), masing-masing 21 titik koordinat (x,y,z).
3. **Pipeline Normalisasi:** Mengurutkan tangan berdasarkan *handedness* (Kiri: 63 float, Kanan: 63 float, total 126 float). Tangan yang tidak muncul akan di-padding nilai 0.
4. **TensorFlow.js model (Dense NN)** mengklasifikasikan 126 fitur menjadi huruf BISINDO A-Z.
5. **UI & Smoothing Buffer** menampilkan hasil terjemahan secara stabil dan real-time.

> [!NOTE]
> Semua ML inference terjadi **di browser** (client-side). Tidak perlu server untuk prediksi. Ini membuat app cepat, aman secara privasi, dan bisa dipakai offline setelah pertama kali dimuat.

---

## 🛠️ Tech Stack (Final Decision)

| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| **Framework** | Next.js 16+ (App Router) | Modern, SSR/SSG, React 19 support, superior DX |
| **Styling** | Tailwind CSS v4 + shadcn/ui (`@base-ui/react`) | CSS-first config, modern primitives, fast rendering |
| **Hand Detection** | @mediapipe/tasks-vision (MediaPipe Tasks API) | Browser-native WASM, dual-hand detection (2×21 3D landmarks) |
| **ML Inference** | TensorFlow.js | Client-side inference via WebGL backend |
| **Model Training** | Python (TensorFlow/Keras) | Train offline (126 features), convert to tfjs |
| **Dataset** | Kaggle BISINDO Alphabets + Custom Dual-Hand Sign Dataset | A-Z static single-handed & two-handed signs |
| **Animation** | Framer Motion 13+ | Smooth UI transitions & interactive micro-animations |
| **Icons** | Lucide React | Clean, tree-shakable accessible SVG icons |
| **Typography** | Geist Sans & Geist Mono (`next/font/google`) | Modern, highly legible, zero network layout shift |
| **Testing** | Vitest + React Testing Library | Fast unit & integration testing for logic & UI |
| **Deploy** | Vercel | Global CDN, automated Git CI/CD |
| **Version Control** | Git + GitHub | Clean commit history & portfolio-ready |

---

## 📋 Feature Breakdown (4 Phases)

### Phase 1: Foundation (Day 1-7) 🏗️
- [x] Project setup (Next.js 16, Tailwind v4, shadcn/ui, Git repo)
- [x] Landing page dengan hero section & theme showcase
- [x] Webcam component (permission handler, video stream)
- [ ] MediaPipe Hand Landmarker integration (Dual-hand detection, max 2 hands)
- [ ] Canvas overlay untuk menggambar visual skeleton 2 tangan di atas webcam
- [ ] Basic navigation & routing (Translate, Learn, Dictionary)
- [ ] Testing framework setup (Vitest + sample unit test)

### Phase 2: Core ML (Day 8-16) 🧠
- [ ] Download & preprocess BISINDO dataset (Python) untuk huruf 1 tangan dan 2 tangan
- [ ] Extract hand landmarks 2 tangan (Left 63 + Right 63 = 126 float) dengan zero-padding
- [ ] Train classifier model (Keras Dense NN: Input 126 → 256 → 128 → 64 → 26)
- [ ] Convert model ke TensorFlow.js format (`model.json` + shards)
- [ ] Load model di browser + real-time dual-hand prediction
- [ ] Prediction smoothing (buffer 7 frames, min consensus 4)
- [ ] Confidence score display & visual feedback

### Phase 3: Learning & Dictionary (Day 17-23) 📚
- [ ] Dictionary schema & data: 26 huruf BISINDO (spesifikasi single-handed & two-handed)
- [ ] Dictionary page — grid view semua huruf A-Z dengan filter tipe tangan
- [ ] Detail page per huruf (gambar referensi dual-hand + instruksi)
- [ ] Learn mode — guided lesson per huruf dengan visual step-by-step
- [ ] Practice mode — webcam challenge dengan verifikasi 2 tangan
- [ ] Quiz mode — 10 random huruf dengan timer & evaluasi otomatis
- [ ] Progress tracking (localStorage) & Internationalization setup (`MOD-I18N`)

### Phase 4: Polish & Deploy (Day 24-30) ✨
- [ ] Responsive design (mobile + tablet + desktop layout)
- [ ] Dark mode & theme toggle
- [ ] Bilingual switcher (Bahasa Indonesia 🇮🇩 / English 🇬🇧)
- [ ] Loading states, skeleton loaders, error handling & graceful degradation
- [ ] Accessibility audit (WCAG AA, keyboard navigation, aria-live)
- [ ] PWA setup (manifest, service worker offline caching)
- [ ] SEO & meta tags (OpenGraph preview)
- [ ] Deploy ke Vercel + production verification
- [ ] Comprehensive README.md & demo showcase

---

## 📅 Daily Schedule (30 Days)

### 🏗️ MINGGU 1: Foundation (Day 1-7)

| Day | Tanggal | Durasi | Task | Deliverable |
|-----|---------|--------|------|-------------|
| **1** | 22 Sep | 1.5 jam | Setup project: `npx create-next-app` (Next.js 16, React 19, Tailwind v4, shadcn/ui), push ke GitHub | Repo GitHub + project jalan di localhost |
| **2** | 23 Sep | 1.5 jam | Buat layout utama: Header, Navigation (Translate/Learn/Dictionary), Footer, utility `cn` (`clsx` + `tailwind-merge`) | 3 halaman navigasi fungsional |
| **3** | 24 Sep | 2 jam | Landing page / Hero section: visual banner, deskripsi visi BISINDO, CTA button | Landing page modern & responsif |
| **4** | 25 Sep | 2 jam | Webcam component: minta izin kamera, tampilkan stream di `<video>`, penanganan status permission & error | Webcam view stabil di halaman Translate |
| **5** | 26 Sep | 2 jam | Integrate MediaPipe Hand Landmarker: load model WASM, konfigurasi `max_num_hands: 2`, console.log koordinat 2 tangan | Deteksi 2 tangan (2×21 landmark) aktif |
| **6** | 27 Sep | 2 jam | Canvas overlay: render skeleton 2 tangan dengan pembeda warna tangan kiri & kanan | Overlay visual skeleton real-time |
| **7** | 28 Sep | 1.5 jam | Setup **Vitest** testing framework, tulis unit test pertama untuk helper normalisasi, review & refactor kode Minggu 1 | Vitest aktif + test passing + repo bersih |

---

### 🧠 MINGGU 2: Core ML Pipeline (Day 8-14)

| Day | Tanggal | Durasi | Task | Deliverable |
|-----|---------|--------|------|-------------|
| **8** | 29 Sep | 2 jam | Setup Python environment. Download dataset BISINDO (Kaggle/custom). Analisis huruf 1 tangan vs 2 tangan | Dataset terstruktur + EDA report |
| **9** | 30 Sep | 2 jam | Script Python: ekstrak landmark 2 tangan (Left: 63, Right: 63 = 126 float) dengan padding jika hanya 1 tangan | `landmarks_dualhand.csv` siap training |
| **10** | 1 Okt | 2 jam | Normalisasi landmark relatif terhadap wrist masing-masing tangan. Split dataset 80/20 & data augmentation | Dataset 126-fitur siap training |
| **11** | 2 Okt | 2 jam | Build & train Keras model: `Input(126) → Dense(256) → Dense(128) → Dense(64) → Dense(26)`. Target akurasi >85% | Model `.h5` tersimpan + accuracy report |
| **12** | 3 Okt | 1.5 jam | Convert model ke format TensorFlow.js (`tensorflowjs_converter`). Test load di Next.js `public/model/` | `model.json` + weight shards di `public/model/` |
| **13** | 4 Okt | 2 jam | Integrasi model ke halaman Translate: format input 126 fitur → `model.predict()` → render prediksi di UI | Real-time prediction huruf 1 & 2 tangan 🎉 |
| **14** | 5 Okt | 2 jam | Prediction smoothing buffer (size 7, min consensus 4), confidence score meter, eliminasi flickering | Prediksi stabil, akurat & anti-flicker |

---

### 📚 MINGGU 3: Learning & Dictionary (Day 15-21)

| Day | Tanggal | Durasi | Task | Deliverable |
|-----|---------|--------|------|-------------|
| **15** | 6 Okt | 2 jam | Buat data kamus BISINDO: JSON 26 huruf (ID/EN name, deskripsi, tips, tipe: one-handed / two-handed, gambar) | `bisindo-dictionary.json` lengkap |
| **16** | 7 Okt | 2 jam | Dictionary page: grid view kartu huruf A-Z, filter kategori (1 tangan / 2 tangan), visual badge | Halaman Kamus interaktif |
| **17** | 8 Okt | 2 jam | Detail page per huruf: gambar referensi besar, instruksi posisi dual-hand, tombol "Latihan Huruf Ini" | 26 halaman detail huruf |
| **18** | 9 Okt | 2 jam | Learn mode: guided lesson interaktif per huruf (melihat referensi → mencoba di webcam → verifikasi AI) | Guided Learn Mode MVP |
| **19** | 10 Okt | 2 jam | Practice mode: webcam challenge mandiri dengan evaluasi real-time (✅ Benar / ❌ Coba lagi) | Practice Mode fungsional |
| **20** | 11 Okt | 2 jam | Quiz mode: 10 soal acak, timer 15 detik/soal, penghitungan skor akhir (0-10) | Quiz Mode selesai |
| **21** | 12 Okt | 1.5 jam | Progress tracking di `localStorage` (mastered letters, quiz high score, streak) + Setup i18n (`MOD-I18N` / `useLanguage`) | Progress tracker & fondasi bilingual siap |

---

### ✨ MINGGU 4: Polish & Deploy (Day 22-30)

| Day | Tanggal | Durasi | Task | Deliverable |
|-----|---------|--------|------|-------------|
| **22** | 13 Okt | 2 jam | Responsive design: adaptasi layout webcam untuk mobile & desktop, polish bilingual UI toggle (ID/EN) | Mobile-friendly & bilingual aktif |
| **23** | 14 Okt | 1.5 jam | Dark mode: theme provider & toggle (light/dark) dengan CSS variables Tailwind v4 | Dark mode support menyeluruh |
| **24** | 15 Okt | 2 jam | Polishing UX: skeleton loaders saat loading model, spinner webcam, error boundaries & fallback alert | UX halus & error handling kokoh |
| **25** | 16 Okt | 2 jam | Accessibility (a11y) audit: navigasi keyboard, semantic tags, aria-live untuk hasil prediksi, kontras warna WCAG AA | a11y compliant |
| **26** | 17 Okt | 1.5 jam | PWA configuration: `manifest.json`, Service Worker caching (offline-first untuk model & aset kamus) | App dapat di-install di HP (PWA) |
| **27** | 18 Okt | 1.5 jam | SEO & metadata: OpenGraph card, Twitter card, favicon, structured data | SEO-ready |
| **28** | 19 Okt | 2 jam | Deployment ke Vercel: build static export, verifikasi performa production, SSL HTTPS check | Isyara live di internet! 🌐 |
| **29** | 20 Okt | 2 jam | Dokumentasi lengkap: README.md portfolio-grade, demo GIF, arsitektur dual-hand, setup guide | Dokumentasi GitHub profesional |
| **30** | 21 Okt | 1.5 jam | Video demo showcase, verifikasi akhir semua fitur, project celebration! 🎉 | Project SELESAI & Siap Showcase! |

---

## 🗂️ Project Structure

```
isyara/
├── public/
│   ├── model/                    # TensorFlow.js model files (126-feature input)
│   │   ├── model.json
│   │   └── group1-shard1of1.bin
│   ├── images/
│   │   └── bisindo/              # Reference images per huruf (A-Z)
│   │       ├── A.png
│   │       ├── B.png
│   │       └── ...
│   ├── manifest.json             # PWA manifest
│   └── favicon.ico
├── src/
│   ├── app/                      # Next.js 16 App Router
│   │   ├── layout.tsx            # Root layout (Geist font + theme provider)
│   │   ├── page.tsx              # Landing page
│   │   ├── globals.css           # Tailwind CSS v4 (@import "tailwindcss", @theme)
│   │   ├── translate/
│   │   │   └── page.tsx          # Real-time dual-hand translation
│   │   ├── learn/
│   │   │   ├── page.tsx          # Learning hub
│   │   │   └── [letter]/
│   │   │       └── page.tsx      # Per-letter lesson & practice
│   │   └── dictionary/
│   │       ├── page.tsx          # Browse all 26 signs
│   │       └── [letter]/
│   │           └── page.tsx      # Letter detail
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components (@base-ui/react)
│   │   ├── webcam/
│   │   │   ├── WebcamView.tsx    # Video stream component
│   │   │   ├── CanvasOverlay.tsx # Dual-hand landmark drawing
│   │   │   └── PredictionDisplay.tsx
│   │   ├── dictionary/
│   │   │   ├── SignCard.tsx
│   │   │   └── SignGrid.tsx
│   │   ├── learn/
│   │   │   ├── LessonCard.tsx
│   │   │   ├── PracticeMode.tsx
│   │   │   └── QuizMode.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Navigation.tsx
│   ├── hooks/
│   │   ├── useMediaPipe.ts       # MediaPipe dual-hand lifecycle
│   │   ├── useWebcam.ts          # Webcam stream management
│   │   ├── useModel.ts           # TF.js 126-input model loading
│   │   ├── usePrediction.ts      # Prediction + smoothing buffer
│   │   ├── useProgress.ts        # localStorage progress management
│   │   ├── useLanguage.ts        # i18n bilingual state & translation
│   │   └── useTheme.ts           # Theme toggle hook
│   ├── lib/
│   │   ├── mediapipe/
│   │   │   └── handLandmarker.ts # MediaPipe init (max_num_hands: 2)
│   │   ├── tensorflow/
│   │   │   └── classifier.ts     # Model loading & dual-hand prediction
│   │   ├── data/
│   │   │   ├── bisindo-dictionary.json
│   │   │   └── translations.json # Bilingual strings (ID & EN)
│   │   └── utils.ts              # cn helper (clsx + tailwind-merge)
├── training/                     # Python ML pipeline
│   ├── collect_landmarks.py      # Extract 126 landmarks (Left + Right hands)
│   ├── train_model.py            # Train Keras classifier (Input: 126)
│   ├── convert_to_tfjs.py        # Convert to TF.js format
│   ├── requirements.txt
│   └── data/
│       └── landmarks_dualhand.csv
├── tests/                        # Vitest unit & integration tests
│   ├── normalize.test.ts
│   ├── smoothing.test.ts
│   ├── quiz.test.ts
│   └── streak.test.ts
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🎓 ML Pipeline Detail (Dual-Hand BISINDO)

### Step 1: Dataset & Handedness Sorting
- **Source:** Dataset Alfabet BISINDO (huruf satu tangan seperti 'I','L' dan huruf dua tangan seperti 'A','B','C','D').
- **Format Koordinat:** 2 tangan × 21 landmark × 3 dimensi (x, y, z) = **126 fitur**.
- **Mapping:**
  - Index 0..62: Tangan Kiri (21 landmark × 3)
  - Index 63..125: Tangan Kanan (21 landmark × 3)
  - Jika hanya 1 tangan terdeteksi (misal tangan kanan saja), maka slot tangan kiri diisi padding 0.0.

### Step 2: Landmark Extraction & Normalization (Python)
```python
# Dual-hand extraction pseudocode
def process_image(image):
    results = hand_landmarker.detect(image)
    left_hand = [0.0] * 63
    right_hand = [0.0] * 63
    
    if results.hand_landmarks:
        for idx, landmarks in enumerate(results.hand_landmarks):
            handedness = results.handedness[idx][0].category_name # 'Left' / 'Right'
            normalized = normalize_single_hand(landmarks) # 63 floats
            if handedness == 'Left':
                left_hand = normalized
            elif handedness == 'Right':
                right_hand = normalized
                
    features = left_hand + right_hand # Total 126 floats
    return features
```

### Step 3: Model Architecture
```
Input (126 features: 2 hands × 21 landmarks × 3 coords)
    ↓
Dense(256, ReLU) + BatchNormalization + Dropout(0.3)
    ↓
Dense(128, ReLU) + Dropout(0.2)
    ↓
Dense(64, ReLU)
    ↓
Dense(26, Softmax)  ← 26 huruf BISINDO A-Z
```
- **Expected accuracy:** 88–95% pada test set
- **Model size:** ~480 KB (sangat ringan untuk browser)

### Step 4: Browser Inference
```
Webcam frame (30fps)
    ↓ setiap frame
MediaPipe Hand Landmarker (browser, max_num_hands: 2)
    ↓ up to 2 hand landmarks
Dual-Hand Normalizer (wrist relative per hand + zero-padding)
    ↓ 126 floats
TF.js model.predict()
    ↓
Smoothing buffer (7 frames, min consensus 4)
    ↓
Display result: "A" (confidence: 94%)
```

---

## ⚠️ Risk Mitigation

| Risk | Mitigasi |
|------|----------|
| **Variasi tangan kiri vs kanan pada isyarat 1 tangan** | Normalisasi mendeteksi handedness; lakukan augmentasi data swap tangan saat training |
| **Akurasi huruf 2 tangan vs 1 tangan berbeda** | Beri bobot loss seimbang pada dataset per kelas huruf BISINDO |
| **MediaPipe lag saat mendeteksi 2 tangan di HP lama** | Optimasi input video 320×240, turunkan target FPS ke 15 via `AdaptiveQuality` |
| **Beberapa huruf BISINDO mirip secara visual** | Tampilkan top-3 prediksi pada mode latihan untuk membantu user mengoreksi posisi jari |
| **Keterbatasan waktu 30 hari** | Prioritas MoSCoW ketat; struktur modular memudahkan eksekusi bertahap |
| **BISINDO ada variasi regional** | Gunakan variasi standar/Jakarta sebagai baseline kamus v1.0 |

---

## 📚 Resource List

### Wajib Dibaca
1. [MediaPipe Hand Landmarker Guide](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
2. [MediaPipe Web Samples (GitHub)](https://github.com/google-ai-edge/mediapipe-samples-web)
3. [TensorFlow.js Guide](https://www.tensorflow.org/js/guide)
4. [Next.js Docs](https://nextjs.org/docs)
5. [shadcn/ui Components](https://ui.shadcn.com)
6. [Vitest Guide](https://vitest.dev/guide/)

### Dataset
1. [Kaggle: BISINDO Alphabets](https://www.kaggle.com/datasets/achmadnoer/alfabet-bisindo)
2. [Mendeley: BISINDO Image Data](https://data.mendeley.com/datasets/ywnjpbcz8m/1)
3. [GitHub: Indonesian-Sign-Language-Detection-Dataset](https://github.com/rhiosutoyo/Indonesian-Sign-Language-BISINDO-Hand-Sign-Detection-Dataset)

### Tutorial Referensi
1. [Hand Sign Recognition with MediaPipe](https://readytensor.ai)
2. [Converting Keras Model to TF.js](https://www.tensorflow.org/js/tutorials/conversion/import_keras)
3. [Real-time Hand Tracking in Browser](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker/web_js)

---

## User Review Required

> [!IMPORTANT]
> **Review rencana ini dan beri feedback:**
> - Apakah timeline-nya realistis untukmu?
> - Ada fitur yang mau ditambah atau dikurangi?
> - Apakah scope-nya sudah pas?

> [!WARNING]
> **Sebelum mulai eksekusi (Conversation 2), pastikan hal-hal berikut sudah siap:**
> 1. ✅ **Node.js** terinstall (v18+)
> 2. ✅ **Python** terinstall (v3.9+)
> 3. ✅ **Git** terinstall + akun GitHub
> 4. ✅ **Akun Vercel** (gratis) untuk deploy
> 5. ✅ **Webcam** yang berfungsi

## ✅ Keputusan Final

| Pertanyaan | Keputusan |
|------------|-----------|
| Nama Project | **Isyara** |
| Node.js & Git | ❌ Belum install → **perlu install di Day 0** |
| Python | ✅ Sudah terinstall |
| Webcam | ✅ Berfungsi |
| Scope | Alfabet A-Z saja |
| Bahasa UI | Bilingual (Indonesia 🇮🇩 + English 🇬🇧) |

---

## 🔧 Pre-Requisite Setup (Day 0 — Sebelum Conversation 2)

Berikut yang perlu kamu install sebelum memulai eksekusi:

### 1. Install Node.js (v18+)
- Download dari: https://nodejs.org/ (pilih **LTS version**)
- Setelah install, buka terminal/PowerShell dan cek:
  ```bash
  node --version    # harus v18 atau lebih
  npm --version     # otomatis terinstall bersama Node.js
  ```

### 2. Install Git
- Download dari: https://git-scm.com/download/win
- Saat instalasi, pilih default semua
- Setelah install, buka terminal baru dan cek:
  ```bash
  git --version
  ```
- Setup identitas Git:
  ```bash
  git config --global user.name "Nama Kamu"
  git config --global user.email "email@kamu.com"
  ```

### 3. Buat Akun (Gratis)
- [ ] **GitHub** — https://github.com (untuk hosting code)
- [ ] **Vercel** — https://vercel.com (untuk deploy, bisa login pakai GitHub)

### 4. Verify Python
- Buka terminal dan cek:
  ```bash
  python --version   # harus v3.9+
  pip --version
  ```

> [!IMPORTANT]
> **Setelah semua terinstall, langsung buka Conversation 2 dan kita mulai eksekusi dari Day 1!**
