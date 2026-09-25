"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Search, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BISINDO_ALPHABET,
  countSignsByType,
  getSignTypeLabel,
  type BisindoLetter,
} from "@/lib/dictionary/data";

/** Filter options for the type toggle, kept as data to avoid repeated markup. */
const TYPE_FILTERS = [
  { value: "all", label: "Semua" },
  { value: "one-handed", label: "1 Tangan" },
  { value: "two-handed", label: "2 Tangan" },
] as const;

type TypeFilter = (typeof TYPE_FILTERS)[number]["value"];

export function DictionaryBrowser() {
  const [filterType, setFilterType] = useState<TypeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<BisindoLetter | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredLetters = BISINDO_ALPHABET.filter((letter) => {
    const matchesType = filterType === "all" || letter.type === filterType;
    const matchesSearch =
      normalizedQuery === "" ||
      letter.id.toLowerCase().includes(normalizedQuery) ||
      letter.nameId.toLowerCase().includes(normalizedQuery);
    return matchesType && matchesSearch;
  });

  const filterCounts: Record<TypeFilter, number> = {
    all: BISINDO_ALPHABET.length,
    "one-handed": countSignsByType("one-handed"),
    "two-handed": countSignsByType("two-handed"),
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter tipe isyarat">
          {TYPE_FILTERS.map((filter) => {
            const isActive = filterType === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setFilterType(filter.value)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {filter.label} ({filterCounts[filter.value]})
              </button>
            );
          })}
        </div>

        {/* Search input & Camera Action */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari alfabet..."
              aria-label="Cari huruf alfabet BISINDO"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-secondary/40 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <Link
            href="/translate"
            className={cn(
              buttonVariants({ size: "sm" }),
              "gap-1.5 text-xs font-semibold shrink-0"
            )}
          >
            <Camera className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Uji di Kamera</span>
          </Link>
        </div>
      </div>

      {/* Selected Letter Quick Detail Banner */}
      {selectedLetter && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-primary/30 bg-secondary/50 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-xl bg-card border border-border flex items-center justify-center text-3xl font-black text-foreground shadow-xs">
              {selectedLetter.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-foreground">{selectedLetter.nameId}</h2>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {getSignTypeLabel(selectedLetter.type)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
                {selectedLetter.descriptionId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/translate"
              className={cn(
                buttonVariants({ size: "sm" }),
                "gap-1.5 text-xs font-semibold shadow-xs"
              )}
            >
              <span>Latih Huruf {selectedLetter.id}</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => setSelectedLetter(null)}
              aria-label={`Tutup panduan huruf ${selectedLetter.id}`}
              className="rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Letters Grid */}
      <h2 className="sr-only">Daftar 26 huruf alfabet BISINDO</h2>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filteredLetters.map((item) => {
          const isSelected = selectedLetter?.id === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedLetter(item)}
              id={`letter-${item.id}`}
              aria-pressed={isSelected}
              aria-label={`Lihat panduan isyarat huruf ${item.id} (${getSignTypeLabel(item.type)})`}
              className={cn(
                "group flex flex-col justify-between rounded-xl border p-4 text-left shadow-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-card hover:border-primary/50 hover:bg-secondary/30"
              )}
            >
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {getSignTypeLabel(item.type)}
                  </span>
                  <span className="text-[10px] text-muted-foreground capitalize">
                    {item.difficulty}
                  </span>
                </div>

                <div className="my-3 flex size-14 mx-auto items-center justify-center rounded-xl bg-secondary/50 border border-border/80 text-foreground text-3xl font-black group-hover:scale-105 transition-transform">
                  {item.id}
                </div>

                <span className="block text-center font-bold text-xs text-foreground">
                  {item.nameId}
                </span>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border/60 text-center w-full">
                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  Lihat Panduan
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {filteredLetters.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          <p className="text-sm">Tidak ditemukan alfabet yang cocok dengan kata kunci &quot;{searchQuery}&quot;.</p>
          <button
            type="button"
            onClick={() => { setSearchQuery(""); setFilterType("all"); }}
            className="mt-3 text-xs font-semibold text-primary hover:underline"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}
