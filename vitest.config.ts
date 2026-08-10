/**
 * Vitest configuration
 *
 * Single test runner for all test files in the project.
 * Supports both node:test-style imports and Jest-style globals.
 *
 * Component tests (*.test.tsx) use jsdom.
 * All other tests use the node environment.
 */
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // Support both import { describe, it } from "node:test"
    // and bare global describe/it/expect style
    globals: true,
    // Default environment for logic tests
    environment: "node",
    // Enable node:test compatibility (supports describe/it imported from "node:test")
    nodeCompat: true,
    // Include all test files in src/
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    // Exclude node_modules
    exclude: ["node_modules", "dist", ".vinxi"],
    // Use the same "node" environment for SSR-safe tests
    testTimeout: 10000,
    // Report file count, test count, pass/fail/skip
    reporters: ["default"],
    // Component tests (.test.tsx) use jsdom
    environmentMatchGlobs: [["src/components/**/*.test.tsx", "jsdom"]],
  },
});
