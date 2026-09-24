import Link from "next/link";
import { Camera, Library } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="py-20 border-t border-border/70 bg-background transition-colors">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/80 px-3.5 py-1 text-xs font-medium text-muted-foreground">
              <span>Akses Gratis & Terbuka untuk Semua</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Mulai Jembatani Komunikasi dengan BISINDO Hari Ini
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Tidak perlu mengunduh aplikasi berukuran gigabyte atau mendaftar akun. Cukup buka Isyara di browser komputer atau ponselmu, dan mulailah belajar atau menerjemahkan isyarat sekarang juga.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/translate"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-7 font-semibold gap-2 shadow-xs transition-all"
                )}
              >
                <Camera className="size-4" />
                <span>Buka Kamera Sekarang</span>
              </Link>

              <Link
                href="/dictionary"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 px-7 font-semibold gap-2 transition-all"
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

