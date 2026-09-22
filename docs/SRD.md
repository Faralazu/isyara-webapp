# SRD: Isyara — System Requirements Document

---

## I. Metadata & Matriks Ketertelusuran (Traceability)

| Atribut | Detail |
|---------|--------|
| **Nama Sistem** | Isyara Web Application |
| **Versi Dokumen** | 1.0 |
| **Mode Eksekusi** | 🏢 Enterprise (Bagian I–IX) |
| **Dokumen Sumber** | PRD Isyara v1.0 |
| **Arsitektur** | Client-Only SPA (Static Site Generation + Client-Side ML Inference) |
| **Runtime Environment** | Modern Browser (Chrome 90+, Edge 90+, Firefox 90+, Safari 15+) |

### Matriks Ketertelusuran: PRD → SRD

| ID PRD | Fitur PRD | Modul Teknis SRD | Komponen Utama |
|--------|-----------|-------------------|----------------|
| F-01 | Webcam stream | `MOD-CAM` | `WebcamView.tsx`, `useWebcam.ts` |
| F-02 | Hand landmark overlay | `MOD-CAM` | `CanvasOverlay.tsx`, `useMediaPipe.ts` |
| F-03 | Real-time prediction | `MOD-ML` | `classifier.ts`, `useModel.ts`, `usePrediction.ts` |
| F-04 | Prediction smoothing | `MOD-ML` | `usePrediction.ts` (SmoothingBuffer) |
| F-05 | Kamus grid view | `MOD-DICT` | `SignGrid.tsx`, `SignCard.tsx` |
| F-06 | Kamus detail page | `MOD-DICT` | `/dictionary/[letter]/page.tsx` |
| F-07 | Practice mode | `MOD-LEARN` | `PracticeMode.tsx` |
| F-08 | Quiz mode | `MOD-LEARN` | `QuizMode.tsx` |
| F-09 | Progress tracking | `MOD-STATE` | `useProgress.ts`, `localStorage` |
| F-10 | Guided lesson | `MOD-LEARN` | `LessonCard.tsx`, `/learn/[letter]/page.tsx` |
| F-11 | Bilingual UI | `MOD-I18N` | `useLanguage.ts`, `translations/` |
| F-12 | Dark mode | `MOD-THEME` | `useTheme.ts`, `ThemeProvider.tsx` |
| F-13 | Responsive design | `MOD-UI` | Tailwind breakpoints, layout components |
| F-14 | PWA install | `MOD-PWA` | `manifest.json`, `service-worker.js` |
| F-15 | Landing page | `MOD-UI` | `/page.tsx` (root) |
| F-16 | Animasi & transisi | `MOD-UI` | Framer Motion, `AnimatePresence` |
| F-17 | SEO optimization | `MOD-SEO` | `metadata.ts`, `opengraph-image.tsx` |
| F-18 | Cloud auth (OUT) | — | Ditunda ke v2.0 |

### Daftar Modul Teknis

| ID Modul | Nama | Deskripsi | Prioritas |
|----------|------|-----------|-----------|
| `MOD-CAM` | Camera & Detection | Webcam stream, MediaPipe Hand Landmarker, canvas overlay | Must |
| `MOD-ML` | ML Inference Pipeline | TF.js model loading, prediction, smoothing buffer | Must |
| `MOD-DICT` | Dictionary | Static data rendering, browse & detail views | Must |
| `MOD-LEARN` | Learning Engine | Lesson flow, practice verification, quiz logic, scoring | Must |
| `MOD-STATE` | State Management | localStorage persistence, progress tracking, preferences | Should |
| `MOD-I18N` | Internationalization | Language toggle, translation strings | Should |
| `MOD-THEME` | Theming | Dark/light mode, CSS variables | Should |
| `MOD-UI` | UI Shell | Layout, navigation, landing page, responsive, animation | Should |
| `MOD-PWA` | Progressive Web App | Service worker, manifest, offline caching | Could |
| `MOD-SEO` | Search Optimization | Meta tags, OG tags, structured data | Could |

---

## II. Gambaran Umum Arsitektur Sistem

### 2.1 Topologi Sistem & Pola Arsitektur

**Pola: Client-Only Static SPA dengan Client-Side ML Inference**

```
┌─────────────────────────────────────────────────────────────────────┐
│                        VERCEL CDN (Edge)                            │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Static Assets (HTML, JS, CSS, Images, Model Files)           │ │
│  │  • Next.js SSG output (pre-rendered HTML)                     │ │
│  │  • TF.js model artifacts (model.json + weight shards)         │ │
│  │  • MediaPipe WASM binaries + model files                      │ │
│  │  • BISINDO reference images (26 × PNG, avg 50KB each)         │ │
│  └─────────────────────────────┬──────────────────────────────────┘ │
└────────────────────────────────┼────────────────────────────────────┘
                                 │ HTTPS (TLS 1.3)
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                                 │
│                                                                     │
│  ┌─── Presentation Layer ───────────────────────────────────────┐  │
│  │  Next.js App Router (React 18+)                              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │  │
│  │  │ Landing  │ │Translate │ │  Learn   │ │  Dictionary  │   │  │
│  │  │ Page     │ │ Page     │ │  Pages   │ │  Pages       │   │  │
│  │  └──────────┘ └────┬─────┘ └────┬─────┘ └──────────────┘   │  │
│  └─────────────────────┼───────────┼───────────────────────────┘  │
│                         │           │                              │
│  ┌─── ML Inference Layer ──────────┼───────────────────────────┐  │
│  │                      │           │                           │  │
│  │  ┌──────────────┐   │   ┌───────┴────────┐                 │  │
│  │  │ MediaPipe    │◀──┘   │ TensorFlow.js  │                 │  │
│  │  │ Hand         │       │ Classifier     │                 │  │
│  │  │ Landmarker   │──────▶│ (Dense NN)     │                 │  │
│  │  │ (WASM)       │ 63    │ WebGL backend  │                 │  │
│  │  │              │floats │                │                 │  │
│  │  └──────────────┘       └───────┬────────┘                 │  │
│  └─────────────────────────────────┼───────────────────────────┘  │
│                                     │                              │
│  ┌─── State Layer ──────────────────┼──────────────────────────┐  │
│  │                                  ▼                           │  │
│  │  ┌──────────────────┐  ┌─────────────────┐                 │  │
│  │  │ React State      │  │ localStorage    │                 │  │
│  │  │ (useRef for ML)  │  │ (Persistent     │                 │  │
│  │  │ (useState for UI)│  │  Progress Data) │                 │  │
│  │  └──────────────────┘  └─────────────────┘                 │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─── Platform Layer ──────────────────────────────────────────┐  │
│  │  WebRTC (getUserMedia) │ WebGL (TF.js) │ WASM (MediaPipe)  │  │
│  │  Canvas 2D API         │ Service Worker│ Web App Manifest  │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Zero-Server Architecture:** Isyara v1.0 tidak memiliki backend, database server, atau API server. Seluruh logika berjalan di browser user. Ini mengeliminasi server cost, latency jaringan, dan risiko data leakage. Trade-off: tidak ada cross-device sync (ditangani localStorage saja).

### 2.2 Justifikasi Pemilihan Stack Teknis

| Keputusan | Alternatif yang Dipertimbangkan | Justifikasi Final |
|-----------|--------------------------------|-------------------|
| **Next.js (SSG mode)** vs Vite + React | Vite lebih ringan, tapi Next.js menyediakan file-based routing, built-in image optimization, metadata API, dan SSG out-of-the-box. Vite memerlukan manual routing setup (react-router) dan tidak memiliki built-in SEO support | Next.js meminimalkan boilerplate untuk routing, SEO, dan static export |
| **@mediapipe/tasks-vision** vs legacy @mediapipe/hands | Legacy API (`@mediapipe/hands`) deprecated sejak 2023. Tasks API menggunakan WASM yang lebih efisien dan mendukung bundling modern | Tasks API adalah satu-satunya pilihan yang di-maintain |
| **TensorFlow.js** vs ONNX Runtime Web | TF.js memiliki ekosistem yang lebih mature untuk Keras model conversion, WebGL backend yang stabil, dan dokumentasi yang lebih lengkap. ONNX Runtime Web masih dalam fase early adoption untuk browser use cases | TF.js memiliki converter resmi dari Keras (`tensorflowjs_converter`) |
| **localStorage** vs IndexedDB | Progress data sangat ringan (< 1KB). IndexedDB overkill untuk key-value sederhana. localStorage synchronous API lebih simpel | localStorage cukup dan performant untuk volume data ini |
| **Tailwind CSS** vs CSS Modules | Tailwind mempercepat iterasi UI dengan utility classes. Cocok untuk solo developer dengan timeline ketat (30 hari) | Speed of development adalah prioritas utama |
| **Vercel** vs GitHub Pages vs Netlify | Vercel memiliki zero-config Next.js deployment, edge CDN global, dan HTTPS otomatis. GitHub Pages tidak mendukung Next.js natively. Netlify comparable tapi Vercel memiliki first-party Next.js support | Vercel adalah deployment target resmi Next.js |

### 2.3 Component Dependency Graph

```
page.tsx (Landing)
├── Header.tsx
├── Navigation.tsx
└── Footer.tsx

translate/page.tsx
├── WebcamView.tsx ──── useWebcam.ts
│   └── CanvasOverlay.tsx
├── PredictionDisplay.tsx
├── useMediaPipe.ts ──── lib/mediapipe/handLandmarker.ts
├── useModel.ts ──────── lib/tensorflow/classifier.ts
└── usePrediction.ts (depends on useMediaPipe + useModel)

dictionary/page.tsx
├── SignGrid.tsx
│   └── SignCard.tsx
└── lib/data/bisindo-dictionary.json

dictionary/[letter]/page.tsx
└── (detail view, uses bisindo-dictionary.json)

learn/page.tsx
├── LessonCard.tsx
└── useProgress.ts ──── localStorage

learn/[letter]/page.tsx
├── PracticeMode.tsx ── useWebcam + useMediaPipe + useModel
├── QuizMode.tsx ────── useWebcam + useMediaPipe + useModel
└── useProgress.ts
```

---

## III. Desain Data & Manajemen State

### 3.1 Skema Data Persisten (localStorage)

Karena Isyara adalah client-only tanpa database server, semua data persisten disimpan di `localStorage`. Berikut definisi skema dalam format pseudo-DDL untuk kejelasan tipe data:

```sql
-- ============================================================
-- TABEL: isyara_progress (localStorage key: "isyara_progress")
-- Serialisasi: JSON.stringify() → localStorage.setItem()
-- Ukuran maksimum: < 1 KB (well within 5MB localStorage limit)
-- ============================================================

CREATE TABLE isyara_progress (
    -- Huruf yang sudah dikuasai (confidence >= 90% pada practice mode)
    mastered_letters    VARCHAR[]       NOT NULL DEFAULT '[]',
    -- Contoh: ["A", "B", "C", "I", "L"]
    
    -- Skor tertinggi quiz (0-10)
    quiz_high_score     SMALLINT        NOT NULL DEFAULT 0
                        CHECK (quiz_high_score BETWEEN 0 AND 10),
    
    -- Total sesi latihan yang diselesaikan
    total_practice      INTEGER         NOT NULL DEFAULT 0,
    
    -- Streak belajar berturut-turut (hari)
    current_streak      SMALLINT        NOT NULL DEFAULT 0,
    
    -- Tanggal terakhir aktif (ISO 8601 date string)
    last_active_date    DATE            DEFAULT NULL,
    -- Format: "2026-10-05"
    
    -- Preferensi bahasa UI
    preferred_language  VARCHAR(2)      NOT NULL DEFAULT 'id'
                        CHECK (preferred_language IN ('id', 'en')),
    
    -- Preferensi tema
    preferred_theme     VARCHAR(5)      NOT NULL DEFAULT 'light'
                        CHECK (preferred_theme IN ('light', 'dark')),
    
    -- Per-letter statistics
    letter_stats        JSONB           NOT NULL DEFAULT '{}'
    -- Struktur: { "A": { "attempts": 15, "successes": 12, "best_confidence": 0.97 }, ... }
);
```

### 3.2 Skema Data Statis (JSON)

```sql
-- ============================================================
-- TABEL: bisindo_dictionary (file: bisindo-dictionary.json)
-- Loaded at build time, embedded in JS bundle
-- Read-only, immutable at runtime
-- ============================================================

CREATE TABLE bisindo_dictionary (
    id              CHAR(1)         PRIMARY KEY,    -- "A" .. "Z"
    name_id         VARCHAR(20)     NOT NULL,       -- Nama dalam Bahasa Indonesia
    name_en         VARCHAR(20)     NOT NULL,       -- Nama dalam English
    type            VARCHAR(10)     NOT NULL        -- "one-handed" | "two-handed"
                    CHECK (type IN ('one-handed', 'two-handed')),
    description_id  TEXT            NOT NULL,       -- Instruksi posisi tangan (ID)
    description_en  TEXT            NOT NULL,       -- Instruksi posisi tangan (EN)
    tips_id         TEXT            DEFAULT NULL,   -- Tips tambahan (ID)
    tips_en         TEXT            DEFAULT NULL,   -- Tips tambahan (EN)
    image_path      VARCHAR(100)    NOT NULL,       -- "/images/bisindo/A.png"
    difficulty      VARCHAR(6)      NOT NULL        -- "easy" | "medium" | "hard"
                    CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

-- Total rows: 26 (A-Z)
-- Estimated file size: ~8 KB (uncompressed JSON)
```

### 3.3 State Machine: Webcam Lifecycle (`MOD-CAM`)

```
                    ┌─────────────┐
                    │    IDLE      │
                    │ (No camera) │
                    └──────┬──────┘
                           │ User clicks "Mulai Kamera"
                           ▼
                    ┌─────────────┐
                    │ REQUESTING  │
                    │ (Permission │
                    │  dialog)    │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │ GRANTED    │            │ DENIED
              ▼            │            ▼
       ┌─────────────┐    │     ┌─────────────┐
       │ INITIALIZING│    │     │   ERROR      │
       │ (Loading    │    │     │ "Kamera      │
       │  MediaPipe) │    │     │  diperlukan" │
       └──────┬──────┘    │     │ [Coba Lagi]  │
              │           │     └──────┬───────┘
              │ Model loaded          │ User clicks retry
              ▼            │          └──────▶ (back to REQUESTING)
       ┌─────────────┐    │
       │   ACTIVE     │    │
       │ (Streaming   │    │
       │  + detecting)│    │
       └──────┬──────┘    │
              │           │
              │ User navigates away / clicks stop
              ▼
       ┌─────────────┐
       │  STOPPED     │
       │ (Stream      │
       │  released)   │
       └─────────────┘

States enum:
  IDLE | REQUESTING | INITIALIZING | ACTIVE | ERROR | STOPPED
```

### 3.4 State Machine: Prediction Pipeline (`MOD-ML`)

```
                    ┌──────────────┐
                    │  MODEL_IDLE  │
                    │  (Not loaded)│
                    └──────┬───────┘
                           │ Translate page mounted
                           ▼
                    ┌──────────────┐
                    │ MODEL_LOADING│  ← Show skeleton loader
                    │ (Fetching    │
                    │  model.json) │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────────┐
              │ Success    │                │ Network error
              ▼            │                ▼
       ┌──────────────┐   │        ┌───────────────┐
       │ MODEL_READY  │   │        │ MODEL_ERROR   │
       │ (Waiting for │   │        │ "Gagal memuat │
       │  hand input) │   │        │  model AI"    │
       └──────┬───────┘   │        │ [Muat Ulang]  │
              │           │        └───────────────┘
              │ Hand detected by MediaPipe
              ▼
       ┌──────────────┐
       │ PREDICTING   │ ← requestAnimationFrame loop
       │              │
       │ Pipeline:    │
       │ 1. Get landmarks (21×3 = 63 floats)
       │ 2. Normalize (relative to wrist)
       │ 3. model.predict() → [26 probabilities]
       │ 4. Push to SmoothingBuffer(size=7)
       │ 5. Output: { letter, confidence }
       │              │
       └──────┬───────┘
              │ Hand lost
              ▼
       ┌──────────────┐
       │ NO_HAND      │
       │ "Tunjukkan   │
       │  tangan Anda"│
       └──────┬───────┘
              │ Hand re-detected
              └──────▶ (back to PREDICTING)
```

### 3.5 Strategi Caching

| Asset | Strategi | TTL / Invalidasi |
|-------|----------|------------------|
| **TF.js model files** (`model.json`, `*.bin`) | Service Worker Cache-First | Permanent — invalidasi via filename hash saat model di-update |
| **MediaPipe WASM + model** | Service Worker Cache-First | Permanent — versioned by MediaPipe release |
| **BISINDO reference images** | Service Worker Cache-First | Permanent — immutable assets |
| **HTML/JS/CSS bundles** | Vercel CDN + stale-while-revalidate | Otomatis invalidasi saat deploy baru |
| **localStorage (progress)** | Browser-native | Tidak expire; max 5MB per origin |

```typescript
// Service Worker cache key pattern
const CACHE_NAME = 'isyara-v1';
const PRECACHE_ASSETS = [
  '/model/model.json',
  '/model/group1-shard1of1.bin',
  '/images/bisindo/A.png',
  // ... semua 26 huruf
];
```

---

## IV. Spesifikasi Kontrak Internal & Komunikasi Antar-Komponen

> [!NOTE]
> Karena Isyara adalah client-only app tanpa REST API server, bagian ini mendefinisikan **kontrak internal antar-komponen** (TypeScript interfaces dan hook contracts) sebagai pengganti endpoint API tradisional.

### 4.1 Interface Contracts (TypeScript)

#### Contract 1: `useWebcam` Hook

```typescript
// ─── MOD-CAM: Webcam Stream Management ───────────────────────
interface UseWebcamReturn {
  /** Video element ref untuk di-attach ke <video> */
  videoRef: React.RefObject<HTMLVideoElement>;
  
  /** State lifecycle kamera */
  status: 'idle' | 'requesting' | 'initializing' | 'active' | 'error' | 'stopped';
  
  /** Error message jika status === 'error' */
  error: string | null;
  
  /** Mulai stream webcam. Triggers browser permission dialog */
  startCamera: () => Promise<void>;
  
  /** Stop stream dan release resources */
  stopCamera: () => void;
  
  /** Constraints yang digunakan */
  constraints: MediaStreamConstraints;
}

// Constraints default:
const DEFAULT_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    facingMode: 'user',         // Kamera depan
    width: { ideal: 640 },      // Max 640px width
    height: { ideal: 480 },     // Max 480px height
    frameRate: { ideal: 30, max: 30 }
  },
  audio: false                  // Tidak perlu audio
};
```

#### Contract 2: `useMediaPipe` Hook

```typescript
// ─── MOD-CAM: MediaPipe Hand Landmarker ──────────────────────
interface HandLandmark {
  x: number;  // Normalized [0, 1] relative to image width
  y: number;  // Normalized [0, 1] relative to image height
  z: number;  // Depth relative to wrist
}

interface MediaPipeResult {
  /** 21 landmarks per hand, max 2 hands */
  landmarks: HandLandmark[][] | null;
  
  /** Handedness: 'Left' | 'Right' */
  handedness: string[] | null;
  
  /** Timestamp of detection */
  timestamp: number;
}

interface UseMediaPipeReturn {
  /** Apakah model MediaPipe sudah loaded */
  isLoaded: boolean;
  
  /** Loading progress (0-100) */
  loadingProgress: number;
  
  /** Error saat loading */
  error: string | null;
  
  /** Detect hands dari video frame. Returns null jika tidak ada tangan */
  detect: (video: HTMLVideoElement) => MediaPipeResult | null;
}
```

#### Contract 3: `useModel` Hook (TF.js Classifier)

```typescript
// ─── MOD-ML: TensorFlow.js Model Loading ─────────────────────
interface UseModelReturn {
  /** Apakah model TF.js sudah loaded */
  isLoaded: boolean;
  
  /** Error saat loading model */
  error: string | null;
  
  /** 
   * Predict huruf dari normalized landmarks.
   * @param landmarks - Array of 63 floats (21 landmarks × 3 coords)
   * @returns Prediction result dengan letter dan confidence
   */
  predict: (landmarks: number[]) => PredictionResult;
}

interface PredictionResult {
  /** Huruf yang diprediksi ("A" - "Z") */
  letter: string;
  
  /** Confidence score (0.0 - 1.0) */
  confidence: number;
  
  /** Top 3 prediksi untuk debugging */
  top3: Array<{ letter: string; confidence: number }>;
  
  /** Inference time dalam milliseconds */
  inferenceTimeMs: number;
}
```

#### Contract 4: `usePrediction` Hook (Smoothing Pipeline)

```typescript
// ─── MOD-ML: Prediction Smoothing ────────────────────────────
interface SmoothingConfig {
  /** Jumlah frame dalam buffer. Default: 7 */
  bufferSize: number;
  
  /** Minimum confidence untuk dianggap valid. Default: 0.65 */
  minConfidence: number;
  
  /** Minimum kemunculan huruf di buffer untuk output. Default: 4 */
  minConsensus: number;
}

interface UsePredictionReturn {
  /** Huruf yang sedang ditampilkan (sudah di-smooth) */
  currentLetter: string | null;
  
  /** Confidence score rata-rata dari buffer */
  averageConfidence: number;
  
  /** Apakah sedang aktif mendeteksi */
  isDetecting: boolean;
  
  /** Start prediction loop (requestAnimationFrame) */
  startPrediction: () => void;
  
  /** Stop prediction loop */
  stopPrediction: () => void;
  
  /** Reset buffer */
  resetBuffer: () => void;
}

// Default config:
const DEFAULT_SMOOTHING: SmoothingConfig = {
  bufferSize: 7,
  minConfidence: 0.65,
  minConsensus: 4
};
```

#### Contract 5: `useProgress` Hook

```typescript
// ─── MOD-STATE: Progress Tracking ────────────────────────────
interface LetterStats {
  attempts: number;
  successes: number;
  bestConfidence: number;
}

interface ProgressData {
  masteredLetters: string[];
  quizHighScore: number;
  totalPractice: number;
  currentStreak: number;
  lastActiveDate: string | null;
  preferredLanguage: 'id' | 'en';
  preferredTheme: 'light' | 'dark';
  letterStats: Record<string, LetterStats>;
}

interface UseProgressReturn {
  /** Data progress saat ini */
  progress: ProgressData;
  
  /** Tandai huruf sebagai mastered */
  markMastered: (letter: string) => void;
  
  /** Rekam sesi latihan */
  recordPractice: (letter: string, success: boolean, confidence: number) => void;
  
  /** Update skor quiz */
  updateQuizScore: (score: number) => void;
  
  /** Update streak (dipanggil saat app dibuka) */
  updateStreak: () => void;
  
  /** Set preferensi bahasa */
  setLanguage: (lang: 'id' | 'en') => void;
  
  /** Set preferensi tema */
  setTheme: (theme: 'light' | 'dark') => void;
  
  /** Reset semua progress */
  resetAll: () => void;
}
```

#### Contract 6: Quiz Engine

```typescript
// ─── MOD-LEARN: Quiz Logic ───────────────────────────────────
interface QuizConfig {
  /** Jumlah soal. Fixed: 10 */
  totalQuestions: 10;
  
  /** Durasi per soal dalam detik. Default: 15 */
  timePerQuestion: number;
  
  /** Minimum confidence untuk jawaban dianggap benar. Default: 0.75 */
  minCorrectConfidence: number;
}

type QuizState = 'idle' | 'countdown' | 'active' | 'checking' | 'result' | 'finished';

interface QuizQuestion {
  /** Index soal (0-9) */
  index: number;
  
  /** Huruf yang harus ditunjukkan */
  targetLetter: string;
  
  /** Apakah dijawab benar */
  isCorrect: boolean | null;
  
  /** Sisa waktu saat dijawab (detik) */
  timeRemaining: number | null;
}

interface UseQuizReturn {
  state: QuizState;
  currentQuestion: QuizQuestion | null;
  score: number;
  questions: QuizQuestion[];
  timeRemaining: number;
  startQuiz: () => void;
  submitAnswer: (letter: string, confidence: number) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}
```

#### Contract 7: Internationalization

```typescript
// ─── MOD-I18N: Language System ────────────────────────────────
type SupportedLocale = 'id' | 'en';

interface Translations {
  // Navigation
  nav_translate: string;      // "Translate" / "Terjemahkan"
  nav_learn: string;          // "Learn" / "Belajar"
  nav_dictionary: string;     // "Dictionary" / "Kamus"
  
  // Translate page
  translate_title: string;
  translate_start_camera: string;
  translate_stop_camera: string;
  translate_no_hand: string;
  translate_detecting: string;
  
  // Learn page
  learn_title: string;
  learn_practice: string;
  learn_quiz: string;
  learn_progress: string;
  
  // Dictionary page
  dict_title: string;
  dict_one_handed: string;
  dict_two_handed: string;
  
  // Common
  common_loading: string;
  common_error: string;
  common_retry: string;
  common_correct: string;
  common_incorrect: string;
  common_score: string;
  
  // ... (60+ keys total)
}

interface UseLanguageReturn {
  locale: SupportedLocale;
  t: Translations;
  setLocale: (locale: SupportedLocale) => void;
}
```

#### Contract 8: Landmark Normalization Function

```typescript
// ─── MOD-ML: Preprocessing ───────────────────────────────────
/**
 * Normalize 21 hand landmarks relative to wrist position.
 * 
 * Algorithm:
 * 1. Subtract wrist (landmark[0]) position from all landmarks
 * 2. Calculate max distance from wrist
 * 3. Divide all coords by max distance
 * 
 * @param landmarks - Raw MediaPipe output: 21 × {x, y, z}
 * @returns Flat array of 63 normalized floats
 * 
 * Invariants:
 * - Output length === 63
 * - All values in range [-1.0, 1.0]
 * - Wrist position always at origin (0, 0, 0)
 */
function normalizeLandmarks(landmarks: HandLandmark[]): number[];
```

### 4.2 Event Bus Schema (Internal Events)

```typescript
// ─── Internal Event System (Custom Events / Callback Props) ──
type IsyaraEvent =
  | { type: 'CAMERA_GRANTED'; timestamp: number }
  | { type: 'CAMERA_DENIED'; timestamp: number }
  | { type: 'MODEL_LOADED'; loadTimeMs: number }
  | { type: 'MODEL_ERROR'; error: string }
  | { type: 'PREDICTION'; letter: string; confidence: number; latencyMs: number }
  | { type: 'HAND_DETECTED'; handedness: string }
  | { type: 'HAND_LOST'; timestamp: number }
  | { type: 'LESSON_STARTED'; letter: string }
  | { type: 'LESSON_COMPLETED'; letter: string; attempts: number }
  | { type: 'QUIZ_STARTED'; timestamp: number }
  | { type: 'QUIZ_COMPLETED'; score: number; durationSec: number }
  | { type: 'LANGUAGE_CHANGED'; from: SupportedLocale; to: SupportedLocale }
  | { type: 'THEME_CHANGED'; theme: 'light' | 'dark' }
  | { type: 'PWA_INSTALLED'; timestamp: number };
```

### 4.3 Error Codes Catalog

| Code | Nama | Trigger | User-Facing Message (ID) | User-Facing Message (EN) |
|------|------|---------|--------------------------|--------------------------|
| `E-CAM-001` | Camera Permission Denied | `getUserMedia` rejected | "Isyara memerlukan akses kamera untuk mendeteksi isyarat" | "Isyara needs camera access to detect signs" |
| `E-CAM-002` | Camera Not Found | No video devices | "Tidak ada kamera terdeteksi. Pastikan webcam terhubung" | "No camera detected. Please connect a webcam" |
| `E-CAM-003` | Camera In Use | `NotReadableError` | "Kamera sedang digunakan oleh aplikasi lain" | "Camera is being used by another application" |
| `E-ML-001` | Model Load Failed | Network error loading model.json | "Gagal memuat model AI. Periksa koneksi internet Anda" | "Failed to load AI model. Check your internet connection" |
| `E-ML-002` | Model Predict Failed | Runtime error in predict() | "Terjadi kesalahan saat memproses isyarat" | "An error occurred while processing the sign" |
| `E-MP-001` | MediaPipe Load Failed | WASM/model fetch error | "Gagal memuat sistem deteksi tangan" | "Failed to load hand detection system" |
| `E-MP-002` | WebGL Not Supported | No WebGL context | "Browser Anda tidak mendukung fitur ini. Gunakan Chrome/Edge terbaru" | "Your browser doesn't support this feature. Use latest Chrome/Edge" |
| `E-STOR-001` | LocalStorage Full | QuotaExceededError | "Penyimpanan lokal penuh. Hapus data browser untuk melanjutkan" | "Local storage is full. Clear browser data to continue" |

---

---

## V. Logika Bisnis Teknis, Validasi, & Algoritma

### 5.1 Algoritma: Landmark Normalization

```
FUNCTION normalizeLandmarks(rawLandmarks: HandLandmark[21]) → float[63]

  PRECONDITION:
    rawLandmarks.length === 21
    Each landmark has {x, y, z} in range [0, 1] (image-relative)

  ALGORITHM:
    1. wrist ← rawLandmarks[0]                    // Anchor point

    2. FOR i = 0 TO 20:                            // Translate to origin
         centered[i].x ← rawLandmarks[i].x - wrist.x
         centered[i].y ← rawLandmarks[i].y - wrist.y
         centered[i].z ← rawLandmarks[i].z - wrist.z

    3. maxDist ← 0
       FOR i = 1 TO 20:                            // Find max euclidean dist
         dist ← sqrt(centered[i].x² + centered[i].y² + centered[i].z²)
         IF dist > maxDist THEN maxDist ← dist

    4. IF maxDist === 0 THEN maxDist ← 1           // Prevent division by zero

    5. result ← []
       FOR i = 0 TO 20:                            // Scale to [-1, 1]
         result.push(centered[i].x / maxDist)
         result.push(centered[i].y / maxDist)
         result.push(centered[i].z / maxDist)

    6. RETURN result                                // float[63]

  POSTCONDITION:
    result.length === 63
    result[0] === 0, result[1] === 0, result[2] === 0   // Wrist at origin
    ∀ val ∈ result: -1.0 ≤ val ≤ 1.0

  COMPLEXITY: O(n) where n = 21 landmarks
  LATENCY TARGET: ≤ 0.1ms per call
```

### 5.2 Algoritma: Prediction Smoothing Buffer

```
CLASS SmoothingBuffer
  PROPERTIES:
    buffer: string[]          // Circular buffer of predicted letters
    size: int = 7             // Buffer capacity
    minConsensus: int = 4     // Min occurrences for output
    minConfidence: float = 0.65

  METHOD push(prediction: PredictionResult) → StableResult | null

    1. IF prediction.confidence < minConfidence:
         RETURN null                 // Reject low-confidence predictions

    2. buffer.push(prediction.letter)
       IF buffer.length > size:
         buffer.shift()              // Remove oldest entry

    3. IF buffer.length < minConsensus:
         RETURN null                 // Not enough data yet

    4. frequencyMap ← countOccurrences(buffer)
       // Example: {"A": 5, "B": 1, "S": 1}

    5. mostFrequent ← argmax(frequencyMap)
       count ← frequencyMap[mostFrequent]

    6. IF count >= minConsensus:
         avgConfidence ← average of confidence scores for mostFrequent
         RETURN { letter: mostFrequent, confidence: avgConfidence }
       ELSE:
         RETURN null                 // No consensus reached

  METHOD reset():
    buffer ← []

  INVARIANTS:
    buffer.length ≤ size
    Output changes only when consensus threshold is met
    Prevents "flickering" between similar letters (e.g., M/N)
```

### 5.3 Algoritma: Quiz Scoring Engine

```
CLASS QuizEngine
  PROPERTIES:
    questions: QuizQuestion[10]
    currentIndex: int = 0
    score: int = 0
    timePerQuestion: int = 15       // seconds
    minCorrectConfidence: float = 0.75

  METHOD generateQuestions() → QuizQuestion[10]:
    1. pool ← shuffle(["A".."Z"])
    2. selected ← pool.slice(0, 10)
    3. RETURN selected.map((letter, i) => ({
         index: i,
         targetLetter: letter,
         isCorrect: null,
         timeRemaining: null
       }))

  METHOD evaluateAnswer(detectedLetter: string, confidence: float, timeLeft: int):
    q ← questions[currentIndex]

    IF detectedLetter === q.targetLetter AND confidence >= minCorrectConfidence:
      q.isCorrect ← true
      q.timeRemaining ← timeLeft
      score ← score + 1
    ELSE IF timeLeft <= 0:
      q.isCorrect ← false
      q.timeRemaining ← 0
    ELSE:
      // Continue detecting — answer not yet submitted
      RETURN CONTINUE

    currentIndex ← currentIndex + 1

    IF currentIndex >= 10:
      RETURN QUIZ_FINISHED
    ELSE:
      RETURN NEXT_QUESTION

  SCORING:
    Final score = count of q.isCorrect === true (range: 0–10)
    No partial credit
    No time bonus (v1.0)
```

### 5.4 Algoritma: Streak Calculation

```
FUNCTION updateStreak(progress: ProgressData) → ProgressData

  today ← formatDate(Date.now())     // "2026-10-05"
  lastActive ← progress.lastActiveDate

  CASE lastActive:
    null:
      // First time ever
      progress.currentStreak ← 1
      progress.lastActiveDate ← today

    today:
      // Already counted today — no change
      RETURN progress

    yesterday(today):
      // Consecutive day — increment
      progress.currentStreak ← progress.currentStreak + 1
      progress.lastActiveDate ← today

    DEFAULT:
      // Streak broken (gap > 1 day)
      progress.currentStreak ← 1
      progress.lastActiveDate ← today

  RETURN progress

  HELPER yesterday(dateStr):
    RETURN formatDate(Date.parse(dateStr) - 86400000)
```

### 5.5 Mastery Criteria

```
FUNCTION checkMastery(letterStats: LetterStats) → boolean

  RULES (ALL must be true):
    1. letterStats.attempts >= 5          // Minimum 5 practice attempts
    2. letterStats.successes >= 3         // At least 3 correct
    3. letterStats.bestConfidence >= 0.90  // At least once ≥ 90% confidence
    4. successRate ← successes / attempts
       successRate >= 0.60                // Overall 60%+ success rate

  RETURN rule1 AND rule2 AND rule3 AND rule4
```

### 5.6 Validasi Input

| Input | Validasi | Aksi jika Invalid |
|-------|----------|-------------------|
| Video frame ke MediaPipe | Frame harus memiliki `videoWidth > 0` dan `readyState >= 2` | Skip frame, lanjut ke frame berikutnya |
| Landmark array ke normalization | Array length harus === 21 | Return `null`, log warning |
| Normalized array ke TF.js model | Array length harus === 63, semua float | Throw `E-ML-002` |
| Quiz answer confidence | Harus `number` dalam range `[0, 1]` | Clamp ke `[0, 1]` |
| localStorage read | Harus valid JSON sesuai `ProgressData` schema | Reset ke default, log `E-STOR-001` |
| Language preference | Harus `'id'` atau `'en'` | Fallback ke `'id'` |
| Theme preference | Harus `'light'` atau `'dark'` | Fallback ke `'light'` |

---

## VI. Kebutuhan Non-Fungsional Teknis (NFR) & Keamanan

### 6.1 Target Kinerja

| Metrik | Target | Pengukuran | Threshold Alarm |
|--------|--------|------------|-----------------|
| **Inference latency (p50)** | ≤ 50ms per frame | `performance.now()` around `model.predict()` | > 100ms |
| **Inference latency (p99)** | ≤ 150ms per frame | — | > 200ms |
| **MediaPipe detection** | ≤ 30ms per frame | `performance.now()` around `detect()` | > 60ms |
| **End-to-end pipeline** | ≤ 100ms total (detect + normalize + predict + smooth) | — | > 200ms |
| **Frame rate (detection loop)** | ≥ 15 FPS (target 30 FPS) | `requestAnimationFrame` counter | < 10 FPS |
| **Model file download** | ≤ 3s on 3G connection (1.5 Mbps) | Model size < 562 KB | > 5s |
| **First Contentful Paint** | ≤ 2s | Lighthouse | > 3s |
| **Largest Contentful Paint** | ≤ 3s | Lighthouse | > 4s |
| **Time to Interactive** | ≤ 5s | Lighthouse | > 8s |
| **Cumulative Layout Shift** | ≤ 0.1 | Lighthouse | > 0.25 |
| **Total JS bundle (gzipped)** | ≤ 300 KB (excl. model & MediaPipe) | `next build` output | > 500 KB |
| **Memory usage (steady state)** | ≤ 200 MB | Chrome DevTools Memory tab | > 350 MB |

### 6.2 Keamanan

| Aspek | Implementasi Teknis | Standar |
|-------|---------------------|---------|
| **Transport Encryption** | TLS 1.3 (enforced by Vercel). HSTS header: `max-age=63072000; includeSubDomains; preload` | OWASP A02 |
| **Content Security Policy** | `default-src 'self'; script-src 'self' 'unsafe-eval' blob:; worker-src 'self' blob:; connect-src 'self' https://cdn.jsdelivr.net; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline';` | OWASP A03 |
| **Camera Access** | Browser Permissions API; explicit user consent via `getUserMedia`. No auto-start. Permission revocable anytime via browser settings | W3C MediaCapture |
| **Data Privacy** | Zero data transmission. No webcam frames, landmarks, or predictions leave the browser. No analytics cookies. No tracking pixels | GDPR-ready by design |
| **localStorage** | Non-sensitive data only (progress, preferences). No PII, no auth tokens. Schema validation on read (reject corrupted data) | — |
| **Dependency Security** | `npm audit` on every build. Dependabot alerts on GitHub. Pin major versions in `package.json` | OWASP A06 |
| **X-Frame-Options** | `DENY` — prevent clickjacking via iframe embedding | OWASP A05 |
| **X-Content-Type-Options** | `nosniff` — prevent MIME type sniffing | — |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | — |

### 6.3 Reliabilitas & Graceful Degradation

| Skenario Failure | Dampak | Degradation Strategy |
|------------------|--------|----------------------|
| WebGL tidak tersedia | TF.js tidak bisa inference | Full-page fallback: "Browser tidak mendukung. Gunakan Chrome/Edge terbaru." + link download |
| WASM tidak tersedia | MediaPipe tidak bisa load | Same as above |
| Model file corrupt/gagal download | Predict tidak bisa jalan | Show retry button. Cache-first strategy prevents repeat downloads |
| Webcam hardware error mid-session | Stream terputus | Auto-detect stream end → show "Koneksi kamera terputus. [Mulai Ulang]" |
| localStorage penuh | Progress tidak bisa disimpan | Show toast warning. App tetap berfungsi (in-memory state) |
| JavaScript disabled | App tidak render | `<noscript>` tag: "Isyara memerlukan JavaScript untuk berfungsi" |
| Slow device (< 10 FPS) | UX buruk, prediksi lambat | Auto-detect FPS < 10 → reduce video resolution to 320×240, disable canvas overlay |

### 6.4 Accessibility (a11y) Requirements

| Requirement | WCAG Level | Implementation |
|-------------|-----------|----------------|
| Keyboard navigation | AA | All interactive elements focusable. `Tab` order logical. `Enter`/`Space` triggers actions |
| Screen reader support | AA | Semantic HTML (`<main>`, `<nav>`, `<section>`). `aria-label` on buttons. `aria-live="polite"` for prediction updates |
| Color contrast | AA | Minimum 4.5:1 for normal text, 3:1 for large text (verified with both light/dark themes) |
| Focus indicators | AA | Visible focus ring on all interactive elements (2px solid, high contrast) |
| Motion reduction | AA | `prefers-reduced-motion` media query → disable Framer Motion animations |
| Tap target size | — | Minimum 44×44px on all touchable elements |
| Alt text | A | All BISINDO reference images have descriptive `alt` attributes |

---

## VII. Integrasi Eksternal & Pola Ketahanan (Resilience)

### 7.1 Dependensi Eksternal

| Dependensi | Tipe | Load Time | Failure Impact | Mitigation |
|------------|------|-----------|----------------|------------|
| **MediaPipe WASM + Model** | CDN (`cdn.jsdelivr.net`) | ~2 MB total, one-time download | App non-functional (no hand detection) | Cache via Service Worker. Fallback: bundle WASM in `public/` as self-hosted backup |
| **TF.js Model Files** | Self-hosted (`/model/`) | < 1 MB, one-time download | Translate mode non-functional | Precache in Service Worker. Retry with exponential backoff (max 3 attempts) |
| **BISINDO Reference Images** | Self-hosted (`/images/bisindo/`) | ~1.3 MB total (26 × 50KB) | Dictionary shows broken images | Precache in Service Worker. Lazy load with `loading="lazy"`. Placeholder SVG fallback |
| **Google Fonts (Inter)** | CDN (`fonts.googleapis.com`) | ~15 KB | Fallback to system font | `font-display: swap` in CSS. System font stack as fallback |
| **Vercel CDN** | Hosting | N/A (serves all assets) | Entire app offline | Service Worker enables offline-first after initial visit |

### 7.2 Pola Toleransi Kegagalan

#### Retry Pattern (Model & Asset Loading)

```typescript
async function loadWithRetry<T>(
  loadFn: () => Promise<T>,
  config: {
    maxAttempts: 3,
    baseDelayMs: 1000,
    maxDelayMs: 8000,
    backoffMultiplier: 2
  }
): Promise<T> {
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await loadFn();
    } catch (error) {
      if (attempt === config.maxAttempts) throw error;
      
      const delay = Math.min(
        config.baseDelayMs * Math.pow(config.backoffMultiplier, attempt - 1),
        config.maxDelayMs
      );
      // Delay: 1s → 2s → 4s (capped at 8s)
      await sleep(delay);
    }
  }
}
```

#### Adaptive Quality Pattern (Performance)

```typescript
class AdaptiveQuality {
  private fpsHistory: number[] = [];
  private readonly FPS_WINDOW = 30;       // Track last 30 frames
  private readonly LOW_FPS_THRESHOLD = 10;
  private currentQuality: 'high' | 'medium' | 'low' = 'high';

  onFrame(fps: number): QualityConfig {
    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > this.FPS_WINDOW) {
      this.fpsHistory.shift();
    }

    const avgFps = average(this.fpsHistory);

    if (avgFps < this.LOW_FPS_THRESHOLD && this.currentQuality !== 'low') {
      this.currentQuality = 'low';
      return {
        videoWidth: 320,
        videoHeight: 240,
        targetFps: 15,
        drawLandmarks: false        // Disable canvas overlay
      };
    }

    return {
      videoWidth: 640,
      videoHeight: 480,
      targetFps: 30,
      drawLandmarks: true
    };
  }
}
```

### 7.3 Offline Strategy (PWA)

```typescript
// Service Worker Caching Strategy
const STRATEGIES = {
  // Model files: Cache-first (never changes within version)
  '/model/*': 'CacheFirst',
  
  // BISINDO images: Cache-first (immutable assets)
  '/images/bisindo/*': 'CacheFirst',
  
  // MediaPipe WASM: Cache-first (versioned externally)
  'cdn.jsdelivr.net/npm/@mediapipe/*': 'CacheFirst',
  
  // HTML pages: Network-first (get latest, fallback to cache)
  '/*.html': 'NetworkFirst',
  
  // JS/CSS bundles: Stale-while-revalidate
  '/_next/static/*': 'StaleWhileRevalidate',
  
  // Fonts: Cache-first
  'fonts.googleapis.com/*': 'CacheFirst'
};

// Precache manifest (installed on SW activation)
const PRECACHE = [
  '/',
  '/translate',
  '/learn',
  '/dictionary',
  '/model/model.json',
  '/model/group1-shard1of1.bin',
  ...BISINDO_IMAGES  // All 26 letter images
];
// Estimated total precache size: ~4.5 MB
```

---

## VIII. Observabilitas, Telemetri, & Manajemen Log

### 8.1 Standar Logging

Semua log menggunakan format JSON terstruktur yang di-output ke `console`. Pada v1.0, log hanya tersedia di browser DevTools. Pada v2.0, dapat dihubungkan ke external service (Sentry, LogRocket).

```typescript
interface LogEntry {
  timestamp: string;         // ISO 8601: "2026-10-05T14:30:00.123Z"
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  module: string;            // "MOD-CAM" | "MOD-ML" | "MOD-LEARN" | etc.
  event: string;             // Event name from IsyaraEvent type
  data?: Record<string, unknown>;  // Structured payload
  error?: {
    code: string;            // From Error Codes Catalog
    message: string;
    stack?: string;
  };
}

// Example log outputs:
// ✅ Info
{"timestamp":"2026-10-05T14:30:00.123Z","level":"INFO","module":"MOD-ML","event":"MODEL_LOADED","data":{"loadTimeMs":2340,"modelSize":"487KB"}}

// ❌ Error
{"timestamp":"2026-10-05T14:30:01.456Z","level":"ERROR","module":"MOD-CAM","event":"CAMERA_DENIED","error":{"code":"E-CAM-001","message":"NotAllowedError: Permission denied"}}

// 📊 Performance
{"timestamp":"2026-10-05T14:30:02.789Z","level":"DEBUG","module":"MOD-ML","event":"PREDICTION","data":{"letter":"A","confidence":0.94,"latencyMs":42,"fps":28}}
```

### 8.2 Logger Implementation

```typescript
class IsyaraLogger {
  private static instance: IsyaraLogger;
  private logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' = 'INFO';
  
  // Production: 'INFO' (suppress DEBUG)
  // Development: 'DEBUG' (show all)

  log(entry: Omit<LogEntry, 'timestamp'>): void {
    if (!this.shouldLog(entry.level)) return;
    
    const fullEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };

    switch (entry.level) {
      case 'ERROR': console.error(JSON.stringify(fullEntry)); break;
      case 'WARN':  console.warn(JSON.stringify(fullEntry));  break;
      case 'INFO':  console.info(JSON.stringify(fullEntry));  break;
      case 'DEBUG': console.debug(JSON.stringify(fullEntry)); break;
    }

    // v2.0 hook: send to external service
    // this.externalSink?.push(fullEntry);
  }
}
```

### 8.3 Metrik Pemantauan & Alerting Triggers

| Metrik | Cara Mengukur | Threshold Normal | Alert Trigger |
|--------|--------------|------------------|---------------|
| **Detection FPS** | `requestAnimationFrame` counter per second | 15-30 FPS | < 10 FPS selama > 5 detik → trigger `AdaptiveQuality` |
| **Inference Latency** | `performance.now()` delta around `predict()` | p50 ≤ 50ms | p99 > 200ms → log WARNING |
| **Model Load Time** | Timer from `loadLayersModel()` start to resolve | ≤ 3s (WiFi), ≤ 8s (3G) | > 10s → log ERROR, show retry |
| **Memory Usage** | `performance.memory.usedJSHeapSize` (Chrome only) | ≤ 200 MB | > 300 MB → log WARNING, suggest page reload |
| **Error Rate** | Count of ERROR-level logs per session | 0-1 per session | > 3 errors in 1 minute → show "Terjadi masalah berulang" banner |
| **Prediction Accuracy (self-reported)** | Practice mode: correct / total attempts | ≥ 70% | < 50% → suggest "Coba posisikan tangan lebih dekat" |

### 8.4 Performance Monitoring Hook

```typescript
function usePerformanceMonitor() {
  const metricsRef = useRef({
    frameCount: 0,
    totalInferenceMs: 0,
    lastFpsUpdate: Date.now(),
    currentFps: 0,
    errorCount: 0
  });

  const recordFrame = (inferenceMs: number) => {
    const m = metricsRef.current;
    m.frameCount++;
    m.totalInferenceMs += inferenceMs;

    const now = Date.now();
    if (now - m.lastFpsUpdate >= 1000) {
      m.currentFps = m.frameCount;
      m.frameCount = 0;
      m.lastFpsUpdate = now;

      // Log performance snapshot every second
      logger.log({
        level: 'DEBUG',
        module: 'MOD-ML',
        event: 'PERF_SNAPSHOT',
        data: {
          fps: m.currentFps,
          avgInferenceMs: Math.round(m.totalInferenceMs / m.currentFps),
          memoryMB: getMemoryUsageMB()
        }
      });

      m.totalInferenceMs = 0;
    }
  };

  return { recordFrame, metrics: metricsRef };
}
```

---

## IX. Strategi Pengujian, Migrasi, & Deployment

### 9.1 Testing Pyramid

```
                    ┌─────────┐
                    │  E2E    │  ← 2-3 critical user flows
                    │ (Manual)│     (Translate, Quiz, Dictionary)
                    └────┬────┘
                         │
                  ┌──────┴──────┐
                  │ Integration │  ← Component + Hook tests
                  │   Tests     │     (React Testing Library)
                  │  (10-15)    │
                  └──────┬──────┘
                         │
              ┌──────────┴──────────┐
              │    Unit Tests       │  ← Pure logic functions
              │     (20-30)         │     (normalization, smoothing,
              │                     │      quiz engine, streak calc)
              └─────────────────────┘
```

### 9.2 Unit Test Coverage Targets

| Modul | Fungsi/Kelas | Min Coverage | Framework |
|-------|-------------|-------------|-----------|
| `MOD-ML` | `normalizeLandmarks()` | 100% | Vitest |
| `MOD-ML` | `SmoothingBuffer` | 100% | Vitest |
| `MOD-LEARN` | `QuizEngine` | 100% | Vitest |
| `MOD-STATE` | `updateStreak()` | 100% | Vitest |
| `MOD-STATE` | `checkMastery()` | 100% | Vitest |
| `MOD-STATE` | `useProgress` (localStorage R/W) | 90% | Vitest + jsdom |
| `MOD-I18N` | Translation completeness | 100% | Vitest (assert all keys exist for both locales) |
| **Overall target** | — | **≥ 80% line coverage** | — |

### 9.3 Unit Test Cases (Prioritas Tinggi)

```typescript
// ─── normalizeLandmarks ──────────────────────────────────────
describe('normalizeLandmarks', () => {
  it('should return array of length 63');
  it('should set wrist (index 0-2) to [0, 0, 0]');
  it('should normalize all values to range [-1, 1]');
  it('should handle all-zero landmarks without division by zero');
  it('should be invariant to hand position in frame');
  it('should be invariant to hand distance from camera');
  it('should throw if landmarks.length !== 21');
});

// ─── SmoothingBuffer ──────────────────────────────────────────
describe('SmoothingBuffer', () => {
  it('should return null when buffer has fewer items than minConsensus');
  it('should return most frequent letter when consensus reached');
  it('should reject predictions below minConfidence');
  it('should handle tie-breaking (prefer latest prediction)');
  it('should reset buffer on reset()');
  it('should not exceed buffer size');
  it('should prevent flickering between similar letters');
});

// ─── QuizEngine ───────────────────────────────────────────────
describe('QuizEngine', () => {
  it('should generate exactly 10 unique questions');
  it('should accept correct answer with confidence >= 0.75');
  it('should reject answer with confidence < 0.75');
  it('should mark question as incorrect when time runs out');
  it('should calculate final score correctly');
  it('should not allow duplicate letters in one quiz');
});

// ─── updateStreak ─────────────────────────────────────────────
describe('updateStreak', () => {
  it('should set streak to 1 on first visit');
  it('should increment streak on consecutive day');
  it('should reset streak to 1 after gap > 1 day');
  it('should not change streak if called twice same day');
});

// ─── checkMastery ─────────────────────────────────────────────
describe('checkMastery', () => {
  it('should return false with < 5 attempts');
  it('should return false with < 3 successes');
  it('should return false with bestConfidence < 0.90');
  it('should return false with success rate < 60%');
  it('should return true when all criteria met');
});
```

### 9.4 Integration Test Cases

| ID | Test Case | Komponen yang Diuji | Tools |
|----|-----------|---------------------|-------|
| IT-01 | Webcam permission grant → video stream renders | `WebcamView`, `useWebcam` | React Testing Library + mock `getUserMedia` |
| IT-02 | MediaPipe loads → landmarks drawn on canvas | `CanvasOverlay`, `useMediaPipe` | RTL + mock MediaPipe |
| IT-03 | Full prediction pipeline: mock landmarks → display letter | `usePrediction`, `PredictionDisplay` | RTL + mock TF.js model |
| IT-04 | Dictionary grid renders 26 cards with correct data | `SignGrid`, `SignCard` | RTL + snapshot test |
| IT-05 | Practice mode: correct sign → success feedback | `PracticeMode` | RTL + mock prediction |
| IT-06 | Quiz flow: start → answer 10 → show score | `QuizMode` | RTL + timer mock |
| IT-07 | Language toggle switches all visible text | `useLanguage`, all pages | RTL |
| IT-08 | Theme toggle switches CSS variables | `useTheme`, `ThemeProvider` | RTL + `getComputedStyle` |
| IT-09 | Progress persists across page reload | `useProgress` | RTL + `localStorage` mock |
| IT-10 | Error boundary catches and displays fallback | Error boundary component | RTL + `throw` in child |

### 9.5 End-to-End Test (Manual Checklist)

| # | Scenario | Steps | Expected Result | Device |
|---|----------|-------|-----------------|--------|
| E2E-01 | Happy path: Translate | 1. Open `/translate` 2. Allow camera 3. Show hand sign "A" | Letter "A" displayed with confidence > 70% within 3 seconds | Desktop Chrome |
| E2E-02 | Happy path: Learn | 1. Open `/learn` 2. Select "A" 3. View reference 4. Practice with webcam | Correct feedback shown when sign matches | Desktop Chrome |
| E2E-03 | Happy path: Quiz | 1. Open `/learn` 2. Start quiz 3. Complete 10 questions | Score displayed, progress saved | Desktop Chrome |
| E2E-04 | Dictionary browse | 1. Open `/dictionary` 2. Click each letter | All 26 detail pages load with images | Desktop Chrome |
| E2E-05 | Mobile responsive | 1. Open app on mobile (or DevTools mobile mode) 2. Navigate all pages | No overflow, no broken layout, readable text | Mobile Chrome |
| E2E-06 | Offline mode | 1. Visit app once (online) 2. Go offline 3. Reload app | App loads from cache, translate works | Desktop Chrome |
| E2E-07 | Camera denied | 1. Open `/translate` 2. Deny camera permission | Error message with retry button shown | Desktop Chrome |
| E2E-08 | Dark mode | 1. Toggle dark mode 2. Navigate all pages | Consistent dark theme, no contrast issues | Desktop Chrome |

### 9.6 Prosedur Migrasi Skema Data

Karena Isyara menggunakan localStorage (bukan database server), migrasi dilakukan via versioned schema:

```typescript
const CURRENT_SCHEMA_VERSION = 1;

function migrateProgress(stored: unknown): ProgressData {
  // 1. No data exists → return defaults
  if (!stored) return DEFAULT_PROGRESS;

  // 2. Parse JSON
  let data: any;
  try {
    data = typeof stored === 'string' ? JSON.parse(stored) : stored;
  } catch {
    logger.log({ level: 'WARN', module: 'MOD-STATE', event: 'CORRUPT_DATA' });
    return DEFAULT_PROGRESS;
  }

  // 3. Check schema version
  const version = data._schemaVersion ?? 0;

  // 4. Apply migrations sequentially
  if (version < 1) {
    // v0 → v1: Add letterStats field
    data.letterStats = data.letterStats ?? {};
    data._schemaVersion = 1;
  }

  // Future migrations:
  // if (version < 2) { ... migrate v1 → v2 ... }

  // 5. Validate final shape
  return validateProgressData(data);
}
```

### 9.7 Deployment Pipeline

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Developer   │────▶│   GitHub     │────▶│  Vercel      │────▶│  Production  │
│  git push    │     │   main       │     │  Build       │     │  CDN (Edge)  │
│              │     │   branch     │     │              │     │              │
└──────────────┘     └──────┬───────┘     └──────┬───────┘     └──────────────┘
                            │                     │
                            │                     ├─ next build (SSG)
                            │                     ├─ Output: static HTML/JS/CSS
                            │                     ├─ Vercel CLI deploys to edge
                            │                     └─ HTTPS + CDN auto-configured
                            │
                            ├─ Pre-push hook (optional):
                            │   npm run lint
                            │   npm run test
                            │
                            └─ GitHub Actions (optional CI):
                                npm ci
                                npm run lint
                                npm run test -- --coverage
                                npm run build
```

### 9.8 Deployment Checklist (Pre-Launch)

| # | Check | Command / Action | Expected |
|---|-------|-----------------|----------|
| 1 | Build succeeds | `npm run build` | Exit code 0, no errors |
| 2 | Lint passes | `npm run lint` | 0 warnings, 0 errors |
| 3 | Unit tests pass | `npm run test` | All green, coverage ≥ 80% |
| 4 | Model files in `public/model/` | `ls public/model/` | `model.json` + `*.bin` files |
| 5 | BISINDO images complete | `ls public/images/bisindo/` | 26 PNG files (A-Z) |
| 6 | `manifest.json` valid | PWA validator tool | All required fields present |
| 7 | Lighthouse score | Run Lighthouse audit | Performance ≥ 80, Accessibility ≥ 90 |
| 8 | Mobile responsive | Chrome DevTools (375px, 768px) | No layout breaks |
| 9 | Dark mode | Toggle and verify all pages | Consistent theming |
| 10 | Camera permission flow | Test grant + deny + retry | All states handled gracefully |
| 11 | Offline mode | DevTools → Network → Offline → Reload | App loads from SW cache |
| 12 | README.md complete | Visual check | Screenshots, setup guide, tech stack, license |

### 9.9 Rollback Procedure

```
IF production issue detected:

  1. SEVERITY CHECK:
     - Critical (app non-functional) → Immediate rollback
     - Major (feature broken) → Hotfix branch or rollback
     - Minor (cosmetic) → Fix forward in next deploy

  2. ROLLBACK VIA VERCEL:
     a. Go to Vercel Dashboard → Deployments
     b. Find last known good deployment
     c. Click "..." → "Promote to Production"
     d. Verify app is working
     
     Time to rollback: < 60 seconds

  3. ROLLBACK VIA GIT:
     a. git revert <bad-commit-hash>
     b. git push origin main
     c. Vercel auto-deploys reverted code
     
     Time to rollback: < 5 minutes

  4. POST-MORTEM:
     a. Document what went wrong
     b. Add test case to prevent recurrence
     c. Update deployment checklist if needed
```

---

> **SRD teknis Mode Enterprise selesai disusun.** Apakah ada kontrak API/skema database yang ingin diekstrak menjadi kode scaffold, atau ada bagian yang ingin direvisi?

