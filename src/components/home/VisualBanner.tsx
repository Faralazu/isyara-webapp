"use client";

import { useState } from "react";
import { Eye, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { findSign, getSignTypeLabel, type BisindoLetter } from "@/lib/dictionary/data";
import {
  FEATURES_PER_HAND,
  LANDMARKS_PER_HAND,
  TOTAL_FEATURES,
} from "@/lib/tensorflow/normalize";

/**
 * Simulated inference metrics for the landing-page demo.
 * Letter content comes from the shared BISINDO dataset, so the demo can never
 * drift from the Dictionary page. Only the numbers below are mock data.
 */
const SIMULATION_METRICS: Record<string, { confidence: number; inferenceTimeMs: number }> = {
  A: { confidence: 97.4, inferenceTimeMs: 32 },
  B: { confidence: 96.1, inferenceTimeMs: 35 },
  I: { confidence: 98.9, inferenceTimeMs: 28 },
  L: { confidence: 99.2, inferenceTimeMs: 29 },
};

export interface SampleSign {
  letter: string;
  name: string;
  type: BisindoLetter["type"];
  confidence: number;
  inferenceTimeMs: number;
  description: string;
}

/** Demo signs: dictionary content + simulated metrics. */
export const SAMPLE_SIGNS: SampleSign[] = Object.entries(SIMULATION_METRICS).flatMap(
  ([letter, metrics]) => {
    const sign = findSign(letter);
    if (!sign) return [];

    return [
      {
        letter: sign.id,
        name: sign.nameId,
        type: sign.type,
        confidence: metrics.confidence,
        inferenceTimeMs: metrics.inferenceTimeMs,
        description: sign.descriptionId,
      },
    ];
  }
);

export function VisualBanner() {
  const [activeSign, setActiveSign] = useState<SampleSign>(SAMPLE_SIGNS[0]);

  return (
    <div className="relative mx-auto w-full max-w-4xl rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm overflow-hidden text-left transition-colors">
      {/* Top Banner Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Simulasi Landmark MediaPipe</span>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {LANDMARKS_PER_HAND} Sendi Jari per Tangan
          </span>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-1 hidden sm:inline">
            Contoh Huruf:
          </span>
          {SAMPLE_SIGNS.map((sign) => {
            const isSelected = activeSign.letter === sign.letter;
            return (
              <button
                key={sign.letter}
                type="button"
                onClick={() => setActiveSign(sign)}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
                aria-pressed={isSelected}
              >
                {sign.letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-12 items-center">
        {/* Left Side: Hand Skeleton Interactive Visual Canvas (SVG) */}
        <div className="relative md:col-span-7 aspect-[4/3] rounded-xl border border-border/70 bg-stone-950 p-4 flex flex-col justify-between overflow-hidden shadow-inner">
          {/* Top Camera Overlay Info */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-stone-400 font-mono">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="text-rose-400 animate-pulse font-bold">
                ● REC
              </span>
              <span>640×480 • 30 FPS</span>
            </div>
            <div className="rounded bg-stone-900 px-2 py-0.5 border border-stone-800 text-stone-300">
              {activeSign.type === "two-handed"
                ? `2 Tangan (${TOTAL_FEATURES} Coords)`
                : `1 Tangan (${FEATURES_PER_HAND} Coords)`}
            </div>
          </div>

          {/* Interactive SVG Hand Skeleton Rendering */}
          <div className="relative z-10 my-auto flex items-center justify-center py-2">
            <svg
              viewBox="0 0 400 240"
              role="img"
              className="w-full max-w-[340px] h-auto drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]"
              aria-label={`Visualisasi skeleton tangan untuk isyarat ${activeSign.letter}`}
            >
              {activeSign.type === "two-handed" ? (
                // DUAL-HAND SKELETON (Left hand + Right hand)
                <g>
                  {/* Left Hand Skeleton (Violet) */}
                  <g className="stroke-violet-400/80 stroke-2" fill="none">
                    {/* Palm to fingers lines */}
                    <line x1="120" y1="180" x2="90" y2="140" />
                    <line x1="120" y1="180" x2="110" y2="120" />
                    <line x1="120" y1="180" x2="130" y2="115" />
                    <line x1="120" y1="180" x2="150" y2="125" />
                    <line x1="120" y1="180" x2="165" y2="145" />

                    {/* Finger segments */}
                    <line x1="90" y1="140" x2="70" y2="125" />
                    <line x1="110" y1="120" x2="105" y2="90" />
                    <line x1="130" y1="115" x2="130" y2="80" />
                    <line x1="150" y1="125" x2="155" y2="95" />
                    <line x1="165" y1="145" x2="175" y2="120" />
                  </g>
                  {/* Left Hand Joints */}
                  <g className="fill-violet-300">
                    <circle cx="120" cy="180" r="4.5" className="fill-violet-400" />
                    <circle cx="90" cy="140" r="3.5" />
                    <circle cx="110" cy="120" r="3.5" />
                    <circle cx="130" cy="115" r="3.5" />
                    <circle cx="150" cy="125" r="3.5" />
                    <circle cx="165" cy="145" r="3.5" />
                    <circle cx="70" cy="125" r="4" className="fill-violet-200 animate-pulse" />
                    <circle cx="105" cy="90" r="4" className="fill-violet-200 animate-pulse" />
                    <circle cx="130" cy="80" r="4" className="fill-violet-200 animate-pulse" />
                    <circle cx="155" cy="95" r="4" className="fill-violet-200 animate-pulse" />
                    <circle cx="175" cy="120" r="4" className="fill-violet-200 animate-pulse" />
                  </g>

                  {/* Right Hand Skeleton (Cyan / Blue) */}
                  <g className="stroke-cyan-400/80 stroke-2" fill="none">
                    <line x1="280" y1="180" x2="250" y2="140" />
                    <line x1="280" y1="180" x2="270" y2="120" />
                    <line x1="280" y1="180" x2="290" y2="115" />
                    <line x1="280" y1="180" x2="310" y2="125" />
                    <line x1="280" y1="180" x2="325" y2="145" />

                    <line x1="250" y1="140" x2="230" y2="125" />
                    <line x1="270" y1="120" x2="265" y2="90" />
                    <line x1="290" y1="115" x2="290" y2="80" />
                    <line x1="310" y1="125" x2="315" y2="95" />
                    <line x1="325" y1="145" x2="335" y2="120" />
                  </g>
                  {/* Right Hand Joints */}
                  <g className="fill-cyan-300">
                    <circle cx="280" cy="180" r="4.5" className="fill-cyan-400" />
                    <circle cx="250" cy="140" r="3.5" />
                    <circle cx="270" cy="120" r="3.5" />
                    <circle cx="290" cy="115" r="3.5" />
                    <circle cx="310" cy="125" r="3.5" />
                    <circle cx="325" cy="145" r="3.5" />
                    <circle cx="230" cy="125" r="4" className="fill-cyan-200 animate-pulse" />
                    <circle cx="265" cy="90" r="4" className="fill-cyan-200 animate-pulse" />
                    <circle cx="290" cy="80" r="4" className="fill-cyan-200 animate-pulse" />
                    <circle cx="315" cy="95" r="4" className="fill-cyan-200 animate-pulse" />
                    <circle cx="335" cy="120" r="4" className="fill-cyan-200 animate-pulse" />
                  </g>
                </g>
              ) : (
                // SINGLE-HAND SKELETON (e.g. Huruf I atau L)
                <g>
                  <g className="stroke-blue-400 stroke-2" fill="none">
                    <line x1="200" y1="190" x2="160" y2="150" />
                    <line x1="200" y1="190" x2="185" y2="130" />
                    <line x1="200" y1="190" x2="205" y2="125" />
                    <line x1="200" y1="190" x2="225" y2="135" />
                    <line x1="200" y1="190" x2="245" y2="155" />

                    {/* Extended fingers depending on sign */}
                    {activeSign.letter === "L" ? (
                      <>
                        {/* Thumb extended */}
                        <line x1="160" y1="150" x2="130" y2="150" />
                        {/* Index extended vertically */}
                        <line x1="185" y1="130" x2="185" y2="70" />
                        {/* Others folded */}
                        <line x1="205" y1="125" x2="205" y2="145" />
                        <line x1="225" y1="135" x2="225" y2="150" />
                        <line x1="245" y1="155" x2="245" y2="165" />
                      </>
                    ) : (
                      <>
                        {/* Pinky extended vertically for 'I' */}
                        <line x1="160" y1="150" x2="170" y2="160" />
                        <line x1="185" y1="130" x2="190" y2="150" />
                        <line x1="205" y1="125" x2="205" y2="150" />
                        <line x1="225" y1="135" x2="225" y2="150" />
                        <line x1="245" y1="155" x2="255" y2="80" />
                      </>
                    )}
                  </g>
                  {/* Joints */}
                  <g className="fill-blue-200">
                    <circle cx="200" cy="190" r="5" className="fill-blue-500" />
                    <circle cx="160" cy="150" r="3.5" />
                    <circle cx="185" cy="130" r="3.5" />
                    <circle cx="205" cy="125" r="3.5" />
                    <circle cx="225" cy="135" r="3.5" />
                    <circle cx="245" cy="155" r="3.5" />
                    {activeSign.letter === "L" ? (
                      <>
                        <circle cx="130" cy="150" r="4.5" className="fill-cyan-300 animate-pulse" />
                        <circle cx="185" cy="70" r="4.5" className="fill-cyan-300 animate-pulse" />
                      </>
                    ) : (
                      <>
                        <circle cx="255" cy="80" r="4.5" className="fill-cyan-300 animate-pulse" />
                      </>
                    )}
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Overlay Label */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/80 pt-2 font-mono">
            <span className="flex items-center gap-1.5">
              <Eye className="size-3 text-blue-400" />
              <span>Tracking {LANDMARKS_PER_HAND} Keypoints</span>
            </span>
            <span className="text-zinc-500">Normalisasi Relatif ke Wrist</span>
          </div>
        </div>

        {/* Right Side: AI Inference Readout Card */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Prediksi AI
              </span>
              <span
                className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {getSignTypeLabel(activeSign.type)}
              </span>
            </div>

            {/* Letter Display (Solid Typography) */}
            <div className="my-4 flex items-baseline justify-center gap-3">
              <span className="text-7xl font-black tracking-tight text-foreground">
                {activeSign.letter}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">
                ({activeSign.name})
              </span>
            </div>

            {/* Confidence Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">Tingkat Keyakinan</span>
                <span className="text-foreground font-bold font-mono">
                  {activeSign.confidence}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${activeSign.confidence}%` }}
                />
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
              {activeSign.description}
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/80 bg-secondary/50 p-3 flex items-center gap-2.5">
              <Zap className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-muted-foreground">Latensi Inference</div>
                <div className="text-xs font-bold text-foreground font-mono">
                  {activeSign.inferenceTimeMs} ms
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-secondary/50 p-3 flex items-center gap-2.5">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-muted-foreground">Privasi Kamera</div>
                <div className="text-xs font-bold text-foreground">
                  100% On-Device
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
