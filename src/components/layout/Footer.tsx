import Link from "next/link";
import { Heart, ShieldCheck } from "lucide-react";
import { GithubIcon, IsyaraLogo } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40 text-muted-foreground text-sm transition-colors">
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 font-bold text-lg text-foreground">
              <IsyaraLogo className="size-6 shadow-xs" />
              <span className="font-extrabold text-foreground tracking-tight">
                Isyara
              </span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
              Penerjemah Bahasa Isyarat Indonesia (BISINDO) real-time berbasis
              kecerdasan buatan on-device. Menjembatani komunikasi alami antara
              teman Tuli dan teman dengar melalui teknologi yang privat, cepat,
              dan inklusif.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="size-3.5" />
              <span>100% On-Device & Privacy First</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs tracking-wider uppercase text-foreground">
              Fitur Aplikasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/translate"
                  className="transition-colors hover:text-foreground"
                >
                  Penerjemah Kamera
                </Link>
              </li>
              <li>
                <Link
                  href="/learn"
                  className="transition-colors hover:text-foreground"
                >
                  Modul Belajar & Kuis
                </Link>
              </li>
              <li>
                <Link
                  href="/dictionary"
                  className="transition-colors hover:text-foreground"
                >
                  Kamus Alfabet BISINDO
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Open Source */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs tracking-wider uppercase text-foreground">
              Sumber Daya
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/Faralazu/isyara-webapp"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <GithubIcon className="size-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <span className="text-muted-foreground/80">Lisensi MIT</span>
              </li>
              <li>
                <span className="text-muted-foreground/80">MediaPipe & TF.js On-Device</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col items-center justify-between gap-3 text-xs sm:flex-row text-muted-foreground/80">
          <div className="flex items-center gap-1.5">
            <span>Dibuat dengan</span>
            <Heart className="size-3.5 text-rose-500 fill-rose-500 inline" />
            <span>untuk Aksesibilitas Komunitas Tuli Indonesia</span>
          </div>
          <div>
            <span>&copy; {new Date().getFullYear()} Isyara Web Application. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
