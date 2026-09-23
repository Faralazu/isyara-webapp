import { Heart, Users, Shield, Zap, Sparkles, CheckCircle2, XCircle } from "lucide-react";

export interface VisiComparison {
  problem: string;
  problemDesc: string;
  solution: string;
  solutionDesc: string;
}

export const VISI_COMPARISONS: VisiComparison[] = [
  {
    problem: "Juru Bahasa Isyarat Terbatas",
    problemDesc: "Biaya tinggi, ketersediaan terbatas, dan tidak selalu ada saat dibutuhkan mendesak.",
    solution: "Aksesibilitas 24/7 Gratis",
    solutionDesc: "Isyara dapat dibuka kapan saja di browser desktop maupun ponsel pintar tanpa biaya.",
  },
  {
    problem: "Aplikasi Terfokus pada SIBI",
    problemDesc: "SIBI adalah sistem buatan yang formal dan kaku, jarang dipakai oleh komunitas tuli dalam percakapan sehari-hari.",
    solution: "Fokus pada BISINDO Alami",
    solutionDesc: "Isyara dirancang khusus untuk BISINDO yang mengalir alami, termasuk alfabet satu dan dua tangan.",
  },
  {
    problem: "Video Tutorial Pasif",
    problemDesc: "Menonton video YouTube tanpa tahu apakah posisi tangan dan jari kita sudah benar.",
    solution: "Validasi AI Interaktif",
    solutionDesc: "AI langsung menganalisis koordinat pose tangan Anda dan memberikan umpan balik seketika.",
  },
  {
    problem: "Kekhawatiran Privasi Data Video",
    problemDesc: "Kamera pengguna sering kali dikirim dan disimpan di server cloud pihak ketiga.",
    solution: "100% On-Device Privacy",
    solutionDesc: "Seluruh frame video diproses lokal di memori browser. Tidak ada gambar yang meninggalkan perangkat Anda.",
  },
];

export function VisiSection() {
  const comparisons = VISI_COMPARISONS;

  return (
    <section className="py-20 border-t border-border/50 bg-muted/10">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
            <Heart className="size-3.5" />
            <span>Visi Sosial & Inklusivitas</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Mengapa Kami Membangun{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400">
              Isyara?
            </span>
          </h2>

          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Di Indonesia, terdapat lebih dari <strong>2.7 juta saudara kita penyandang disabilitas pendengaran</strong> (BPS). Mereka berkomunikasi dengan <strong>BISINDO</strong> — bahasa yang indah dan alami. Namun, minimnya sarana pembelajaran interaktif membuat jurang komunikasi antarsesama masih lebar.
          </p>
        </div>

        {/* Impact Numbers Grid */}
        <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border/70 bg-card p-5 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
              2.7 Juta
            </div>
            <div className="mt-1 text-xs font-medium text-muted-foreground">
              Komunitas Tuli di Indonesia
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-5 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">
              26 Alfabet
            </div>
            <div className="mt-1 text-xs font-medium text-muted-foreground">
              Isyarat BISINDO 1 & 2 Tangan
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-5 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              100%
            </div>
            <div className="mt-1 text-xs font-medium text-muted-foreground">
              On-Device Client-Side AI
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-5 text-center shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-violet-600 dark:text-violet-400">
              0 ms
            </div>
            <div className="mt-1 text-xs font-medium text-muted-foreground">
              Server Network Lag
            </div>
          </div>
        </div>

        {/* Problem vs Isyara Solution Comparison */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
          <h3 className="text-xl font-bold text-foreground text-center mb-8">
            Kesenjangan yang Kami Jembatani
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {comparisons.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border/60 bg-muted/15 p-5 flex flex-col justify-between"
              >
                {/* Traditional Challenge */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <XCircle className="size-4 shrink-0" />
                    <span>Tantangan Saat Ini</span>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">
                    {item.problem}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {item.problemDesc}
                  </p>
                </div>

                {/* Isyara Solution */}
                <div className="pt-3 border-t border-border/40">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>Pendekatan Isyara</span>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">
                    {item.solution}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {item.solutionDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
