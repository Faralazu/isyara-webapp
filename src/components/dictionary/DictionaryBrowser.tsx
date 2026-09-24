"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Camera, Search, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BisindoLetter {
  id: string;
  name_id: string;
  type: "one-handed" | "two-handed";
  difficulty: "easy" | "medium" | "hard";
  description?: string;
}

export const BISINDO_LETTERS: BisindoLetter[] = [
  { id: "A", name_id: "Huruf A", type: "two-handed", difficulty: "easy", description: "Telapak kiri tegak, telunjuk kanan menyentuh pangkal ibu jari kiri." },
  { id: "B", name_id: "Huruf B", type: "two-handed", difficulty: "easy", description: "Kedua tangan membentuk dua loop bersentuhan di dada." },
  { id: "C", name_id: "Huruf C", type: "two-handed", difficulty: "easy", description: "Kedua tangan melengkung membentuk setengah lingkaran." },
  { id: "D", name_id: "Huruf D", type: "two-handed", difficulty: "easy", description: "Telunjuk kiri tegak, tangan kanan membentuk lengkungan D." },
  { id: "E", name_id: "Huruf E", type: "two-handed", difficulty: "medium", description: "Telunjuk kiri tegak mendatar, tiga jari kanan menyentuh." },
  { id: "F", name_id: "Huruf F", type: "two-handed", difficulty: "medium", description: "Dua jari tangan saling menyilang tegak." },
  { id: "G", name_id: "Huruf G", type: "two-handed", difficulty: "medium", description: "Kedua tangan mengepal bertumpuk satu sama lain." },
  { id: "H", name_id: "Huruf H", type: "two-handed", difficulty: "medium", description: "Telapak kiri tegak, telapak kanan menyapu melintang." },
  { id: "I", name_id: "Huruf I", type: "one-handed", difficulty: "easy", description: "Satu tangan mengepal dengan jari kelingking tegak lurus." },
  { id: "J", name_id: "Huruf J", type: "two-handed", difficulty: "hard", description: "Gerakan meliuk kelingking membentuk huruf J di udara." },
  { id: "K", name_id: "Huruf K", type: "two-handed", difficulty: "medium", description: "Telunjuk kiri tegak, dua jari kanan membentuk V menyentuh." },
  { id: "L", name_id: "Huruf L", type: "one-handed", difficulty: "easy", description: "Satu tangan membentuk sudut 90 derajat dengan ibu jari dan telunjuk." },
  { id: "M", name_id: "Huruf M", type: "two-handed", difficulty: "medium", description: "Tiga jari kanan diletakkan di atas telapak tangan kiri." },
  { id: "N", name_id: "Huruf N", type: "two-handed", difficulty: "medium", description: "Dua jari kanan diletakkan di atas telapak tangan kiri." },
  { id: "O", name_id: "Huruf O", type: "two-handed", difficulty: "easy", description: "Ujung jari kedua tangan bertemu membentuk lingkaran bulat." },
  { id: "P", name_id: "Huruf P", type: "two-handed", difficulty: "medium", description: "Bentuk lingkaran tangan kanan menyentuh telunjuk kiri yang tegak." },
  { id: "Q", name_id: "Huruf Q", type: "two-handed", difficulty: "hard", description: "Bentuk lingkaran O dengan ekor telunjuk kanan menjulur ke bawah." },
  { id: "R", name_id: "Huruf R", type: "two-handed", difficulty: "medium", description: "Jari telunjuk dan jari tengah kanan saling menyilang." },
  { id: "S", name_id: "Huruf S", type: "two-handed", difficulty: "medium", description: "Dua jari kelingking saling bertaut." },
  { id: "T", name_id: "Huruf T", type: "two-handed", difficulty: "medium", description: "Telunjuk kanan menyentuh ujung atas telunjuk kiri secara tegak lurus." },
  { id: "U", name_id: "Huruf U", type: "two-handed", difficulty: "easy", description: "Dua telunjuk tegak berdampingan membentuk U." },
  { id: "V", name_id: "Huruf V", type: "two-handed", difficulty: "easy", description: "Dua telunjuk menyentuh di pangkal membentuk huruf V." },
  { id: "W", name_id: "Huruf W", type: "two-handed", difficulty: "medium", description: "Jari kedua tangan saling bersilangan membentuk pola W." },
  { id: "X", name_id: "Huruf X", type: "two-handed", difficulty: "hard", description: "Dua telunjuk menyilang membentuk tanda silang X." },
  { id: "Y", name_id: "Huruf Y", type: "two-handed", difficulty: "medium", description: "Telunjuk kanan diletakkan di sela jempol dan telunjuk kiri." },
  { id: "Z", name_id: "Huruf Z", type: "two-handed", difficulty: "hard", description: "Gerakan telunjuk kanan melukis pola zigzag Z di udara." },
];

export function DictionaryBrowser() {
  const [filterType, setFilterType] = useState<"all" | "one-handed" | "two-handed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<BisindoLetter | null>(null);

  const filteredLetters = BISINDO_LETTERS.filter((letter) => {
    const matchesType = filterType === "all" || letter.type === filterType;
    const matchesSearch =
      searchQuery === "" ||
      letter.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.name_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const oneHandedCount = BISINDO_LETTERS.filter((l) => l.type === "one-handed").length;
  const twoHandedCount = BISINDO_LETTERS.filter((l) => l.type === "two-handed").length;

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors",
              filterType === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            Semua ({BISINDO_LETTERS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("one-handed")}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors",
              filterType === "one-handed"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            1 Tangan ({oneHandedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("two-handed")}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors",
              filterType === "two-handed"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            2 Tangan ({twoHandedCount})
          </button>
        </div>

        {/* Search input & Camera Action */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari alfabet..."
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
            <Camera className="size-3.5" />
            <span className="hidden sm:inline">Uji di Kamera</span>
          </Link>
        </div>
      </div>

      {/* Selected Letter Quick Detail Modal / Banner if clicked */}
      {selectedLetter && (
        <div className="rounded-2xl border border-primary/30 bg-secondary/50 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-xl bg-card border border-border flex items-center justify-center text-3xl font-black text-foreground shadow-xs">
              {selectedLetter.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-foreground">{selectedLetter.name_id}</h3>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {selectedLetter.type === "two-handed" ? "2 Tangan" : "1 Tangan"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
                {selectedLetter.description}
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
              <ArrowRight className="size-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setSelectedLetter(null)}
              className="rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Letters Grid */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filteredLetters.map((item) => {
          const isTwoHanded = item.type === "two-handed";
          const isSelected = selectedLetter?.id === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedLetter(item)}
              id={`letter-${item.id}`}
              className={cn(
                "group flex flex-col justify-between rounded-xl border p-4 text-left shadow-xs transition-all cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-card hover:border-primary/50 hover:bg-secondary/30"
              )}
            >
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {isTwoHanded ? "2 Tangan" : "1 Tangan"}
                  </span>
                  <span className="text-[10px] text-muted-foreground capitalize">
                    {item.difficulty}
                  </span>
                </div>

                <div className="my-3 flex size-14 mx-auto items-center justify-center rounded-xl bg-secondary/50 border border-border/80 text-foreground text-3xl font-black group-hover:scale-105 transition-transform">
                  {item.id}
                </div>

                <h4 className="text-center font-bold text-xs text-foreground">
                  {item.name_id}
                </h4>
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
