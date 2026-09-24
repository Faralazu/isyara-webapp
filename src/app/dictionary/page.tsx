import type { Metadata } from "next";
import { Library } from "lucide-react";
import { DictionaryBrowser } from "@/components/dictionary/DictionaryBrowser";

export const metadata: Metadata = {
  title: "Kamus Alfabet BISINDO",
  description:
    "Katalog lengkap 26 alfabet Bahasa Isyarat Indonesia (BISINDO) A-Z dengan panduan isyarat satu tangan dan dua tangan.",
};

export default function DictionaryPage() {
  return (
    <main className="flex-1 container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header Page */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/80 px-3.5 py-1 text-xs font-medium text-muted-foreground">
          <Library className="size-3.5 text-primary" />
          <span>Katalog Alfabet A-Z</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Kamus Bahasa Isyarat Indonesia (BISINDO)
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Eksplorasi seluruh alfabet BISINDO yang digunakan secara alami oleh
          komunitas Tuli di Indonesia. Klik setiap alfabet untuk melihat deskripsi posisi jari
          atau langsung latih bentuk isyaratnya di kamera.
        </p>
      </div>

      {/* Main Interactive Browser Component */}
      <DictionaryBrowser />
    </main>
  );
}
