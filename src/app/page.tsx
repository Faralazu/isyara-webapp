import Link from "next/link";
import { Camera, BookOpen, Library, HandMetal, Zap, Shield, ArrowRight } from "lucide-react";
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
      <section className="pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="container mx-auto max-w-5xl px-4 text-center sm:px-6">
          {/* Subtle Category Pill */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors">
            <span>Aksesibilitas Bahasa Isyarat Indonesia (BISINDO)</span>
          </div>

          {/* Main Headline (Solid High-Readability Typography) */}
          <h1 className="max-w-3xl mx-auto text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.12]">
            Jembatan Komunikasi Bahasa Isyarat dengan AI Real-time
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-2xl mx-auto text-base text-muted-foreground sm:text-lg leading-relaxed">
            <strong>Isyara</strong> menerjemahkan alfabet Bahasa Isyarat Indonesia
            (BISINDO)—baik isyarat satu tangan maupun dua tangan—langsung melalui
            kamera browser Anda. Cepat, privat, dan dirancang agar teman Tuli dan
            teman dengar dapat saling terhubung tanpa sekat.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/translate"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 px-7 font-semibold gap-2.5 shadow-sm transition-all"
              )}
            >
              <Camera className="size-4" />
              <span>Mulai Terjemahkan</span>
              <ArrowRight className="size-4 opacity-75" />
            </Link>

            <Link
              href="/dictionary"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-12 px-7 font-semibold gap-2 transition-all"
              )}
            >
              <Library className="size-4" />
              <span>Buka Kamus BISINDO</span>
            </Link>
          </div>

          {/* Trust & Performance Metrics */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground sm:gap-8 font-medium">
            <div className="flex items-center gap-2">
              <HandMetal className="size-4 text-primary" />
              <span>26 Alfabet (1 & 2 Tangan)</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-amber-600 dark:text-amber-400" />
              <span>Inference Cepat &lt; 50ms</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>100% On-Device Privacy</span>
            </div>
          </div>

          {/* ── Interactive Visual Banner (AI Landmark Scanner Preview) ── */}
          <div className="mt-12 sm:mt-14">
            <VisualBanner />
          </div>
        </div>
      </section>

      {/* ── 2. Feature Highlights Grid ─────────────────────────── */}
      <section className="py-16 border-t border-border/70 bg-secondary/30 transition-colors">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Tiga Fondasi Utama Isyara
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Dirancang untuk kemudahan belajar mandiri, akurasi deteksi alami, dan kenyamanan penggunaan jangka panjang.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 text-left shadow-xs transition hover:border-primary/50">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
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

            <div className="rounded-xl border border-border bg-card p-6 text-left shadow-xs transition hover:border-primary/50">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
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

            <div className="rounded-xl border border-border bg-card p-6 text-left shadow-xs transition hover:border-primary/50">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
