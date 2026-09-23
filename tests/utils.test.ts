import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility helper", () => {
  it("should correctly merge class names", () => {
    const result = cn("p-4", "text-center");
    expect(result).toBe("p-4 text-center");
  });

  it("should resolve conflicting Tailwind classes favoring the latter", () => {
    const result = cn("p-2", "p-6");
    expect(result).toBe("p-6");
  });

  it("should handle conditional class names properly", () => {
    const isActive = true;
    const isError = false;
    const result = cn(
      "base-class",
      isActive && "is-active",
      isError && "is-error"
    );
    expect(result).toBe("base-class is-active");
  });

  it("should ignore falsy values, undefined, and null", () => {
    const result = cn("base", null, undefined, false, 0 && "extra");
    expect(result).toBe("base");
  });
});
