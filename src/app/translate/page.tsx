import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { TranslateClient } from "@/components/translate/TranslateClient";

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
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/80 px-3.5 py-1 text-xs font-medium text-muted-foreground">
          <Camera className="size-3.5 text-primary" />
          <span>Penerjemah Real-Time</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Penerjemah Kamera BISINDO
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Tunjukkan isyarat alfabet BISINDO (satu atau dua tangan) ke arah kamera.
          AI akan melacak koordinat sendi tangan Anda secara langsung dan privat di peramban.
        </p>
      </div>

      {/* Main Translation Client (Webcam + MediaPipe Detection) */}
      <TranslateClient />
    </main>
  );
}
