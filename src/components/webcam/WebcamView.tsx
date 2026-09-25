"use client";

import React, { useState, useEffect } from "react";
import {
  Camera,
  CameraOff,
  RefreshCw,
  AlertCircle,
  FlipHorizontal,
  Loader2,
  ShieldCheck,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWebcam } from "@/hooks/useWebcam";
import type { UseWebcamReturn } from "@/types/camera";
import { cn } from "@/lib/utils";

/** Context handed to a render-prop `children` slot (e.g. CanvasOverlay). */
export interface WebcamViewSlot {
  /** Whether the video is currently displayed mirrored (selfie view). */
  mirrored: boolean;
}

export interface WebcamViewProps {
  /** Optional external useWebcam hook instance */
  webcam?: UseWebcamReturn;
  /** Media constraints if hook is initialized internally */
  constraints?: MediaStreamConstraints;
  /** Automatically start camera on mount */
  autoStart?: boolean;
  /** Default mirroring mode for natural sign language view */
  mirrored?: boolean;
  /** Whether to render top/bottom camera toolbar controls */
  showControls?: boolean;
  /** Callback triggered once camera metadata is loaded and stream is active */
  onReady?: (video: HTMLVideoElement) => void;
  /**
   * Optional slot for the MediaPipe skeleton overlay. Accepts either a node or
   * a render prop that receives the live mirror state and video ref.
   */
  children?: React.ReactNode | ((slot: WebcamViewSlot) => React.ReactNode);
  /** Custom container class name */
  className?: string;
}

export function WebcamView({
  webcam: externalWebcam,
  constraints,
  autoStart = false,
  mirrored = true,
  showControls = true,
  onReady,
  children,
  className,
}: WebcamViewProps) {
  // Use external webcam hook or instantiate internal one
  const internalWebcam = useWebcam({
    constraints,
    autoStart,
  });

  const {
    videoRef,
    status,
    error,
    errorCode,
    startCamera,
    stopCamera,
  } = externalWebcam ?? internalWebcam;

  const [isMirrored, setIsMirrored] = useState<boolean>(mirrored);

  // Trigger onReady callback when status transitions to active
  useEffect(() => {
    if (status === "active" && videoRef.current && onReady) {
      onReady(videoRef.current);
    }
  }, [status, videoRef, onReady]);

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs transition-colors",
        className
      )}
    >
      {/* Top Header Status Bar */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2.5 text-xs transition-colors">
        <div className="flex items-center gap-2 font-medium" aria-live="polite">
          {status === "active" && (
            <>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                Kamera Aktif (Live)
              </span>
            </>
          )}
          {status === "requesting" && (
            <>
              <Loader2 className="size-3.5 animate-spin text-primary" />
              <span className="text-primary font-medium">
                Meminta Izin Kamera...
              </span>
            </>
          )}
          {status === "initializing" && (
            <>
              <Loader2 className="size-3.5 animate-spin text-primary" />
              <span className="text-primary font-medium">
                Menghubungkan Stream...
              </span>
            </>
          )}
          {status === "idle" && (
            <>
              <span className="size-2 rounded-full bg-stone-400" />
              <span className="text-muted-foreground">
                Kamera Siap Diaktifkan
              </span>
            </>
          )}
          {status === "stopped" && (
            <>
              <span className="size-2 rounded-full bg-stone-400" />
              <span className="text-muted-foreground">Kamera Dinonaktifkan</span>
            </>
          )}
          {status === "error" && (
            <>
              <span className="size-2 rounded-full bg-destructive" />
              <span className="text-destructive font-semibold">
                Akses Terkendala
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="hidden sm:inline">Maks. 2 Tangan (Dual-Hand)</span>
          {showControls && status === "active" && (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setIsMirrored((prev) => !prev)}
                title={isMirrored ? "Nonaktifkan Cermin" : "Aktifkan Cermin"}
                aria-label="Toggle Mirror Mode"
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <FlipHorizontal className="size-3.5 mr-1" />
                <span className="text-[10px] uppercase font-bold">
                  {isMirrored ? "Cermin: On" : "Cermin: Off"}
                </span>
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="xs"
                onClick={stopCamera}
                title="Hentikan Kamera"
                aria-label="Stop Camera"
                className="h-6 px-2 text-xs font-semibold"
              >
                <CameraOff className="size-3 mr-1" />
                <span>Stop</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Viewport Area */}
      <div className="relative aspect-video w-full bg-stone-950 flex items-center justify-center overflow-hidden">
        {/* Actual Video Feed */}
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          aria-label="Tampilan siaran kamera pengguna"
          className={cn(
            "size-full object-cover transition-opacity duration-300",
            status === "active" ? "opacity-100" : "opacity-0 absolute pointer-events-none",
            isMirrored && "scale-x-[-1]"
          )}
        />

        {/* Children Slot (CanvasOverlay skeleton MediaPipe) */}
        {status === "active" && children && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {typeof children === "function"
              ? children({ mirrored: isMirrored })
              : children}
          </div>
        )}

        {/* State: IDLE */}
        {status === "idle" && (
          <div className="flex flex-col items-center justify-center p-6 text-center z-10 text-stone-400">
            <div className="size-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300 mb-4 shadow-inner">
              <Camera className="size-8" />
            </div>
            <h3 className="text-base font-semibold text-stone-200">
              Kamera Belum Dimulai
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm leading-relaxed">
              Klik tombol di bawah untuk mengizinkan akses webcam. Seluruh video diproses 100% di browser Anda (privat & aman).
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                onClick={startCamera}
                className="font-semibold gap-2 shadow-xs transition-transform hover:scale-[1.02]"
              >
                <Camera className="size-4" />
                <span>Mulai Kamera</span>
              </Button>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>Privasi Terjamin: Video tidak pernah diunggah ke server</span>
            </div>
          </div>
        )}

        {/* State: REQUESTING or INITIALIZING */}
        {(status === "requesting" || status === "initializing") && (
          <div className="flex flex-col items-center justify-center p-6 text-center z-10 text-zinc-300">
            <div className="relative mb-4">
              <div className="size-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin flex items-center justify-center" />
              <Video className="size-6 text-blue-400 absolute inset-0 m-auto" />
            </div>

            <h3 className="text-base font-semibold text-zinc-100">
              {status === "requesting"
                ? "Menunggu Izin Kamera..."
                : "Menghubungkan Stream Video..."}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">
              {status === "requesting"
                ? "Harap pilih 'Izinkan' (Allow) pada notifikasi izin browser Anda."
                : "Mengonfigurasi frame rate dan resolusi ideal untuk deteksi gestur..."}
            </p>
          </div>
        )}

        {/* State: STOPPED */}
        {status === "stopped" && (
          <div className="flex flex-col items-center justify-center p-6 text-center z-10 text-zinc-400">
            <div className="size-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
              <CameraOff className="size-7" />
            </div>
            <h3 className="text-base font-semibold text-zinc-200">
              Kamera Telah Dinonaktifkan
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">
              Aliran video dihentikan dan perangkat kamera telah dilepaskan dari memori.
            </p>

            <div className="mt-5">
              <Button
                type="button"
                onClick={startCamera}
                className="font-semibold gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Camera className="size-4" />
                <span>Aktifkan Kembali</span>
              </Button>
            </div>
          </div>
        )}

        {/* State: ERROR */}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center p-6 text-center z-10 text-zinc-200 max-w-md">
            <div className="size-14 rounded-full bg-destructive/20 border border-destructive/30 flex items-center justify-center text-destructive mb-3 shadow-inner">
              <AlertCircle className="size-7" />
            </div>

            {errorCode && (
              <span className="inline-block rounded-md bg-destructive/10 border border-destructive/20 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-destructive mb-2">
                Kode Error: {errorCode}
              </span>
            )}

            <h3 className="text-sm sm:text-base font-bold text-zinc-100">
              Gagal Mengakses Kamera
            </h3>

            <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
              {error || "Terjadi kesalahan saat meminta akses perangkat video."}
            </p>

            {/* Contextual Guidance */}
            {errorCode === "E-CAM-001" && (
              <div className="mt-3 p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400 text-left">
                💡 <strong>Cara mengatasi:</strong> Klik ikon gembok atau setelan di sebelah kiri kolom URL browser Anda, ubah izin <em>Kamera</em> menjadi <strong>Izinkan</strong>, lalu klik coba lagi.
              </div>
            )}

            {errorCode === "E-CAM-002" && (
              <div className="mt-3 p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400 text-left">
                💡 <strong>Cara mengatasi:</strong> Pastikan kabel kamera terpasang dengan kuat atau periksa apakah driver kamera Anda aktif di sistem operasi.
              </div>
            )}

            {errorCode === "E-CAM-003" && (
              <div className="mt-3 p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400 text-left">
                💡 <strong>Cara mengatasi:</strong> Periksa apakah aplikasi lain (seperti Zoom, Google Meet, Skype, atau Teams) sedang menggunakan webcam Anda.
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <Button
                type="button"
                onClick={startCamera}
                className="font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="size-3.5" />
                <span>Coba Lagi</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={stopCamera}
                className="text-xs border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Guidance Bar */}
      <div className="p-3.5 bg-muted/10 border-t border-border/40 text-xs text-muted-foreground flex items-start gap-2">
        <ShieldCheck className="size-4 text-blue-500 shrink-0 mt-0.5" />
        <p>
          <strong>Tips deteksi optimal:</strong> Pastikan pencahayaan cukup dan posisikan tangan Anda sekitar 40–70 cm di depan kamera dengan kedua telapak tangan terlihat jelas.
        </p>
      </div>
    </div>
  );
}
