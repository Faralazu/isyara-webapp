import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Award, Flame, Play, HelpCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Modul Belajar BISINDO",
  description:
    "Pelajari alfabet Bahasa Isyarat Indonesia (BISINDO) langkah demi langkah, ikuti tantangan latihan kamera, dan uji kemampuanmu di kuis interaktif.",
};

const SAMPLE_ALPHABET = [
  { letter: "A", type: "two-handed", difficulty: "easy" },
  { letter: "B", type: "two-handed", difficulty: "easy" },
  { letter: "C", type: "two-handed", difficulty: "easy" },
  { letter: "D", type: "two-handed", difficulty: "easy" },
  { letter: "E", type: "two-handed", difficulty: "medium" },
  { letter: "I", type: "one-handed", difficulty: "easy" },
  { letter: "L", type: "one-handed", difficulty: "easy" },
  { letter: "O", type: "two-handed", difficulty: "easy" },
];

export default function LearnPage() {
  return (
    <main className="flex-1 container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header Page */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
          <BookOpen className="size-3.5" />
          <span>Interactive Learning Hub</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Pusat Belajar BISINDO
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
          Kuasai 26 isyarat alfabet BISINDO melalui modul bertahap, latihan mandiri dengan verifikasi AI real-time, dan uji skormu dalam kuis cepat.
        </p>
      </div>

      {/* Progress Mini Dashboard (MOD-STATE Preview) */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-xs flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-muted-foreground">Huruf Dikuasai</span>
            <div className="text-2xl font-bold text-foreground">0 / 26</div>
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-xs flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Award className="size-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-muted-foreground">Skor Kuis Tertinggi</span>
            <div className="text-2xl font-bold text-foreground">0 / 10</div>
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-xs flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Flame className="size-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-muted-foreground">Streak Belajar</span>
            <div className="text-2xl font-bold text-foreground">1 Hari</div>
          </div>
        </div>
      </div>

      {/* Learning Modes Cards */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1: Guided Lessons */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between transition hover:border-indigo-500/40">
          <div>
            <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <BookOpen className="size-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Belajar Huruf (Guided)</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Pelajari isyarat huruf satu per satu dari A sampai Z dengan instruksi posisi jari, gambar referensi, dan panduan gestur.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border/40">
            <Link
              href="/dictionary"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full justify-between text-xs font-semibold"
              )}
            >
              <span>Pilih Huruf</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: Practice Mode */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between transition hover:border-blue-500/40">
          <div>
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Play className="size-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Latihan Kamera</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Tantangan memperagakan isyarat di depan kamera. AI akan langsung memvalidasi apakah bentuk tanganmu sudah benar atau belum.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border/40">
            <Link
              href="/translate"
              className={cn(
                buttonVariants({ size: "sm" }),
                "w-full justify-between text-xs font-semibold"
              )}
            >
              <span>Buka Latihan</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: Quiz Mode */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between transition hover:border-purple-500/40">
          <div>
            <div className="size-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <HelpCircle className="size-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Kuis 10 Huruf</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Uji daya ingat dan kecepatan gesturmu! 10 soal acak dengan waktu 15 detik per soal untuk mengumpulkan skor terbaik.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border/40">
            <button
              type="button"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full justify-between text-xs font-semibold"
              )}
            >
              <span>Mulai Kuis (Segera)</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Alphabet Quick Links Preview */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
        <h3 className="font-bold text-base text-foreground mb-4">
          Daftar Alfabet A-Z
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {SAMPLE_ALPHABET.map((item) => (
            <Link
              key={item.letter}
              href={`/dictionary#letter-${item.letter}`}
              className="group flex flex-col items-center justify-center p-3 rounded-xl border border-border/60 bg-muted/20 hover:border-primary/50 hover:bg-muted/50 transition-all text-center"
            >
              <span className="text-2xl font-extrabold text-foreground group-hover:scale-110 transition-transform">
                {item.letter}
              </span>
              <span className="mt-1 text-[10px] text-muted-foreground">
                {item.type === "two-handed" ? "2 Tangan" : "1 Tangan"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
