import { buttonVariants } from "@/components/ui/button";
import { Camera, BookOpen, Library, Sparkles, HandMetal, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="container mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-28">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" />
          <span>Isyara v1.0 — Bahasa Isyarat Indonesia (BISINDO)</span>
        </div>

        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-none">
          Jembatan Komunikasi{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400">
            Bahasa Isyarat
          </span>{" "}
          dengan AI Real-time
        </h1>

        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          <strong>Isyara</strong> menerjemahkan alfabet Bahasa Isyarat Indonesia
          (BISINDO) baik isyarat satu tangan maupun dua tangan secara langsung
          melalui kamera browser Anda menggunakan MediaPipe dan TensorFlow.js
          on-device yang privat dan cepat.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/translate"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 px-6 font-semibold gap-2 shadow-sm"
            )}
          >
            <Camera className="size-4" />
            Mulai Terjemahkan
          </Link>
          <Link
            href="/dictionary"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "h-11 px-6 font-semibold gap-2"
            )}
          >
            <Library className="size-4" />
            Buka Kamus BISINDO
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-card p-6 text-left shadow-xs transition hover:border-primary/40">
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Camera className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground">Kamera Dual-Hand</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Inference browser-native dengan MediaPipe Tasks Vision mendeteksi
              hingga 2 tangan (126 titik fitur) tanpa kirim video ke server.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-6 text-left shadow-xs transition hover:border-primary/40">
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground">Modul Belajar Interaktif</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Pelajari alfabet A-Z dengan panduan visual gestur, latihan mandiri,
              dan evaluasi kuis terukur.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-6 text-left shadow-xs transition hover:border-primary/40">
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Library className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground">Kamus 26 Alfabet BISINDO</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Katalog referensi isyarat alami satu tangan & dua tangan lengkap
              dengan deskripsi bilingual ID/EN.
            </p>
          </div>
        </div>

        {/* Key Metrics / Value Propositions */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground sm:gap-12">
          <div className="flex items-center gap-1.5">
            <HandMetal className="size-4 text-blue-500" />
            <span>26 Alfabet BISINDO (A-Z)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="size-4 text-amber-500" />
            <span>Inference Cepat &lt; 50ms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="size-4 text-emerald-500" />
            <span>100% Client-Side Privacy</span>
          </div>
        </div>
      </section>
    </main>
  );
}
