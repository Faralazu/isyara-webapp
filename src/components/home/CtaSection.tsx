import Link from "next/link";
import { Camera, Library, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="py-20 border-t border-border/50 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-violet-600/10 p-8 sm:p-12 shadow-sm relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-20 -right-20 size-60 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 size-60 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              <span>Akses Gratis & Terbuka untuk Umum</span>
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">
              Mulai Jembatani Komunikasi dengan BISINDO Hari Ini
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Tidak perlu mengunduh aplikasi berukuran giga-byte atau membuat akun. Cukup buka Isyara di browser komputermu atau ponselmu, dan mulai belajar atau terjemahkan isyarat sekarang juga.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/translate"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 px-6 font-semibold gap-2 shadow-sm"
                )}
              >
                <Camera className="size-4" />
                <span>Buka Kamera Sekarang</span>
              </Link>

              <Link
                href="/dictionary"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-11 px-6 font-semibold gap-2"
                )}
              >
                <Library className="size-4" />
                <span>Jelajahi Kamus BISINDO</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
