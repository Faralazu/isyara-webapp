import type { Metadata } from "next";
import { Camera, Sparkles, AlertCircle, Info, Hand, ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WebcamView } from "@/components/webcam/WebcamView";

export const metadata: Metadata = {
  title: "Penerjemah Kamera",
  description:
    "Terjemahkan Bahasa Isyarat Indonesia (BISINDO) secara real-time melalui kamera browser dengan deteksi satu dan dua tangan.",
};

export default function TranslatePage() {
  return (
    <main className="flex-1 container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header Page */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
          <Camera className="size-3.5" />
          <span>Real-time Translation Mode</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Penerjemah Kamera BISINDO
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
          Tunjukkan isyarat alfabet BISINDO (1 tangan atau 2 tangan) ke kamera.
          Model AI di browsermu akan mendeteksi koordinat tangan dan menampilkan
          hasil terjemahan secara instan.
        </p>
      </div>

      {/* Main Grid: Webcam View & Result Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left / Center: Camera Stream Viewport (Day 4: WebcamView) */}
        <WebcamView className="lg:col-span-2" />

        {/* Right: Prediction & Stats Panel */}
        <div className="flex flex-col gap-6">
          {/* Prediction Result Display */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hasil Terjemahan
            </span>

            {/* Letter Big Display */}
            <div className="my-6 flex size-28 items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-muted/30">
              <span className="text-6xl font-black text-muted-foreground/60 select-none">
                -
              </span>
            </div>

            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-semibold text-foreground">0%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: "0%" }}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/40 w-full flex items-center justify-between text-xs text-muted-foreground">
              <span>Latency</span>
              <span className="font-mono">-- ms</span>
            </div>
          </div>

          {/* Dictionary Shortcut Card */}
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
            <div className="flex items-center gap-2 font-semibold text-sm text-foreground mb-1">
              <Hand className="size-4 text-indigo-500" />
              <span>Belum hafal isyaratnya?</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Buka kamus isyarat BISINDO untuk melihat contoh gestur satu tangan dan dua tangan.
            </p>
            <Link
              href="/dictionary"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full justify-center gap-1.5 text-xs font-semibold"
              )}
            >
              <span>Lihat Kamus Isyarat</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
