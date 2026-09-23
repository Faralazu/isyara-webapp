import type { Metadata } from "next";
import Link from "next/link";
import { Library, Hand, ArrowRight, Sparkles, Filter } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Kamus Alfabet BISINDO",
  description:
    "Katalog lengkap 26 alfabet Bahasa Isyarat Indonesia (BISINDO) A-Z dengan panduan isyarat satu tangan dan dua tangan.",
};

// Data katalog awal 26 huruf BISINDO sesuai spesifikasi SRD Bagian 3.2
const BISINDO_LETTERS = [
  { id: "A", name_id: "Huruf A", type: "two-handed", difficulty: "easy" },
  { id: "B", name_id: "Huruf B", type: "two-handed", difficulty: "easy" },
  { id: "C", name_id: "Huruf C", type: "two-handed", difficulty: "easy" },
  { id: "D", name_id: "Huruf D", type: "two-handed", difficulty: "easy" },
  { id: "E", name_id: "Huruf E", type: "two-handed", difficulty: "medium" },
  { id: "F", name_id: "Huruf F", type: "two-handed", difficulty: "medium" },
  { id: "G", name_id: "Huruf G", type: "two-handed", difficulty: "medium" },
  { id: "H", name_id: "Huruf H", type: "two-handed", difficulty: "medium" },
  { id: "I", name_id: "Huruf I", type: "one-handed", difficulty: "easy" },
  { id: "J", name_id: "Huruf J", type: "two-handed", difficulty: "hard" },
  { id: "K", name_id: "Huruf K", type: "two-handed", difficulty: "medium" },
  { id: "L", name_id: "Huruf L", type: "one-handed", difficulty: "easy" },
  { id: "M", name_id: "Huruf M", type: "two-handed", difficulty: "medium" },
  { id: "N", name_id: "Huruf N", type: "two-handed", difficulty: "medium" },
  { id: "O", name_id: "Huruf O", type: "two-handed", difficulty: "easy" },
  { id: "P", name_id: "Huruf P", type: "two-handed", difficulty: "medium" },
  { id: "Q", name_id: "Huruf Q", type: "two-handed", difficulty: "hard" },
  { id: "R", name_id: "Huruf R", type: "two-handed", difficulty: "medium" },
  { id: "S", name_id: "Huruf S", type: "two-handed", difficulty: "medium" },
  { id: "T", name_id: "Huruf T", type: "two-handed", difficulty: "medium" },
  { id: "U", name_id: "Huruf U", type: "two-handed", difficulty: "easy" },
  { id: "V", name_id: "Huruf V", type: "two-handed", difficulty: "easy" },
  { id: "W", name_id: "Huruf W", type: "two-handed", difficulty: "medium" },
  { id: "X", name_id: "Huruf X", type: "two-handed", difficulty: "hard" },
  { id: "Y", name_id: "Huruf Y", type: "two-handed", difficulty: "medium" },
  { id: "Z", name_id: "Huruf Z", type: "two-handed", difficulty: "hard" },
];

export default function DictionaryPage() {
  const oneHandedCount = BISINDO_LETTERS.filter((l) => l.type === "one-handed").length;
  const twoHandedCount = BISINDO_LETTERS.filter((l) => l.type === "two-handed").length;

  return (
    <main className="flex-1 container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header Page */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-0.5 text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">
          <Library className="size-3.5" />
          <span>Kamus Alfabet A-Z</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Kamus Bahasa Isyarat Indonesia (BISINDO)
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-3xl">
          Eksplorasi seluruh alfabet BISINDO yang digunakan alami sehari-hari oleh
          komunitas Tuli Indonesia. Temukan bentuk gestur satu tangan dan dua tangan.
        </p>
      </div>

      {/* Filter Stats Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="size-3.5 text-primary" />
          <span>Total: <strong>26 Huruf</strong> ({oneHandedCount} Satu Tangan, {twoHandedCount} Dua Tangan)</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/translate"
            className={cn(
              buttonVariants({ size: "sm" }),
              "gap-1.5 text-xs font-semibold"
            )}
          >
            <span>Coba di Kamera</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* Letters Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {BISINDO_LETTERS.map((item) => {
          const isTwoHanded = item.type === "two-handed";

          return (
            <div
              key={item.id}
              id={`letter-${item.id}`}
              className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-xs transition hover:border-primary/50 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                      isTwoHanded
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    )}
                  >
                    {isTwoHanded ? "2 Tangan" : "1 Tangan"}
                  </span>
                  <span className="text-[10px] text-muted-foreground capitalize">
                    {item.difficulty}
                  </span>
                </div>

                <div className="my-2 flex size-16 mx-auto items-center justify-center rounded-2xl bg-muted/40 border border-border/50 text-foreground text-3xl font-black group-hover:scale-105 transition-transform">
                  {item.id}
                </div>

                <h3 className="text-center font-bold text-sm text-foreground mt-2">
                  {item.name_id}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40">
                <Link
                  href="/translate"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "xs" }),
                    "w-full justify-center text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                  )}
                >
                  Latih Isyarat
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
