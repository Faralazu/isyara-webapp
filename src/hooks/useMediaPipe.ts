"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);

  const landmarkerRef = useRef<any>(null);
  const isMountedRef = useRef<boolean>(true);

  const loadMediaPipe = useCallback(async () => {
    if (landmarkerRef.current) {
      setIsLoaded(true);
      setLoadingProgress(100);
      return;
    }

    setIsLoading(true);
    setError(null);
    setErrorCode(null);

    try {
      const landmarker = await initializeHandLandmarker((progress) => {
        if (isMountedRef.current) {
          setLoadingProgress(progress);
        }
      });

      if (!isMountedRef.current) return;

      landmarkerRef.current = landmarker;
      setIsLoaded(true);
      setIsLoading(false);
      setLoadingProgress(100);

      onLoaded?.();
    } catch (err) {
      if (!isMountedRef.current) return;

      const mapped = mapMediaPipeError(err);
      setError(mapped.message);
      setErrorCode(mapped.code);
      setIsLoading(false);
      setIsLoaded(false);

      onError?.(mapped);
    }
  }, [onLoaded, onError]);

  useEffect(() => {
    isMountedRef.current = true;

    if (autoLoad && !isLoaded && !isLoading) {
      loadMediaPipe();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [autoLoad, isLoaded, isLoading, loadMediaPipe]);

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
