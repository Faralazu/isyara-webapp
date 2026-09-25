"use client";

import React, { useEffect, useRef } from "react";
import type { MediaPipeResult } from "@/types/camera";
import {
  buildHandGeometry,
  computeCoverTransform,
  drawHandOverlay,
  type HandOverlayContext,
} from "@/lib/mediapipe/handSkeleton";
import { cn } from "@/lib/utils";

export interface CanvasOverlayProps {
  /** Latest MediaPipe detection result. Pass `null` to clear the skeleton. */
  result: MediaPipeResult | null;

  /**
   * The mirrored `<video>` element rendered by `WebcamView`.
   * Used for the frame aspect ratio and for the object-cover mapping.
   */
  videoRef?: React.RefObject<HTMLVideoElement | null>;

  /** Whether the video is displayed mirrored (selfie view). Default: true. */
  mirrored?: boolean;

  /** Bone thickness in CSS px. Default: 3. */
  lineWidth?: number;

  /** Draw the "Kiri" / "Kanan" chip next to each wrist. Default: true. */
  showLabels?: boolean;

  /** Custom class name for the canvas element. */
  className?: string;
}

/**
 * Real-time skeleton overlay for the MediaPipe dual-hand landmarks.
 *
 * Grounded in:
 * - PRD F-02: up to 2 × 21 landmarks + skeleton drawn above the video with a
 *   visual left/right distinction.
 * - SRD Section 2.3: `WebcamView` renders `CanvasOverlay` as a child slot.
 * - SRD Section 6.3: on low-end devices the overlay can be disabled by the
 *   caller (the component simply unmounts).
 *
 * The canvas is absolutely positioned by `WebcamView`, so it inherits the exact
 * viewport box of the video — including the `object-cover` crop and the CSS
 * mirroring, which `handSkeleton` compensates for during projection.
 */
export function CanvasOverlay({
  result,
  videoRef,
  mirrored = true,
  lineWidth = 3,
  showLabels = true,
  className,
}: CanvasOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const cssWidth = Math.max(1, Math.round(rect.width || canvas.clientWidth || 1));
    const cssHeight = Math.max(1, Math.round(rect.height || canvas.clientHeight || 1));

    // Cap the device pixel ratio at 2: beyond that the extra canvas area costs
    // more than it adds visually, and detection already dominates the frame budget.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(cssWidth * dpr);
    const pixelHeight = Math.round(cssHeight * dpr);

    // Assigning width/height also resets the context, so it must happen first.
    if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const hands = result?.landmarks;
    if (!hands || hands.length === 0) return;

    const video = videoRef?.current;
    const videoWidth = video?.videoWidth ?? 0;
    const videoHeight = video?.videoHeight ?? 0;
    if (videoWidth <= 0 || videoHeight <= 0) return;

    const transform = computeCoverTransform(
      videoWidth,
      videoHeight,
      cssWidth,
      cssHeight
    );
    const geometry = buildHandGeometry(
      hands,
      result?.handedness,
      transform,
      videoWidth,
      videoHeight,
      mirrored
    );

    drawHandOverlay(ctx as unknown as HandOverlayContext, geometry, {
      lineWidth,
      showLabels,
      canvasSize: { width: cssWidth, height: cssHeight },
    });
  }, [result, videoRef, mirrored, lineWidth, showLabels]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      className={cn("block size-full", className)}
    />
  );
}
