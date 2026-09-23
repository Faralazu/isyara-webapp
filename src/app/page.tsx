import Link from "next/link";
import { Camera, BookOpen, Library, Sparkles, HandMetal, Zap, Shield, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  VisualBanner,
  VisiSection,
  HowItWorksSection,
  CtaSection,
} from "@/components/home";

export default function Home() {
  return (
    <main className="flex-1">
      {/* ── 1. Hero Section ───────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="container mx-auto max-w-5xl px-4 text-center sm:px-6">
          {/* Version Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            <span>Isyara v1.0 — Penerjemah AI BISINDO Real-Time</span>
          </div>

          {/* Main Headline */}
          <h1 className="max-w-4xl mx-auto text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.1] text-foreground">
            Jembatan Komunikasi{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400">
              Bahasa Isyarat
            </span>{" "}
            dengan AI Real-time
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl mx-auto text-base text-muted-foreground sm:text-lg leading-relaxed">
            <strong>Isyara</strong> menerjemahkan alfabet Bahasa Isyarat Indonesia
            (BISINDO) baik isyarat satu tangan maupun dua tangan secara langsung
            melalui kamera browser Anda menggunakan MediaPipe dan TensorFlow.js
            on-device yang privat dan cepat.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/translate"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 px-7 font-bold gap-2.5 shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform"
              )}
            >
              <Camera className="size-5" />
              <span>Mulai Terjemahkan</span>
              <ArrowRight className="size-4 opacity-70" />
            </Link>

            <Link
              href="/dictionary"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-12 px-7 font-bold gap-2 hover:scale-[1.02] transition-transform"
              )}
            >
              <Library className="size-5" />
              <span>Buka Kamus BISINDO</span>
            </Link>
          </div>

          {/* Trust & Performance Metrics */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground sm:gap-10 font-medium">
            <div className="flex items-center gap-1.5">
              <HandMetal className="size-4 text-blue-500" />
              <span>26 Alfabet (1 & 2 Tangan)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="size-4 text-amber-500" />
              <span>Inference Cepat &lt; 50ms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="size-4 text-emerald-500" />
              <span>100% On-Device Privacy</span>
            </div>
          </div>

          {/* ── Interactive Visual Banner (AI Landmark Scanner Preview) ── */}
          <div className="mt-14 sm:mt-16">
            <VisualBanner />
          </div>
        </div>
      </section>

      {/* ── 2. Feature Highlights Grid ─────────────────────────── */}
      <section className="py-16 border-t border-border/50 bg-card/40">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-card p-6 text-left shadow-xs transition hover:border-primary/40 hover:shadow-sm">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Camera className="size-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                Kamera Dual-Hand
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Inference browser-native dengan MediaPipe Tasks Vision mendeteksi
                hingga 2 tangan (126 koordinat fitur) tanpa kirim video ke server.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-6 text-left shadow-xs transition hover:border-primary/40 hover:shadow-sm">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <BookOpen className="size-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                Modul Belajar Interaktif
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Pelajari alfabet A-Z dengan panduan visual gestur, latihan mandiri,
                dan evaluasi kuis terukur untuk memperdalam ingatan.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-6 text-left shadow-xs transition hover:border-primary/40 hover:shadow-sm">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <Library className="size-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                Kamus 26 Alfabet BISINDO
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Katalog referensi isyarat alami satu tangan dan dua tangan lengkap
                dengan deskripsi posisi jari bilingual ID/EN.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Visi & Social Impact Section ────────────────────── */}
      <VisiSection />

      {/* ── 4. How It Works (3 Steps) ─────────────────────────── */}
      <HowItWorksSection />

      {/* ── 5. Final Call-To-Action ───────────────────────────── */}
      <CtaSection />
    </main>
  );
}
