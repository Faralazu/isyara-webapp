import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Award, Flame, Play, HelpCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getLearnPreviewLetters, getSignTypeLabel } from "@/lib/dictionary/data";

export const metadata: Metadata = {
  title: "Modul Belajar BISINDO",
  description:
    "Pelajari alfabet Bahasa Isyarat Indonesia (BISINDO) langkah demi langkah, ikuti tantangan latihan kamera, dan uji kemampuanmu di kuis interaktif.",
};

const SAMPLE_ALPHABET = getLearnPreviewLetters();

export default function LearnPage() {
  return (
    <main className="flex-1 container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header Page */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/80 px-3.5 py-1 text-xs font-medium text-muted-foreground">
          <BookOpen className="size-3.5 text-primary" />
          <span>Modul Interaktif</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Pusat Belajar BISINDO
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Kuasai 26 isyarat alfabet BISINDO melalui modul bertahap, panduan gestur visual, dan latihan mandiri dengan umpan balik AI real-time.
        </p>
      </div>

      {/* Progress & Milestone Overview */}
      <div className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Progres Latihan Anda
            </span>
            <h2 className="text-lg font-bold text-foreground mt-0.5">
              Siap Memulai Hari Ini?
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              Tingkat: Pemula (A-Z)
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-secondary/40 border border-border/60">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Huruf Dikuasai</span>
              <div className="text-xl font-bold text-foreground">0 / 26 Huruf</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-secondary/40 border border-border/60">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400">
              <Award className="size-5" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Skor Kuis Terbaik</span>
              <div className="text-xl font-bold text-foreground">0 / 10 Poin</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-secondary/40 border border-border/60">
            <div className="flex size-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-400">
              <Flame className="size-5" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Konsistensi Belajar</span>
              <div className="text-xl font-bold text-foreground">1 Hari Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Modes Cards */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1: Guided Lessons */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between transition-colors hover:border-primary/50">
          <div>
            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <BookOpen className="size-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Panduan Gestur Huruf</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Pelajari detail bentuk isyarat satu per satu dari A sampai Z dengan deskripsi posisi jari dan penjelasan anatomis isyarat.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border/70">
            <Link
              href="/dictionary"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full justify-between text-xs font-semibold"
              )}
            >
              <span>Buka Kamus Gestur</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: Practice Mode */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between transition-colors hover:border-primary/50">
          <div>
            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Play className="size-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Latihan Mandiri Kamera</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Peragakan isyarat di depan webcam. Model AI akan mendeteksi koordinat tangan dan memberi umpan balik langsung apakah pose sudah tepat.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border/70">
            <Link
              href="/translate"
              className={cn(
                buttonVariants({ size: "sm" }),
                "w-full justify-between text-xs font-semibold shadow-xs"
              )}
            >
              <span>Mulai Latihan Kamera</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: Quiz Mode */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between transition-colors hover:border-primary/50">
          <div>
            <div className="size-10 rounded-lg bg-secondary text-foreground flex items-center justify-center mb-4 border border-border">
              <HelpCircle className="size-5 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-base text-foreground">Kuis Pemahaman</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Uji daya ingat dan reflek isyarat tangan Anda melalui serangkaian tantangan cepat 10 soal acak.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border/70">
            <div className="flex items-center justify-between text-xs text-muted-foreground py-1">
              <span className="font-medium">Tahap Pengembangan</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">Segera</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alphabet Quick Links Preview */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-foreground">
            Koleksi Alfabet Utama
          </h3>
          <Link
            href="/dictionary"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua 26 Huruf</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {SAMPLE_ALPHABET.map((item) => (
            <Link
              key={item.id}
              href={`/dictionary#letter-${item.id}`}
              className="group flex flex-col items-center justify-center p-3.5 rounded-xl border border-border/70 bg-secondary/40 hover:border-primary/50 hover:bg-card transition-all text-center"
            >
              <span className="text-2xl font-black text-foreground group-hover:scale-105 transition-transform">
                {item.id}
              </span>
              <span className="mt-1 text-[11px] text-muted-foreground font-medium">
                {getSignTypeLabel(item.type)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
