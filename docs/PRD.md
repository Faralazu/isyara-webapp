# PRD: Isyara — AI BISINDO Sign Language Translator

---

## I. Metadata Dokumen

| Atribut | Detail |
|---------|--------|
| **Nama Produk** | Isyara |
| **Tagline** | *Jembatani Isyarat, Satukan Makna* |
| **Versi Dokumen** | 1.0 |
| **Status** | Draft |
| **Mode Eksekusi** | 🏢 Enterprise (Bagian I–XII) |
| **Author** | Farel (Product Owner) + AI Planning Assistant |
| **Tanggal Dibuat** | 22 September 2026 |
| **Periode Pengembangan** | 22 Sep – 21 Okt 2026 (30 hari) |
| **Metodologi** | ATM (Amati, Tiru, Modifikasi) |
| **Platform** | Web Application (Progressive Web App) |
| **Bahasa UI** | Bilingual (Indonesia 🇮🇩 + English 🇬🇧) |

---

## II. Latar Belakang & Problem Statement

### Problem Statement

Indonesia memiliki **2.7 juta penyandang disabilitas pendengaran** (BPS, 2023). Mereka menggunakan **BISINDO** (Bahasa Isyarat Indonesia) sebagai bahasa komunikasi sehari-hari. Namun, mayoritas masyarakat umum **tidak memahami BISINDO**, menciptakan kesenjangan komunikasi yang signifikan di layanan publik, pendidikan, dan kehidupan sosial.

Solusi yang ada saat ini memiliki kelemahan fundamental:

| Solusi Saat Ini | Kelemahan |
|-----------------|-----------|
| Juru bahasa isyarat manusia | Mahal, terbatas jumlahnya, tidak tersedia 24/7 |
| Aplikasi SIBI (bukan BISINDO) | SIBI adalah sistem formal yang kaku dan **tidak digunakan** oleh komunitas tuli dalam keseharian |
| Tutorial video YouTube | Pasif, tidak interaktif, tidak ada verifikasi apakah user sudah benar |
| Kursus offline | Mahal, terbatas lokasi, jadwal tidak fleksibel |

Belum ada **web app** yang mampu menerjemahkan **BISINDO** secara real-time menggunakan AI, sekaligus menyediakan platform belajar interaktif yang dapat diakses siapapun secara gratis.

### Peluang Bisnis

1. **Pasar yang belum tersentuh:** Tidak ada kompetitor langsung untuk web-based BISINDO translator
2. **Momentum aksesibilitas digital:** Pemerintah Indonesia aktif mendorong inklusivitas digital (UU No. 8/2016 tentang Penyandang Disabilitas)
3. **Potensi hackathon & kompetisi:** Project dengan social impact tinggi memiliki win-rate yang signifikan di kompetisi teknologi (cf. NeuroBuddy — Grand Prize Microsoft AI for Accessibility 2025)
4. **Skalabilitas global:** Arsitektur yang sama bisa di-extend ke bahasa isyarat negara lain (ASL, BSL, JSL)
5. **Portfolio value:** Mendemonstrasikan kemampuan Computer Vision, ML, dan full-stack development dalam satu project

---

## III. Sasaran & Metrik Keberhasilan

| Kategori | Metrik | Target | Periode |
|----------|--------|--------|---------|
| **🌟 North Star** | Jumlah huruf BISINDO yang berhasil dikenali secara akurat | ≥ 22 dari 26 huruf (accuracy ≥ 85%) | Launch Day |
| **KPI 1 — Engagement** | Jumlah user unik yang mencoba fitur Translate | ≥ 50 user | 30 hari post-launch |
| **KPI 2 — Learning** | Jumlah user yang menyelesaikan minimal 1 quiz | ≥ 20 user | 30 hari post-launch |
| **KPI 3 — Retention** | User yang kembali dalam 7 hari | ≥ 25% | 30 hari post-launch |
| **KPI 4 — Performance** | Inference latency per frame | ≤ 100ms | Launch Day |
| **KPI 5 — Reach** | GitHub stars | ≥ 10 stars | 30 hari post-launch |

### Guardrail Metrics
| Guardrail | Batas |
|-----------|-------|
| False positive rate (huruf salah dikenali) | ≤ 15% |
| Page load time (First Contentful Paint) | ≤ 3 detik |
| Model file size (download ke browser) | ≤ 2 MB |
| Crash rate / unhandled errors | ≤ 1% sessions |

---

## IV. Target Pengguna & Persona

### Persona 1: 🤟 Rina — Anggota Komunitas Tuli

| Atribut | Detail |
|---------|--------|
| **Usia** | 22 tahun |
| **Pekerjaan** | Mahasiswa desain grafis |
| **Konteks** | Tuli sejak lahir, fasih BISINDO, sering kesulitan berkomunikasi dengan dosen dan teman yang tidak bisa BISINDO |
| **JTBD** | *Ketika saya harus berkomunikasi dengan orang yang tidak mengerti BISINDO, saya ingin bisa menunjukkan isyarat ke webcam dan hasilnya muncul sebagai teks, sehingga mereka bisa memahami apa yang saya sampaikan* |
| **Pain Point** | Tidak selalu ada juru bahasa; aplikasi yang ada pakai SIBI, bukan BISINDO |

### Persona 2: 👨‍👩‍👧 Budi — Orang Tua Anak Tuli

| Atribut | Detail |
|---------|--------|
| **Usia** | 38 tahun |
| **Pekerjaan** | Karyawan swasta |
| **Konteks** | Anaknya (7 tahun) tuli, ingin belajar BISINDO agar bisa berkomunikasi lebih baik |
| **JTBD** | *Ketika saya belajar BISINDO di rumah, saya ingin ada alat yang bisa memverifikasi apakah isyarat saya sudah benar, sehingga saya bisa berlatih mandiri tanpa harus selalu didampingi guru* |
| **Pain Point** | Kursus BISINDO mahal dan jadwalnya terbatas; YouTube tidak bisa memberi feedback |

### Persona 3: 🏫 Ibu Sari — Guru SLB (Sekolah Luar Biasa)

| Atribut | Detail |
|---------|--------|
| **Usia** | 45 tahun |
| **Pekerjaan** | Guru SLB |
| **Konteks** | Mengajar siswa tuli, mencari alat bantu pengajaran yang interaktif |
| **JTBD** | *Ketika saya mengajar BISINDO di kelas, saya ingin ada platform interaktif yang bisa digunakan murid untuk berlatih mandiri dan melihat progress mereka, sehingga proses belajar lebih efektif* |
| **Pain Point** | Materi ajar terbatas; murid perlu banyak latihan di luar kelas |

### Persona 4: 🏥 Dokter Arif — Petugas Layanan Publik

| Atribut | Detail |
|---------|--------|
| **Usia** | 30 tahun |
| **Pekerjaan** | Dokter umum di Puskesmas |
| **Konteks** | Kadang menerima pasien tuli dan kesulitan memahami keluhan mereka |
| **JTBD** | *Ketika saya melayani pasien tuli, saya ingin bisa memahami isyarat dasar mereka secara cepat, sehingga saya bisa memberikan layanan kesehatan yang layak tanpa miskomunikasi* |
| **Pain Point** | Tidak ada juru bahasa di Puskesmas; komunikasi via tulisan terlalu lambat |

---

## V. Ruang Lingkup Proyek

### ✅ In-Scope (v1.0 — Rilis Pertama)

| ID | Fitur | Deskripsi |
|----|-------|-----------|
| S-01 | Real-time BISINDO Translation | Webcam mendeteksi isyarat tangan → menampilkan huruf alfabet (A-Z) |
| S-02 | Kamus BISINDO | Browse 26 huruf alfabet dengan gambar referensi dan instruksi |
| S-03 | Mode Belajar | Guided lesson per huruf dengan verifikasi webcam |
| S-04 | Mode Latihan | Webcam challenge — app minta user tunjukkan huruf tertentu |
| S-05 | Mode Quiz | 10 soal random, timer, skor akhir |
| S-06 | Progress Tracking | Simpan progress di localStorage (huruf dikuasai, skor, streak) |
| S-07 | Bilingual UI | Interface dalam Bahasa Indonesia dan English |
| S-08 | Responsive Design | Tampil baik di desktop dan mobile |
| S-09 | Dark Mode | Toggle tema gelap/terang |
| S-10 | PWA | Bisa di-install di perangkat mobile |

### ❌ Out-of-Scope (Tidak dikerjakan pada v1.0)

| ID | Fitur | Alasan Ditunda |
|----|-------|----------------|
| O-01 | Word-level recognition (kata/kalimat) | Membutuhkan dataset video sequence dan model LSTM yang lebih kompleks |
| O-02 | Text-to-Sign animation | Butuh rigging 3D dan aset animasi per huruf/kata |
| O-03 | User authentication / login | Tidak diperlukan untuk MVP; localStorage cukup |
| O-04 | Backend server / database | Semua berjalan client-side; tidak butuh API server |
| O-05 | Multi-bahasa isyarat (ASL, BSL) | Fokus BISINDO dulu untuk v1.0 |
| O-06 | Fitur sosial (share hasil, leaderboard) | Nice-to-have, bukan core value |
| O-07 | Voice output (text-to-speech) | Bisa ditambah di v2.0 |

---

## VI. Kebutuhan Fungsional (Tabel Prioritas MoSCoW)

| ID | Prioritas | User Story | Acceptance Criteria (Given-When-Then) |
|----|-----------|------------|---------------------------------------|
| F-01 | **Must** | Sebagai user, saya ingin membuka webcam di halaman Translate, sehingga kamera saya aktif dan menampilkan video stream | **Given** user di halaman Translate **When** user klik "Mulai Kamera" **Then** browser meminta izin kamera, dan video stream muncul di layar |
| F-02 | **Must** | Sebagai user, saya ingin melihat titik-titik landmark di kedua tangan saya (untuk isyarat 1 atau 2 tangan), sehingga saya tahu pose tangan saya terdeteksi dengan akurat | **Given** webcam aktif dan 1 atau 2 tangan terlihat **When** MediaPipe mendeteksi tangan **Then** hingga 2×21 titik landmark + skeleton digambar di atas video dengan pembeda visual |
| F-03 | **Must** | Sebagai user, saya ingin melihat huruf BISINDO yang saya tunjukkan (baik isyarat 1 tangan maupun 2 tangan), sehingga saya tahu isyarat saya dikenali | **Given** tangan terdeteksi dan model loaded **When** user membentuk isyarat huruf (1 atau 2 tangan) **Then** huruf + confidence score ditampilkan di UI dalam < 200ms |
| F-04 | **Must** | Sebagai user, saya ingin prediksi yang stabil (tidak berkedip), sehingga hasil terjemahan mudah dibaca | **Given** prediksi huruf sedang berjalan **When** output berfluktuasi antar frame **Then** sistem menggunakan smoothing buffer dan hanya menampilkan huruf yang konsisten ≥ 5 frame |
| F-05 | **Must** | Sebagai user, saya ingin melihat semua huruf BISINDO di halaman Kamus, sehingga saya bisa mempelajari bentuk isyarat setiap huruf | **Given** user di halaman Kamus **When** halaman dimuat **Then** 26 kartu huruf (A-Z) ditampilkan dalam grid dengan gambar referensi |
| F-06 | **Must** | Sebagai user, saya ingin melihat detail setiap huruf, sehingga saya tahu cara membentuk isyarat yang benar | **Given** user klik kartu huruf di Kamus **When** halaman detail terbuka **Then** ditampilkan: gambar referensi besar, instruksi posisi tangan, tipe (satu/dua tangan), dan tombol "Latihan" |
| F-07 | **Must** | Sebagai user, saya ingin berlatih huruf tertentu dengan webcam, sehingga saya bisa memverifikasi isyarat saya | **Given** user klik "Latihan" pada huruf tertentu **When** webcam aktif dan user membentuk isyarat **Then** app memberi feedback real-time (✅ Benar / ❌ Coba lagi) |
| F-08 | **Must** | Sebagai user, saya ingin mengikuti quiz, sehingga saya bisa menguji pemahaman saya | **Given** user masuk Quiz Mode **When** quiz dimulai **Then** 10 soal random muncul berurutan, masing-masing dengan timer, dan skor ditampilkan di akhir |
| F-09 | **Should** | Sebagai user, saya ingin melihat progress belajar saya, sehingga saya termotivasi untuk terus berlatih | **Given** user telah berlatih/quiz **When** user melihat dashboard **Then** ditampilkan: huruf yang dikuasai, skor quiz tertinggi, dan streak belajar |
| F-10 | **Should** | Sebagai user, saya ingin mengikuti guided lesson per huruf, sehingga saya bisa belajar secara bertahap | **Given** user di Learn Mode **When** user pilih huruf **Then** lesson dimulai: lihat referensi → instruksi → coba di webcam → feedback |
| F-11 | **Should** | Sebagai user, saya ingin menggunakan app dalam Bahasa Indonesia atau English, sehingga saya nyaman dengan bahasa pilihan saya | **Given** user di halaman manapun **When** user klik toggle bahasa **Then** seluruh UI berubah ke bahasa yang dipilih |
| F-12 | **Should** | Sebagai user, saya ingin menggunakan dark mode, sehingga mata saya tidak cepat lelah | **Given** user di halaman manapun **When** user klik toggle tema **Then** seluruh UI berubah ke mode gelap/terang |
| F-13 | **Should** | Sebagai user, saya ingin app responsive di HP, sehingga saya bisa belajar dimanapun | **Given** user membuka web di mobile browser **When** halaman dimuat **Then** layout menyesuaikan layar kecil tanpa overflow atau elemen yang terpotong |
| F-14 | **Should** | Sebagai user mobile, saya ingin meng-install Isyara di HP, sehingga saya bisa mengaksesnya seperti app native | **Given** user membuka Isyara di mobile browser **When** browser menampilkan prompt install **Then** user bisa install PWA dan membukanya dari home screen |
| F-15 | **Could** | Sebagai user, saya ingin melihat landing page yang menarik, sehingga saya tertarik untuk mencoba app | **Given** user pertama kali membuka Isyara **When** landing page dimuat **Then** ditampilkan: hero section, deskripsi fitur, CTA "Mulai Translate", dan statistik impact |
| F-16 | **Could** | Sebagai user, saya ingin melihat animasi & transisi yang halus, sehingga pengalaman menggunakan app terasa premium | **Given** user bernavigasi antar halaman **When** transisi terjadi **Then** animasi fade/slide berjalan lancar tanpa jank |
| F-17 | **Could** | Sebagai user, saya ingin web dioptimalkan untuk SEO, sehingga orang lain bisa menemukan Isyara lewat Google | **Given** Isyara sudah di-deploy **When** Google crawl halaman **Then** meta tags, OG tags, dan structured data tersedia |
| F-18 | **Won't** | Sebagai user, saya ingin login dan menyimpan progress di cloud | Ditunda ke v2.0 — localStorage cukup untuk MVP |

---

## VII. Kebutuhan Non-Fungsional

### Kinerja (Performance)
| Metrik | Target | Justifikasi |
|--------|--------|-------------|
| Inference latency (per frame) | ≤ 100ms | Real-time experience (≥ 10 FPS) |
| Model loading time | ≤ 5 detik | User tidak menunggu terlalu lama |
| First Contentful Paint (FCP) | ≤ 2 detik | Web Vitals standard |
| Largest Contentful Paint (LCP) | ≤ 3 detik | Web Vitals standard |
| Total model file size | ≤ 2 MB | Bandwidth-friendly untuk koneksi Indonesia |

### Skalabilitas
- Arsitektur **client-side only** menghilangkan kebutuhan server scaling
- Model TF.js berjalan di browser user → zero server cost at any scale
- Static site hosting (Vercel) → CDN-backed, global distribution otomatis

### Keamanan
| Aspek | Implementasi |
|-------|-------------|
| **Data Privasi** | Tidak ada data webcam yang dikirim ke server. Semua processing lokal |
| **Kamera** | Menggunakan browser Permission API; user harus consent eksplisit |
| **localStorage** | Hanya menyimpan progress belajar (non-sensitive data) |
| **HTTPS** | Enforced by Vercel (wajib untuk `getUserMedia` API) |
| **Content Security Policy** | Header CSP untuk mencegah XSS |

### Reliabilitas
| Aspek | Implementasi |
|-------|-------------|
| **Uptime** | 99.9% (Vercel SLA untuk static sites) |
| **Offline Support** | PWA service worker cache model & assets; app tetap bisa berjalan offline setelah visit pertama |
| **Error Handling** | Error boundaries di setiap route; fallback UI jika kamera/model gagal |
| **Browser Compat** | Chrome 90+, Edge 90+, Firefox 90+, Safari 15+ (WebGL required) |

---

## VIII. Alur Pengguna & Panduan Desain

### User Journey Map: Translate Mode

```
┌──────────┐    ┌───────────┐    ┌──────────────┐    ┌──────────────┐    ┌────────────┐
│ Landing  │───▶│  Klik     │───▶│  Browser     │───▶│  Model       │───▶│  Real-time │
│ Page     │    │  "Mulai   │    │  minta izin  │    │  loading     │    │  detection │
│          │    │  Translate"│    │  kamera      │    │  (skeleton)  │    │  aktif!    │
└──────────┘    └───────────┘    └──────┬───────┘    └──────────────┘    └────────────┘
                                        │
                              ┌─────────┴─────────┐
                              │    User tolak?     │
                              └─────────┬──────────┘
                                        ▼
                               ┌────────────────┐
                               │  Error state:  │
                               │  "Kamera       │
                               │  diperlukan    │
                               │  untuk fitur   │
                               │  ini"          │
                               │  [Coba Lagi]   │
                               └────────────────┘
```

### User Journey Map: Learn Mode

```
┌──────────┐    ┌───────────┐    ┌──────────────┐    ┌──────────────┐    ┌────────────┐
│ Learn    │───▶│  Pilih    │───▶│  Lihat       │───▶│  Coba di     │───▶│  Feedback  │
│ Hub      │    │  huruf    │    │  referensi   │    │  webcam      │    │  ✅ / ❌   │
│ (A-Z)    │    │  "A"      │    │  & instruksi │    │              │    │            │
└──────────┘    └───────────┘    └──────────────┘    └──────────────┘    └─────┬──────┘
                                                                               │
                                                                    ┌──────────┴────────┐
                                                                    │ Benar? → Lanjut   │
                                                                    │ Salah? → Coba Lagi│
                                                                    └───────────────────┘
```

### Penanganan Error States

| Skenario | UI Response |
|----------|-------------|
| Kamera ditolak user | Banner: "Isyara memerlukan akses kamera untuk mendeteksi isyarat" + tombol "Izinkan Kamera" |
| Kamera tidak ditemukan | Banner: "Tidak ada kamera terdeteksi. Pastikan webcam terhubung" |
| Model gagal dimuat | Banner: "Gagal memuat model AI. Periksa koneksi internet" + tombol "Muat Ulang" |
| Tangan tidak terdeteksi | Overlay: "Tunjukkan tangan Anda ke kamera" + ikon tangan animasi |
| Browser tidak support WebGL | Full-page: "Browser Anda tidak mendukung fitur ini. Gunakan Chrome/Edge terbaru" |
| Confidence terlalu rendah | Text: "Isyarat tidak jelas. Coba posisikan tangan lebih dekat ke kamera" |

#### Panduan Desain Visual
- **Color palette:** Modern Blue / Indigo primary (`from-blue-600 to-indigo-600`) dengan aksen Violet, mendukung tema terang (light) dan gelap (dark) berkontras tinggi (WCAG AA).
- **Typography:** Geist Sans (heading & body) + Geist Mono (angka & data teknis) via `next/font/google` — zero layout shift dan performa rendering optimal.
- **Spacing:** Generous whitespace, minimum tap target 44×44px (WCAG).
- **Iconography:** Lucide React — consistent, clean, accessible.
- **Motion:** Framer Motion 13+ — transisi halaman dan mikro-animasi yang halus dan bertujuan.

---

## IX. Arsitektur Teknis, Integrasi, & Data

### System Architecture Diagram

```
┌─────────────────────── CLIENT (Browser) ───────────────────────┐
│                                                                 │
│  ┌────────────┐   ┌──────────────────┐   ┌──────────────────┐  │
│  │ WebRTC     │──▶│ @mediapipe/      │──▶│ TensorFlow.js    │  │
│  │ getUserMedia│   │ tasks-vision     │   │ (Keras → tfjs)   │  │
│  │ (Webcam)   │   │ HandLandmarker   │   │ Dense Classifier │  │
│  └────────────┘   │ (Max 2 hands,    │   │ 126→256→128→64→26│  │
│                    │  2×21 landmarks  │   └────────┬─────────┘  │
│                    │  = 126 coords)   │            │           │
│                    └──────────────────┘            │           │
│                                           ┌────────▼─────────┐ │
│  ┌────────────────────────────┐           │ Prediction       │ │
│  │ Next.js 16 (React 19)      │           │ Smoothing Buffer │ │
│  │ ┌──────────────────────┐   │           │ (size 7 frames,  │ │
│  │ │ /         (Landing)  │   │           │  consensus ≥ 4)  │ │
│  │ │ /translate (Webcam)  │   │           └────────┬─────────┘ │
│  │ │ /learn     (Lessons) │   │                    │           │
│  │ │ /dictionary (Browse) │   │           ┌────────▼─────────┐ │
│  │ └──────────────────────┘   │           │ UI: Letter +     │ │
│  │ i18n: ID 🇮🇩 / EN 🇬🇧        │           │ Confidence %     │ │
│  └────────────────────────────┘           └──────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐  │
│  │ localStorage                │  │ Service Worker (PWA)    │  │
│  │ • Progress tracking        │  │ • Cache model files     │  │
│  │ • Quiz scores              │  │ • Offline-first assets  │  │
│  │ • Language preference      │  │                         │  │
│  │ • Theme preference         │  │                         │  │
│  └─────────────────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────── BUILD TIME (Offline Pipeline) ─────────────────┐
│                                                                 │
│  Python 3.9+                                                    │
│  ┌────────────┐  ┌────────────────┐  ┌───────────────────────┐ │
│  │ BISINDO    │─▶│ MediaPipe Dual │─▶│ TensorFlow/Keras      │ │
│  │ Dataset    │  │ Hand Extraction│  │ Train (126 features)  │ │
│  │ (A-Z dual) │  │ Left+Right: 126│  │ → Export .h5          │ │
│  │ 2600+ imgs │  │ → landmarks.csv│  │ → tensorflowjs_convert│ │
│  └────────────┘  └────────────────┘  └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌──────────────── DEPLOYMENT ────────────────────────────────────┐
│  Vercel (Static Hosting + Edge CDN)                            │
│  • Auto-deploy from GitHub main branch                          │
│  • HTTPS enforced                                               │
│  • Edge caching for static assets                               │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack Detail

| Layer | Teknologi | Versi | Justifikasi |
|-------|-----------|-------|-------------|
| Framework | Next.js (App Router) | 16+ | SSG, file-based routing, React 19 architecture, superior performance |
| UI Library | shadcn/ui (`@base-ui/react`) | Latest | Accessible, modern unstyled headless primitives |
| Styling | Tailwind CSS | v4 | CSS-first configuration, zero-runtime, performant |
| Animation | Framer Motion | 13+ | Declarative smooth layout transitions |
| Hand Detection | @mediapipe/tasks-vision | Latest | Browser-native WASM, support hingga 2 tangan (2×21 3D landmarks) |
| ML Inference | TensorFlow.js | 4.x | Browser-native, WebGL-accelerated inference |
| Model Training | TensorFlow/Keras (Python) | 2.15+ | Train offline 126 fitur (dual-hand), easy export |
| Model Conversion | tensorflowjs (pip) | Latest | Official Keras → TF.js converter |
| Testing | Vitest + React Testing Library | Latest | Unit & integration testing framework |
| Typography | Geist Sans & Geist Mono | Latest | Native Google font integration via `next/font/google` |
| Icons | Lucide React | Latest | Tree-shakable, accessible SVG icons |
| Deploy | Vercel | N/A | Free tier, auto SSL, Edge CDN |
| VCS | Git + GitHub | N/A | Portfolio hosting, CI/CD |

### Data Schema

#### `bisindo-dictionary.json`
```json
{
  "letters": [
    {
      "id": "A",
      "name_id": "A",
      "name_en": "A",
      "type": "two-handed",
      "description_id": "Kedua tangan membentuk kepalan...",
      "description_en": "Both hands form a fist...",
      "tips_id": "Pastikan kedua tangan sejajar",
      "tips_en": "Make sure both hands are aligned",
      "image": "/images/bisindo/A.png",
      "difficulty": "easy"
    }
  ]
}
```

#### `localStorage` Schema
```json
{
  "isyara_progress": {
    "mastered_letters": ["A", "B", "C"],
    "quiz_high_score": 8,
    "total_practice_sessions": 15,
    "current_streak": 3,
    "last_active_date": "2026-10-05",
    "preferred_language": "id",
    "preferred_theme": "dark"
  }
}
```

### Event Tracking (Analytics-Ready)

| Event Name | Trigger | Data |
|------------|---------|------|
| `page_view` | User membuka halaman | `page_name`, `timestamp` |
| `camera_granted` | User izinkan kamera | `timestamp` |
| `camera_denied` | User tolak kamera | `timestamp` |
| `prediction_made` | Huruf berhasil dikenali | `letter`, `confidence`, `latency_ms` |
| `lesson_started` | User mulai lesson | `letter` |
| `lesson_completed` | User selesai lesson | `letter`, `attempts` |
| `quiz_started` | User mulai quiz | `timestamp` |
| `quiz_completed` | User selesai quiz | `score`, `duration_s` |
| `pwa_installed` | User install PWA | `timestamp` |
| `language_changed` | User ganti bahasa | `from`, `to` |

> [!NOTE]
> Event tracking akan diimplementasi sebagai hooks yang siap dihubungkan ke analytics provider (Google Analytics, Posthog, atau Umami) di v2.0. Pada v1.0, events di-log ke `console.log` saja untuk debugging.

---

## X. Rencana Peluncuran & Go-To-Market

### Strategi Rilis Bertahap

| Fase | Tanggal | Milestone | Audience |
|------|---------|-----------|----------|
| **Alpha** | Day 14 (5 Okt) | Core translation bekerja (webcam → huruf) | Developer sendiri (internal testing) |
| **Beta** | Day 23 (14 Okt) | Semua fitur selesai (translate + learn + dictionary) | 3-5 teman dekat / tester |
| **RC** | Day 28 (19 Okt) | Deploy ke Vercel, responsive, polished | Terbatas (share link ke komunitas kecil) |
| **v1.0 Launch** | Day 30 (21 Okt) | README lengkap, demo video, portfolio-ready | Publik (GitHub, sosial media) |

### Go-To-Market Channels

| Channel | Aksi | Target |
|---------|------|--------|
| **GitHub** | Publish repo dengan README yang lengkap, demo GIF, dan badges | Developer community, recruiters |
| **LinkedIn** | Post tentang project journey + demo video | Professional network |
| **Twitter/X** | Thread tentang proses pembuatan (behind the scenes) | Tech community |
| **r/webdev & r/MachineLearning** | Share project sebagai showcase | Reddit community |
| **Komunitas Tuli Indonesia** | Share ke organisasi seperti Gerkatin | Target user langsung |
| **Devpost** | Submit ke hackathon yang sedang berjalan | Kompetisi |

### Rollback Plan
| Skenario | Aksi |
|----------|------|
| Model accuracy terlalu rendah di production | Rollback ke versi model sebelumnya via Git; re-train dengan data tambahan |
| Performance issue di mobile | Disable fitur berat (canvas overlay) di mobile; kurangi FPS |
| Critical bug post-launch | Vercel instant rollback ke previous deployment |

---

## XI. Asumsi, Risiko, & Mitigasi

| # | Deskripsi Risiko | Dampak | Probabilitas | Rencana Mitigasi |
|---|-----------------|--------|-------------|-----------------|
| R-01 | Dataset BISINDO di Kaggle tidak cukup bervariasi (pencahayaan, warna kulit, background) | **Tinggi** | Sedang | Augmentasi data (rotasi, brightness, flip) + tambah 50-100 gambar sendiri via webcam |
| R-02 | Akurasi model di bawah target (< 85%) | **Tinggi** | Sedang | Iterasi arsitektur model (tambah layers, tuning hyperparams); prioritaskan huruf yang paling jelas, tandai huruf "tricky" |
| R-03 | Beberapa huruf BISINDO sangat mirip secara visual (sulit dibedakan oleh model) | **Sedang** | Tinggi | Implementasi "confusion pairs" handling; gabungkan huruf mirip ke satu kelas lalu refine; tampilkan top-3 prediksi |
| R-04 | MediaPipe lambat di perangkat low-end / mobile lama | **Sedang** | Sedang | Resize input video ke 320×240; kurangi FPS ke 15; berikan info minimum specs di landing page |
| R-05 | BISINDO memiliki variasi regional yang membuat isyarat berbeda antar daerah | **Rendah** | Tinggi | Gunakan variasi Jakarta/standar sebagai baseline; dokumentasikan bahwa versi ini mengacu pada standar tertentu |
| R-06 | User tidak mengerti cara memposisikan tangan yang benar di depan webcam | **Sedang** | Sedang | Tambahkan guide overlay / silhouette di awal; tooltips dan instruksi yang jelas |
| R-07 | Waktu pengembangan 30 hari tidak cukup untuk semua fitur | **Sedang** | Rendah | Prioritas MoSCoW ketat; Phase 4 bisa disederhanakan (skip PWA/dark mode jika perlu) |
| R-08 | Browser compatibility issues (WebGL, WASM) | **Rendah** | Rendah | Target Chrome/Edge terbaru; tampilkan pesan informatif jika browser tidak support |

---

## XII. Pertanyaan Terbuka

| # | Pertanyaan | Dampak Terhadap Implementasi | Status |
|---|-----------|------------------------------|--------|
| Q-01 | Apakah dataset Kaggle BISINDO yang tersedia mencakup variasi tangan kiri dan kanan? | Jika hanya satu tangan, model perlu augmentasi mirroring | ⏳ Cek saat Day 8 |
| Q-02 | Apakah huruf BISINDO tertentu memerlukan gerakan (dynamic sign) atau semuanya statis? | Jika ada dynamic sign, perlu arsitektur LSTM (lebih kompleks) | ⏳ Cek saat Day 8 |
| Q-03 | Apakah Vercel free tier cukup untuk hosting model TF.js yang besar? | Jika model > 100MB, perlu CDN alternatif | ✅ Solved — model < 2MB |
| Q-04 | Apakah mau ditambahkan fitur "Contribute" agar user bisa submit gambar isyarat baru? | Meningkatkan dataset secara crowdsourced, tapi butuh backend | ❌ Out-of-scope v1.0 |
| Q-05 | Apakah akan ada kolaborasi dengan komunitas tuli (Gerkatin) untuk validasi akurasi? | Meningkatkan kredibilitas dan kegunaan | ⏳ Pertimbangkan post-launch |

---

> **PRD selesai di-generate dalam Mode Enterprise.** Bagian mana yang ingin direvisi secara spesifik?
