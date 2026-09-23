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
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
          <Camera className="size-3.5" />
          <span>Real-time Translation Mode</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Penerjemah Kamera BISINDO
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
          Tunjukkan isyarat alfabet BISINDO (1 tangan atau 2 tangan) ke kamera.
          Model AI MediaPipe akan mendeteksi koordinat 3D tangan dan menyiapkan
          fitur klasifikasi secara real-time.
        </p>
      </div>

      {/* Main Translation Client (Webcam + MediaPipe Detection) */}
      <TranslateClient />
    </main>
  );
}
