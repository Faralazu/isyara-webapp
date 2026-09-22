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
│  │          │   │ (21 points    │   │  Model)        │  │
│  │          │   │  per hand)    │   │                │  │
│  └──────────┘   └───────┬───────┘   └───────┬────────┘  │
│                         │                    │           │
│                         ▼                    ▼           │
│               ┌─────────────────┐  ┌─────────────────┐  │
│               │ Canvas Overlay  │  │ Prediction UI   │  │
│               │ (Draw landmarks)│  │ (Show letter/   │  │
│               │                 │  │  word result)   │  │
│               └─────────────────┘  └─────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │              Next.js App (React)                  │    │
│  │  • Translate Page (real-time detection)           │    │
│  │  • Learn Page (interactive lessons + quiz)        │    │
│  │  • Dictionary Page (browse BISINDO signs)         │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 OFFLINE / BUILD TIME                     │
│                                                          │
│  Python Pipeline:                                        │
│  ┌──────────┐   ┌───────────┐   ┌──────────────────┐   │
│  │ BISINDO  │──▶│ MediaPipe │──▶│ Train Keras      │   │
│  │ Dataset  │   │ Extract   │   │ Model → Convert  │   │
│  │ (Kaggle) │   │ Landmarks │   │ to TF.js format  │   │
│  └──────────┘   └───────────┘   └──────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Alur Kerja Singkat:
1. **Webcam** menangkap video tangan user
2. **MediaPipe Hand Landmarker** mendeteksi 21 titik koordinat (x,y,z) per tangan
3. **TensorFlow.js model** mengklasifikasikan koordinat tersebut menjadi huruf/kata BISINDO
4. **UI** menampilkan hasil terjemahan secara real-time

> [!NOTE]
> Semua ML inference terjadi **di browser** (client-side). Tidak perlu server untuk prediksi. Ini membuat app cepat dan bisa dipakai offline setelah pertama kali dimuat.

---

## 🛠️ Tech Stack (Final Decision)

| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| **Framework** | Next.js 14+ (App Router) | Modern, SSR/SSG, great DX |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid prototyping, accessible components |
| **Hand Detection** | @mediapipe/tasks-vision (MediaPipe Tasks API) | Latest API, browser-native, 21 3D landmarks |
| **ML Inference** | TensorFlow.js | Run model di browser, no server needed |
| **Model Training** | Python (TensorFlow/Keras) | Train offline, convert to tfjs |
| **Dataset** | Kaggle BISINDO Alphabets + custom collection | A-Z static signs |
| **Animation** | Framer Motion | Smooth UI transitions |
| **Icons** | Lucide React | Clean, accessible icons |
| **Deploy** | Vercel | Free, fast, auto-deploy dari GitHub |
| **Version Control** | Git + GitHub | Portfolio-ready |

---

## 📋 Feature Breakdown (4 Phases)

### Phase 1: Foundation (Day 1-7) 🏗️
- [x] Project setup (Next.js, Tailwind, shadcn/ui)
- [ ] Landing page dengan hero section
- [ ] Webcam component (minta izin kamera, stream video)
- [ ] MediaPipe Hand Landmarker integration
- [ ] Canvas overlay untuk menggambar landmarks di atas video
- [ ] Basic navigation (Translate, Learn, Dictionary)

### Phase 2: Core ML (Day 8-16) 🧠
- [ ] Download & preprocess BISINDO dataset (Python)
- [ ] Extract hand landmarks dari dataset menggunakan MediaPipe (Python)
- [ ] Train classifier model (Keras Dense layers)
- [ ] Convert model ke TensorFlow.js format
- [ ] Load model di browser + real-time prediction
- [ ] Prediction smoothing (buffer-based, anti-flicker)
- [ ] Confidence score display

### Phase 3: Learning & Dictionary (Day 17-23) 📚
- [ ] Dictionary page — browse semua huruf BISINDO A-Z
- [ ] Detail page per huruf (gambar referensi + deskripsi)
- [ ] Learn mode — guided lesson per huruf
- [ ] Practice mode — webcam challenge ("Tunjukkan huruf A!")
- [ ] Quiz mode — random huruf, user harus menunjukkan isyarat
- [ ] Progress tracking (localStorage)

### Phase 4: Polish & Deploy (Day 24-30) ✨
- [ ] Responsive design (mobile + desktop)
- [ ] Dark mode
- [ ] Loading states & error handling
- [ ] Accessibility (keyboard nav, screen reader support)
- [ ] PWA setup (bisa di-install di HP)
- [ ] SEO & meta tags
- [ ] README.md + dokumentasi
- [ ] Deploy ke Vercel
- [ ] Record demo video / screenshots untuk portfolio

---

## 📅 Daily Schedule (30 Days)

### 🏗️ MINGGU 1: Foundation (Day 1-7)

| Day | Tanggal | Durasi | Task | Deliverable |
|-----|---------|--------|------|-------------|
| **1** | 22 Sep | 1.5 jam | Setup project: `npx create-next-app`, install Tailwind + shadcn/ui, setup Git repo, push ke GitHub | Repo GitHub + project jalan di localhost |
| **2** | 23 Sep | 1.5 jam | Buat layout utama: Header, Navigation (Translate/Learn/Dictionary), Footer. Setup routing dengan App Router | 3 halaman kosong yang bisa dinavigasi |
| **3** | 24 Sep | 2 jam | Landing page / Hero section: judul, deskripsi, CTA button. Desain yang menarik dengan Tailwind | Landing page yang eye-catching |
| **4** | 25 Sep | 2 jam | Webcam component: minta izin kamera, tampilkan video stream di `<video>` element. Handle error (kamera ditolak, tidak ada kamera) | Webcam bisa stream di halaman Translate |
| **5** | 26 Sep | 2 jam | Integrate MediaPipe Hand Landmarker: load model, detect landmarks dari webcam frame, console.log koordinat | Bisa melihat 21 landmark tangan di console |
| **6** | 27 Sep | 2 jam | Canvas overlay: gambar titik-titik landmark dan garis penghubung di atas video webcam. Styling canvas | Landmark tangan terlihat di layar real-time |
| **7** | 28 Sep | 1.5 jam | Review & refactor kode minggu 1. Fix bugs. Commit & push. Tulis catatan progress | Codebase bersih, landmark detection bekerja |

---

### 🧠 MINGGU 2: Core ML Pipeline (Day 8-14)

| Day | Tanggal | Durasi | Task | Deliverable |
|-----|---------|--------|------|-------------|
| **8** | 29 Sep | 2 jam | Setup Python environment. Download BISINDO dataset dari Kaggle. Explore data (cek jumlah gambar per kelas, kualitas) | Dataset terdownload + EDA notes |
| **9** | 30 Sep | 2 jam | Script Python: extract hand landmarks dari semua gambar dataset menggunakan MediaPipe. Simpan sebagai CSV (label, x1,y1,z1, x2,y2,z2, ..., x21,y21,z21) | `landmarks.csv` file siap training |
| **10** | 1 Okt | 2 jam | Normalize landmark data (relatif ke wrist). Split train/test (80/20). Augmentasi data jika perlu | Dataset siap training |
| **11** | 2 Okt | 2 jam | Build & train Keras model: Input(63) → Dense(128, ReLU) → Dropout(0.3) → Dense(64, ReLU) → Dense(26, Softmax). Train hingga accuracy >85% | Model `.h5` tersimpan + accuracy report |
| **12** | 3 Okt | 1.5 jam | Convert model ke TensorFlow.js format menggunakan `tensorflowjs_converter`. Test load di browser | `model.json` + weight files di `public/model/` |
| **13** | 4 Okt | 2 jam | Integrate model ke Translate page: landmark data → model.predict() → tampilkan huruf hasil prediksi di UI. Implementasi prediction loop (`requestAnimationFrame`) | Real-time prediction huruf BISINDO! 🎉 |
| **14** | 5 Okt | 2 jam | Prediction smoothing: buffer 5-10 frame terakhir, ambil huruf yang paling sering muncul. Tampilkan confidence score. Fix flickering | Prediksi stabil dan akurat |

---

### 📚 MINGGU 3: Learning & Dictionary (Day 15-21)

| Day | Tanggal | Durasi | Task | Deliverable |
|-----|---------|--------|------|-------------|
| **15** | 6 Okt | 2 jam | Buat data structure untuk kamus BISINDO: JSON file dengan 26 huruf, masing-masing punya nama, deskripsi, gambar referensi, tipe (satu tangan / dua tangan) | `bisindo-dictionary.json` |
| **16** | 7 Okt | 2 jam | Dictionary page: grid view semua huruf A-Z dengan gambar referensi. Klik huruf → modal/page detail | Dictionary page fungsional |
| **17** | 8 Okt | 2 jam | Detail page per huruf: gambar referensi besar, instruksi posisi tangan, tips, dan tombol "Practice this sign" | 26 detail pages |
| **18** | 9 Okt | 2 jam | Learn mode — guided lesson: step-by-step tutorial per huruf. User lihat referensi → coba di webcam → AI verifikasi apakah benar | Learn mode MVP |
| **19** | 10 Okt | 2 jam | Practice mode: webcam challenge. App minta user menunjukkan huruf tertentu → deteksi → beri feedback (✅ Benar! / ❌ Coba lagi!) | Practice mode fungsional |
| **20** | 11 Okt | 2 jam | Quiz mode: 10 random huruf, user harus menunjukkan isyarat yang benar. Timer per soal. Skor di akhir | Quiz mode selesai |
| **21** | 12 Okt | 1.5 jam | Progress tracking: simpan di localStorage (huruf yang sudah dikuasai, skor quiz tertinggi, streak belajar). Tampilkan di dashboard mini | Progress system bekerja |

---

### ✨ MINGGU 4: Polish & Deploy (Day 22-30)

| Day | Tanggal | Durasi | Task | Deliverable |
|-----|---------|--------|------|-------------|
| **22** | 13 Okt | 2 jam | Responsive design: pastikan semua halaman tampil bagus di mobile. Adjust webcam layout untuk layar kecil | Mobile-friendly |
| **23** | 14 Okt | 1.5 jam | Dark mode: implementasi theme toggle (light/dark). Pastikan semua komponen support | Dark mode toggle |
| **24** | 15 Okt | 2 jam | Loading states: skeleton loaders saat model loading, spinner saat webcam initializing. Error boundaries & fallback UI | UX yang polished |
| **25** | 16 Okt | 2 jam | Accessibility audit: keyboard navigation, proper ARIA labels, focus management, color contrast check | a11y compliant |
| **26** | 17 Okt | 1.5 jam | PWA setup: manifest.json, service worker, offline-first caching strategy. Test install di HP | Installable PWA |
| **27** | 18 Okt | 1.5 jam | SEO: meta tags, Open Graph, structured data. Favicon & social preview image | SEO-ready |
| **28** | 19 Okt | 2 jam | Deploy ke Vercel. Test production build. Fix any prod-only issues. Custom domain (opsional) | Live di internet! 🌐 |
| **29** | 20 Okt | 2 jam | README.md lengkap: screenshot, demo GIF, tech stack, setup instructions, features, architecture diagram. Persiapan portfolio | README portfolio-grade |
| **30** | 21 Okt | 1.5 jam | Record demo video. Final touch. Social media post. Celebrasi! 🎉 | Project SELESAI! |

---

## 🗂️ Project Structure

```
isyara/
├── public/
│   ├── model/                    # TensorFlow.js model files
│   │   ├── model.json
│   │   └── group1-shard1of1.bin
│   ├── images/
│   │   └── bisindo/              # Reference images per huruf
│   │       ├── A.png
│   │       ├── B.png
│   │       └── ...
│   ├── manifest.json             # PWA manifest
│   └── favicon.ico
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   ├── translate/
│   │   │   └── page.tsx          # Real-time translation
│   │   ├── learn/
│   │   │   ├── page.tsx          # Learning hub
│   │   │   └── [letter]/
│   │   │       └── page.tsx      # Per-letter lesson
│   │   └── dictionary/
│   │       ├── page.tsx          # Browse all signs
│   │       └── [letter]/
│   │           └── page.tsx      # Letter detail
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── webcam/
│   │   │   ├── WebcamView.tsx    # Video stream component
│   │   │   ├── CanvasOverlay.tsx # Landmark drawing
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
│   │   ├── useMediaPipe.ts       # MediaPipe lifecycle
│   │   ├── useWebcam.ts          # Webcam stream management
│   │   ├── useModel.ts           # TF.js model loading
│   │   └── usePrediction.ts      # Prediction + smoothing
│   ├── lib/
│   │   ├── mediapipe/
│   │   │   └── handLandmarker.ts # MediaPipe init & config
│   │   ├── tensorflow/
│   │   │   └── classifier.ts     # Model loading & prediction
│   │   ├── data/
│   │   │   └── bisindo-dictionary.json
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── training/                     # Python ML pipeline
│   ├── collect_landmarks.py      # Extract landmarks from images
│   ├── train_model.py            # Train Keras classifier
│   ├── convert_to_tfjs.py        # Convert to TF.js format
│   ├── requirements.txt
│   └── data/
│       └── landmarks.csv
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🎓 ML Pipeline Detail

### Step 1: Dataset
- **Source:** Kaggle "BISINDO Alphabets" dataset (gambar A-Z)
- **Ukuran:** ~2600+ gambar (100+ per huruf)
- **Preprocessing:** Resize, augmentasi (rotasi, brightness, flip)

### Step 2: Landmark Extraction (Python)
```python
# Pseudocode
for image in dataset:
    results = hand_landmarker.detect(image)
    if results.hand_landmarks:
        landmarks = flatten(results.hand_landmarks[0])  # 21 x 3 = 63 values
        normalize(landmarks, relative_to=wrist)
        save_to_csv(label, landmarks)
```

### Step 3: Model Architecture
```
Input (63 features: 21 landmarks × 3 coords)
    ↓
Dense(128, ReLU) + BatchNorm + Dropout(0.3)
    ↓
Dense(64, ReLU) + Dropout(0.2)
    ↓
Dense(26, Softmax)  ← 26 huruf A-Z
```
- **Expected accuracy:** 85-95% pada test set
- **Model size:** < 1 MB (sangat ringan untuk browser)

### Step 4: Browser Inference
```
Webcam frame (30fps)
    ↓ setiap frame
MediaPipe Hand Landmarker (browser)
    ↓ 21 landmarks [x,y,z]
Normalize (relative to wrist)
    ↓ 63 floats
TF.js model.predict()
    ↓
Smoothing buffer (5-10 frames)
    ↓
Display result: "A" (confidence: 94%)
```

---

## ⚠️ Risk Mitigation

| Risk | Mitigasi |
|------|----------|
| **Dataset BISINDO kurang bervariasi** | Augmentasi data + collect beberapa gambar sendiri via webcam |
| **Akurasi model rendah (<80%)** | Tambah hidden layers, tambah data, fine-tune hyperparams |
| **MediaPipe lambat di HP lama** | Resize video input ke 320x240, kurangi FPS ke 15 |
| **Beberapa huruf mirip (sulit dibedakan)** | Fokus pada huruf yang jelas dulu, tandai huruf yang "tricky" |
| **Waktu kurang** | Phase 4 bisa disederhanakan (skip PWA/dark mode) |
| **BISINDO ada variasi regional** | Gunakan variasi Jakarta/standar sebagai baseline |

---

## 📚 Resource List

### Wajib Dibaca
1. [MediaPipe Hand Landmarker Guide](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
2. [MediaPipe Web Samples (GitHub)](https://github.com/google-ai-edge/mediapipe-samples-web)
3. [TensorFlow.js Guide](https://www.tensorflow.org/js/guide)
4. [Next.js 14 Docs](https://nextjs.org/docs)
5. [shadcn/ui Components](https://ui.shadcn.com)

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
