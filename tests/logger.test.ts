import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger } from "@/lib/logger";

describe("IsyaraLogger", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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
});
