"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { HandLandmarker } from "@mediapipe/tasks-vision";
import type { UseMediaPipeReturn, MediaPipeResult } from "@/types/camera";
import type { ErrorCode } from "@/types/events";
import {
  initializeHandLandmarker,
  detectHandsFromVideo,
  mapMediaPipeError,
} from "@/lib/mediapipe/handLandmarker";

export interface UseMediaPipeOptions {
  autoLoad?: boolean;
  onLoaded?: () => void;
  onError?: (error: { code: ErrorCode; message: string }) => void;
}

/**
 * Custom React Hook to manage MediaPipe Hand Landmarker lifecycle and detection
 * Grounded in SRD Section 4.1 Contract 2 (useMediaPipe)
 */
export function useMediaPipe(
  options: UseMediaPipeOptions = {}
): UseMediaPipeReturn {
  const { autoLoad = true, onLoaded, onError } = options;

  // When autoLoad is enabled the model is loading from the very first render,
  // so the initial state already reflects that (no setState needed on mount).
  const [isLoading, setIsLoading] = useState<boolean>(autoLoad);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);

  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const hasRequestedLoadRef = useRef<boolean>(false);

  /**
   * Kick off model initialization.
   *
   * The loader is a singleton with its own promise cache, so an already
   * initialized instance resolves immediately. All state updates happen in
   * async continuations: applying them synchronously would cascade renders.
   */
  const loadMediaPipe = useCallback(() => {
    initializeHandLandmarker((progress) => {
      if (isMountedRef.current) {
        setLoadingProgress(progress);
      }
    })
      .then((landmarker) => {
        if (!isMountedRef.current) return;

        landmarkerRef.current = landmarker;
        setIsLoaded(true);
        setIsLoading(false);
        setLoadingProgress(100);

        onLoaded?.();
      })
      .catch((err: unknown) => {
        if (!isMountedRef.current) return;

        const mapped = mapMediaPipeError(err);
        setError(mapped.message);
        setErrorCode(mapped.code);
        setIsLoading(false);
        setIsLoaded(false);

        onError?.(mapped);
      });
  }, [onLoaded, onError]);

  useEffect(() => {
    isMountedRef.current = true;

    // Load at most once per mount: re-running after a failure would retry
    // forever without backoff.
    if (autoLoad && !hasRequestedLoadRef.current) {
      hasRequestedLoadRef.current = true;
      loadMediaPipe();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [autoLoad, loadMediaPipe]);

  const detect = useCallback(
    (video: HTMLVideoElement): MediaPipeResult | null => {
      if (!landmarkerRef.current) return null;
      return detectHandsFromVideo(landmarkerRef.current, video);
    },
    []
  );

  return {
    isLoading,
    isLoaded,
    loadingProgress,
    error,
    errorCode,
    detect,
  };
}
