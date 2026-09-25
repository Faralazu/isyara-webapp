import { describe, it, expect } from "vitest";
import { SAMPLE_SIGNS } from "@/components/home/VisualBanner";
import { HOW_IT_WORKS_STEPS } from "@/components/home/HowItWorksSection";
import { VISI_COMPARISONS } from "@/components/home/VisiSection";
import { findSign } from "@/lib/dictionary/data";

describe("Landing Page Components Data Integrity (Day 3)", () => {
  describe("VisualBanner SAMPLE_SIGNS", () => {
    it("should have valid sample signs defined", () => {
      expect(SAMPLE_SIGNS.length).toBeGreaterThanOrEqual(4);
    });

    it("should contain both one-handed and two-handed BISINDO letters", () => {
      const types = SAMPLE_SIGNS.map((s) => s.type);
      expect(types).toContain("one-handed");
      expect(types).toContain("two-handed");
    });

    it("should have valid metrics for confidence and inference time", () => {
      SAMPLE_SIGNS.forEach((sign) => {
        expect(sign.letter).toBeDefined();
        expect(sign.confidence).toBeGreaterThan(90);
        expect(sign.confidence).toBeLessThanOrEqual(100);
        expect(sign.inferenceTimeMs).toBeGreaterThan(0);
        expect(sign.inferenceTimeMs).toBeLessThan(100);
        expect(sign.description.length).toBeGreaterThan(10);
      });
    });

    it("should source letter content from the shared BISINDO dataset", () => {
      // The banner must never re-author descriptions that the Dictionary owns.
      SAMPLE_SIGNS.forEach((sign) => {
        const source = findSign(sign.letter);
        expect(source).toBeDefined();
        expect(sign.description).toBe(source?.descriptionId);
        expect(sign.name).toBe(source?.nameId);
        expect(sign.type).toBe(source?.type);
      });
    });
  });

  describe("HowItWorksSection Steps", () => {
    it("should follow the 3-step pipeline", () => {
      expect(HOW_IT_WORKS_STEPS).toHaveLength(3);
      expect(HOW_IT_WORKS_STEPS[0].step).toBe("01");
      expect(HOW_IT_WORKS_STEPS[1].step).toBe("02");
      expect(HOW_IT_WORKS_STEPS[2].step).toBe("03");
    });

    it("should describe webcam capture, feature extraction, and ML inference", () => {
      expect(HOW_IT_WORKS_STEPS[0].badge).toContain("WebRTC");
      expect(HOW_IT_WORKS_STEPS[1].badge).toContain("MediaPipe");
      expect(HOW_IT_WORKS_STEPS[2].badge).toContain("TensorFlow.js");
    });
  });

  describe("VisiSection Comparisons", () => {
    it("should address key community challenges and solutions", () => {
      expect(VISI_COMPARISONS.length).toBeGreaterThanOrEqual(4);
      VISI_COMPARISONS.forEach((c) => {
        expect(c.problem.length).toBeGreaterThan(0);
        expect(c.problemDesc.length).toBeGreaterThan(0);
        expect(c.solution.length).toBeGreaterThan(0);
        expect(c.solutionDesc.length).toBeGreaterThan(0);
      });
    });
  });
});
