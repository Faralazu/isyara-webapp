import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Node is enough for the pure-logic suites (normalization, smoothing,
    // logger, error mappers). Component markup tests use `renderToStaticMarkup`,
    // so they need no DOM either. Switch a file to jsdom with a
    // `// @vitest-environment jsdom` docblock when it starts touching the DOM.
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      /**
       * SRD §9.1 separates the pyramid into unit tests (pure logic) and
       * integration tests (hooks + components with React Testing Library).
       * This suite is still the unit tier, so the gate measures the pure-logic
       * modules listed in SRD §9.2. Component/hook coverage arrives with the
       * integration tier and is reported but not gated yet.
       */
      include: [
        "src/lib/**/*.ts",
        "src/types/**/*.ts",
        "src/hooks/**/*.ts",
        "src/components/**/*.tsx",
      ],
      exclude: [
        "src/types/**", // type-only, nothing to execute
        "src/**/*.d.ts",
        "src/components/ui/**", // shadcn primitives, third-party patterns
        "src/components/home/**", // static presentational sections
        "src/components/layout/**", // Header/Footer/Navigation shells
        "src/components/dictionary/**", // UI shell, covered by integration tier
        "src/components/translate/**", // UI shell, covered by integration tier
        "src/components/webcam/**", // UI shell, covered by integration tier
      ],
      thresholds: {
        // SRD §9.2: >= 80% overall, with 100% targets on the pure-logic modules
        // asserted explicitly inside their own test files.
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
