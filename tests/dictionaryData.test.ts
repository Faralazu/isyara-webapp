import { describe, it, expect } from "vitest";
import {
  BISINDO_ALPHABET,
  countSignsByType,
  findSign,
  getLearnPreviewLetters,
  getSignTypeLabel,
} from "@/lib/dictionary/data";

describe("BISINDO alphabet dataset (SRD §3.2)", () => {
  it("should contain all 26 letters A-Z in order", () => {
    expect(BISINDO_ALPHABET).toHaveLength(26);

    const ids = BISINDO_ALPHABET.map((sign) => sign.id);
    const expected = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i)
    );
    expect(ids).toEqual(expected);
  });

  it("should give every sign a complete, non-empty record", () => {
    BISINDO_ALPHABET.forEach((sign) => {
      expect(sign.nameId.length).toBeGreaterThan(0);
      expect(sign.descriptionId.length).toBeGreaterThan(10);
      expect(sign.imagePath).toBe(`/images/bisindo/${sign.id}.png`);
      expect(["one-handed", "two-handed"]).toContain(sign.type);
      expect(["easy", "medium", "hard"]).toContain(sign.difficulty);
    });
  });

  it("should cover both single-hand and dual-hand signs", () => {
    expect(countSignsByType("one-handed")).toBeGreaterThan(0);
    expect(countSignsByType("two-handed")).toBeGreaterThan(0);
    expect(countSignsByType("one-handed") + countSignsByType("two-handed")).toBe(26);
  });

  it("should expose unique letters only", () => {
    const ids = BISINDO_ALPHABET.map((sign) => sign.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("findSign lookup", () => {
  it("should find a letter by exact id", () => {
    expect(findSign("A")?.id).toBe("A");
  });

  it("should be case-insensitive and tolerate whitespace", () => {
    expect(findSign("  a ")?.id).toBe("A");
    expect(findSign("z")?.id).toBe("Z");
  });

  it("should return undefined for unknown input", () => {
    expect(findSign("AA")).toBeUndefined();
    expect(findSign("1")).toBeUndefined();
    expect(findSign("")).toBeUndefined();
  });
});

describe("getSignTypeLabel", () => {
  it("should label one-handed signs as 1 Tangan", () => {
    expect(getSignTypeLabel("one-handed")).toBe("1 Tangan");
  });

  it("should label two-handed signs as 2 Tangan", () => {
    expect(getSignTypeLabel("two-handed")).toBe("2 Tangan");
  });
});

describe("getLearnPreviewLetters", () => {
  it("should resolve every preview id against the shared dataset", () => {
    const preview = getLearnPreviewLetters();

    expect(preview.length).toBeGreaterThan(0);
    preview.forEach((sign) => {
      expect(BISINDO_ALPHABET).toContain(sign);
    });
  });

  it("should include both sign types for a representative preview", () => {
    const types = getLearnPreviewLetters().map((sign) => sign.type);
    expect(types).toContain("one-handed");
    expect(types).toContain("two-handed");
  });

  it("should never return duplicates", () => {
    const ids = getLearnPreviewLetters().map((sign) => sign.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
