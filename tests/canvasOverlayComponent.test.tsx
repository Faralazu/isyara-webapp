import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { CanvasOverlay } from "@/components/webcam/CanvasOverlay";
import type { MediaPipeResult } from "@/types/camera";

function makeResult(): MediaPipeResult {
  const hand = Array.from({ length: 21 }, (_, i) => ({
    x: 0.4 + i * 0.005,
    y: 0.5 + i * 0.005,
    z: -0.01 * i,
  }));

  return { landmarks: [hand], handedness: ["Right"], timestamp: 1234 };
}

describe("CanvasOverlay markup (WebcamView child slot)", () => {
  it("should render a canvas that fills the overlay slot", () => {
    const markup = renderToStaticMarkup(
      React.createElement(CanvasOverlay, { result: null })
    );

    expect(markup).toContain("<canvas");
    expect(markup).toContain("size-full");
    // The overlay is decorative: the video element already carries the label.
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('role="presentation"');
  });

  it("should render without a detection result (idle / no hands)", () => {
    const markup = renderToStaticMarkup(
      React.createElement(CanvasOverlay, { result: null, mirrored: false })
    );

    expect(markup).toContain("<canvas");
  });

  it("should render with a dual-hand detection result without crashing", () => {
    const result = makeResult();
    const markup = renderToStaticMarkup(
      React.createElement(CanvasOverlay, {
        result,
        mirrored: true,
        lineWidth: 4,
        showLabels: false,
      })
    );

    expect(markup).toContain("<canvas");
  });

  it("should merge a custom className with the base canvas classes", () => {
    const markup = renderToStaticMarkup(
      React.createElement(CanvasOverlay, {
        result: null,
        className: "opacity-0 transition-opacity",
      })
    );

    expect(markup).toContain("size-full");
    expect(markup).toContain("opacity-0");
    expect(markup).toContain("transition-opacity");
  });

  it("should accept the disabled state used by the skeleton toggle", () => {
    const markup = renderToStaticMarkup(
      React.createElement(CanvasOverlay, {
        result: makeResult(),
        enabled: false,
      })
    );

    expect(markup).toContain("<canvas");
  });
});
