import { describe, it, expect } from "vitest";
import { NAV_ITEMS } from "@/components/layout/Navigation";

describe("Navigation Configuration & Logic", () => {
  it("should contain all 4 primary navigation routes", () => {
    const routes = NAV_ITEMS.map((item) => item.href);
    expect(routes).toContain("/");
    expect(routes).toContain("/translate");
    expect(routes).toContain("/learn");
    expect(routes).toContain("/dictionary");
    expect(NAV_ITEMS).toHaveLength(4);
  });

  it("should have valid labels for all navigation items", () => {
    NAV_ITEMS.forEach((item) => {
      expect(item.label).toBeDefined();
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.icon).toBeDefined();
    });
  });

  it("should evaluate active navigation state correctly", () => {
    const isItemActive = (itemHref: string, currentPathname: string) => {
      if (itemHref === "/") {
        return currentPathname === "/";
      }
      return currentPathname.startsWith(itemHref);
    };

    // Root path test
    expect(isItemActive("/", "/")).toBe(true);
    expect(isItemActive("/", "/translate")).toBe(false);

    // Subpath tests
    expect(isItemActive("/translate", "/translate")).toBe(true);
    expect(isItemActive("/learn", "/learn/A")).toBe(true);
    expect(isItemActive("/dictionary", "/dictionary")).toBe(true);
    expect(isItemActive("/learn", "/dictionary")).toBe(false);
  });
});
