import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger, IsyaraLogger } from "@/lib/logger";

describe("IsyaraLogger", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // The logger is a process-wide singleton; restore the default verbosity so
    // other suites in this file are not silently filtered.
    logger.setLogLevel(process.env.NODE_ENV === "production" ? "INFO" : "DEBUG");
  });

  it("should log info message with structured JSON format", () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    logger.log({
      level: "INFO",
      module: "MOD-CAM",
      event: "CAMERA_GRANTED",
      data: { width: 640, height: 480 },
    });

    expect(consoleSpy).toHaveBeenCalledOnce();
    const loggedOutput = consoleSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedOutput);

    expect(parsed.level).toBe("INFO");
    expect(parsed.module).toBe("MOD-CAM");
    expect(parsed.event).toBe("CAMERA_GRANTED");
    expect(parsed.data).toEqual({ width: 640, height: 480 });
    expect(parsed.timestamp).toBeDefined();
  });

  it("should log error message with error payload", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    logger.log({
      level: "ERROR",
      module: "MOD-ML",
      event: "MODEL_ERROR",
      error: {
        code: "E-ML-001",
        message: "Network error",
      },
    });

    expect(consoleSpy).toHaveBeenCalledOnce();
    const parsed = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(parsed.level).toBe("ERROR");
    expect(parsed.error.code).toBe("E-ML-001");
  });

  it("should route WARN to console.warn", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    logger.log({ level: "WARN", module: "MOD-CAM", event: "MEDIAPIPE_GPU_FALLBACK" });

    expect(consoleSpy).toHaveBeenCalledOnce();
    expect(JSON.parse(consoleSpy.mock.calls[0][0]).level).toBe("WARN");
  });

  it("should route DEBUG to console.debug", () => {
    const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    logger.log({ level: "DEBUG", module: "MOD-ML", event: "PREDICTION" });

    expect(consoleSpy).toHaveBeenCalledOnce();
    expect(JSON.parse(consoleSpy.mock.calls[0][0]).level).toBe("DEBUG");
  });

  it("should emit a valid ISO 8601 timestamp", () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    logger.log({ level: "INFO", module: "MOD-CAM", event: "CAMERA_STOPPED" });

    const { timestamp } = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(Number.isNaN(Date.parse(timestamp))).toBe(false);
    expect(timestamp).toBe(new Date(timestamp).toISOString());
  });

  it("should suppress entries below the configured log level", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    logger.setLogLevel("ERROR");
    logger.log({ level: "INFO", module: "MOD-CAM", event: "CAMERA_GRANTED" });
    logger.log({ level: "DEBUG", module: "MOD-CAM", event: "CAMERA_GRANTED" });
    logger.log({ level: "ERROR", module: "MOD-CAM", event: "CAMERA_DENIED" });

    expect(infoSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledOnce();
  });

  it("should keep logging at and above the configured level", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    logger.setLogLevel("WARN");
    logger.log({ level: "WARN", module: "MOD-CAM", event: "CAMERA_DISCONNECTED" });
    logger.log({ level: "ERROR", module: "MOD-CAM", event: "CAMERA_DENIED" });

    expect(warnSpy).toHaveBeenCalledOnce();
    expect(errorSpy).toHaveBeenCalledOnce();
  });

  it("should be a singleton", () => {
    expect(IsyaraLogger.getInstance()).toBe(IsyaraLogger.getInstance());
    expect(IsyaraLogger.getInstance()).toBe(logger);
  });
});
