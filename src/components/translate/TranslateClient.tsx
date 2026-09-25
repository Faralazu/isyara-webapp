"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Hand,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  Cpu,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useWebcam } from "@/hooks/useWebcam";
import { useMediaPipe } from "@/hooks/useMediaPipe";
import { WebcamView } from "@/components/webcam/WebcamView";
import { CanvasOverlay } from "@/components/webcam/CanvasOverlay";
import { getHandStyle, resolveHandSides } from "@/lib/mediapipe/handSkeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";
import type { MediaPipeResult } from "@/types/camera";

export function TranslateClient() {
  const webcam = useWebcam();
  const { videoRef, status: cameraStatus } = webcam;

  const mediaPipe = useMediaPipe();
  const {
    isLoading: isMpLoading,
    isLoaded: isMpLoaded,
    loadingProgress,
    error: mpError,
    errorCode: mpErrorCode,
    detect,
  } = mediaPipe;

  const [handResult, setHandResult] = useState<MediaPipeResult | null>(null);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const lastLogTimeRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Active Detection Loop using requestAnimationFrame
  useEffect(() => {
    let isActive = true;

    const runDetection = () => {
      if (!isActive) return;

      if (
        cameraStatus === "active" &&
        isMpLoaded &&
        videoRef.current &&
        videoRef.current.readyState >= 2
      ) {
        const result = detect(videoRef.current);

        if (result && result.landmarks && result.landmarks.length > 0) {
          setHandResult(result);

          // Throttled structured log (~1 per second) as required for Day 5.
          const now = performance.now();
          if (now - lastLogTimeRef.current > 1000) {
            lastLogTimeRef.current = now;
            logger.log({
              level: "DEBUG",
              module: "MOD-CAM",
              event: "HAND_DETECTED",
              data: {
                handCount: result.landmarks.length,
                handedness: result.handedness ?? [],
                wrist: result.landmarks.map((hand) => ({
                  x: Number(hand[0]?.x.toFixed(3)),
                  y: Number(hand[0]?.y.toFixed(3)),
                  z: Number(hand[0]?.z.toFixed(3)),
                })),
              },
            });
          }
        } else {
          setHandResult(null);
        }
      } else {
        setHandResult(null);
      }

      animFrameIdRef.current = requestAnimationFrame(runDetection);
    };

    if (cameraStatus === "active" && isMpLoaded) {
      animFrameIdRef.current = requestAnimationFrame(runDetection);
    } else {
      queueMicrotask(() => {
        if (isActive) setHandResult(null);
      });
    }

    return () => {
      isActive = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [cameraStatus, isMpLoaded, detect, videoRef]);

  const numHands = handResult?.landmarks?.length || 0;
  const handednessList = handResult?.handedness || [];
  const handSides = resolveHandSides(handednessList, numHands);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left: Camera Stream Viewport + Dual-Hand Skeleton Overlay */}
      <WebcamView webcam={webcam} className="lg:col-span-2">
        {({ mirrored }) => (
          <CanvasOverlay
            result={handResult}
            videoRef={videoRef}
            mirrored={mirrored}
            showLabels={showSkeleton}
            className={cn(
              "transition-opacity duration-200",
              showSkeleton ? "opacity-100" : "opacity-0"
            )}
          />
        )}
      </WebcamView>

      {/* Right: MediaPipe & Hand Tracking Inspector Panel */}
      <div className="flex flex-col gap-6">
        {/* MediaPipe AI Engine Status Card */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="size-3.5 text-primary" />
              <span>MediaPipe Tasks Vision</span>
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              WASM / GPU
            </span>
          </div>

          {isMpLoaded && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5">
              <CheckCircle2 className="size-4 shrink-0" />
              <div>
                <span className="font-semibold">Model AI Aktif</span>
                <p className="text-[11px] text-muted-foreground">
                  Dual-Hand Landmarker siap (Maks. 2 Tangan)
                </p>
              </div>
            </div>
          )}

          {isMpLoading && (
            <div className="space-y-2 bg-secondary/60 border border-border rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-foreground font-medium">
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                  <span>Memuat Model MediaPipe...</span>
                </span>
                <span className="font-mono text-muted-foreground">
                  {loadingProgress}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          )}

          {mpError && (
            <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-2.5">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Gagal Memuat Model</span>
                {mpErrorCode && (
                  <span className="ml-1.5 font-mono text-[10px]">
                    [{mpErrorCode}]
                  </span>
                )}
                <p className="text-[11px] mt-0.5 text-destructive/90">
                  {mpError}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Live Hand Tracking Status Panel */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs flex flex-col items-center justify-center text-center transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" />
            <span>Deteksi Tangan Real-Time</span>
          </span>

          {/* Hands Status Pill */}
          <div className="my-5 flex flex-col items-center">
            {cameraStatus !== "active" ? (
              <div className="flex flex-col items-center text-muted-foreground">
                <div className="size-16 rounded-full bg-secondary border border-border flex items-center justify-center mb-2">
                  <Camera className="size-6 text-muted-foreground" />
                </div>
                <span className="text-xs font-medium">
                  Nyalakan kamera untuk mulai deteksi
                </span>
              </div>
            ) : numHands === 0 ? (
              <div className="flex flex-col items-center text-amber-700 dark:text-amber-400">
                <div className="size-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-2 animate-pulse">
                  <Hand className="size-7 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-xs font-semibold">
                  Tunjukkan Tangan ke Kamera
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5">
                  Mendukung 1 tangan atau 2 tangan (BISINDO)
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-emerald-700 dark:text-emerald-400">
                <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-2 shadow-inner">
                  <Hand className="size-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  {numHands === 2
                    ? "2 Tangan Terdeteksi (Dual-Hand)"
                    : "1 Tangan Terdeteksi (Single-Hand)"}
                </span>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                  {handSides.map((side, idx) => {
                    const style = getHandStyle(side);
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="size-2 rounded-full"
                          style={{ backgroundColor: style.bone }}
                        />
                        <span>
                          Tangan {idx + 1}: {style.label}
                        </span>
                        <span className="font-mono text-[10px] font-normal text-muted-foreground">
                          {handednessList[idx] || "N/A"}
                        </span>
                      </span>
                    );
                  })}
                </div>
                <span className="text-[11px] text-muted-foreground font-mono mt-2 bg-secondary px-2 py-0.5 rounded-md border border-border">
                  {numHands * 21} Titik Koordinat 3D Terlacak
                </span>
              </div>
            )}
          </div>

          {/* Skeleton Overlay Controls & Colour Legend */}
          <div className="w-full flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2 mb-4">
            <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: getHandStyle("left").bone }}
                />
                Kiri
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: getHandStyle("right").bone }}
                />
                Kanan
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setShowSkeleton((prev) => !prev)}
              aria-pressed={showSkeleton}
              title={
                showSkeleton
                  ? "Sembunyikan overlay skeleton"
                  : "Tampilkan overlay skeleton"
              }
              className="h-6 px-2 text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground"
            >
              {showSkeleton ? (
                <Eye className="size-3.5 mr-1" />
              ) : (
                <EyeOff className="size-3.5 mr-1" />
              )}
              <span>Skeleton: {showSkeleton ? "On" : "Off"}</span>
            </Button>
          </div>

          {/* Live Coordinate Preview when hands detected */}
          {handResult && handResult.landmarks && (
            <div className="w-full bg-stone-950 text-stone-300 p-3 rounded-xl border border-stone-800 text-[11px] text-left font-mono space-y-1 overflow-x-auto">
              <div className="text-stone-500 text-[10px] uppercase font-bold border-b border-stone-800 pb-1 flex justify-between">
                <span>Contoh Koordinat Wrist (Titik 0)</span>
                <span>x, y, z</span>
              </div>
              {handResult.landmarks.map((hand, idx) => {
                const style = getHandStyle(handSides[idx] ?? "unknown");
                return (
                  <div key={idx} className="flex justify-between pt-0.5">
                    <span style={{ color: style.bone }}>
                      Hand {idx + 1} ({style.label}):
                    </span>
                    <span>
                      {hand[0]?.x.toFixed(2)}, {hand[0]?.y.toFixed(2)},{" "}
                      {hand[0]?.z.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border w-full flex items-center justify-between text-xs text-muted-foreground">
            <span>Mode Aliran</span>
            <span className="font-mono text-foreground font-semibold">
              Video (Continuous)
            </span>
          </div>
        </div>

        {/* Dictionary Shortcut Card */}
        <div className="rounded-xl border border-border bg-secondary/50 p-5 transition-colors">
          <div className="flex items-center gap-2 font-semibold text-sm text-foreground mb-1">
            <Hand className="size-4 text-primary" />
            <span>Belum hafal isyaratnya?</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Buka katalog alfabet BISINDO untuk melihat contoh gestur satu tangan dan dua tangan.
          </p>
          <Link
            href="/dictionary"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full justify-center gap-1.5 text-xs font-semibold"
            )}
          >
            <span>Buka Kamus Isyarat</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
