/**
 * Phase F — Data Sufficiency Unit Tests
 */

import { describe, it, expect } from "vitest";
import {
  metricSufficiency,
  overallSufficiency,
  canShowTrend,
  METRIC_MINIMUMS,
} from "./sufficiency";
import type { MetricKey } from "./types";

describe("sufficiency", () => {
  describe("metricSufficiency", () => {
    it("returns 'none' for 0 records", () => {
      expect(metricSufficiency("sleepEfficiency", 0)).toBe("none");
    });

    it("returns 'insufficient' for 1-2 records for most metrics", () => {
      expect(metricSufficiency("sleepEfficiency", 1)).toBe("insufficient");
      expect(metricSufficiency("sleepEfficiency", 2)).toBe("insufficient");
    });

    it("returns 'limited' for 3-6 records", () => {
      expect(metricSufficiency("sleepEfficiency", 3)).toBe("limited");
      expect(metricSufficiency("sleepEfficiency", 6)).toBe("limited");
    });

    it("returns 'sufficient' for 7+ records", () => {
      expect(metricSufficiency("sleepEfficiency", 7)).toBe("sufficient");
      expect(metricSufficiency("sleepEfficiency", 30)).toBe("sufficient");
    });

    it("sleepRegularity needs 3 records just to be computable", () => {
      expect(metricSufficiency("sleepRegularity", 1)).toBe("none");
      expect(metricSufficiency("sleepRegularity", 3)).toBe("insufficient");
      expect(metricSufficiency("sleepRegularity", 5)).toBe("limited");
    });

    it("bedtimeVariability needs 2 records", () => {
      expect(metricSufficiency("bedtimeVariability", 1)).toBe("none");
      expect(metricSufficiency("bedtimeVariability", 2)).toBe("insufficient");
    });
  });

  describe("overallSufficiency", () => {
    it("matches default thresholds", () => {
      expect(overallSufficiency(0)).toBe("none");
      expect(overallSufficiency(1)).toBe("insufficient");
      expect(overallSufficiency(2)).toBe("insufficient");
      expect(overallSufficiency(3)).toBe("limited");
      expect(overallSufficiency(6)).toBe("limited");
      expect(overallSufficiency(7)).toBe("sufficient");
      expect(overallSufficiency(14)).toBe("sufficient");
    });

    it("all four states are reachable with distinct record counts", () => {
      // 0 → none
      expect(overallSufficiency(0)).toBe("none");
      // 1–2 → insufficient
      expect(overallSufficiency(1)).toBe("insufficient");
      expect(overallSufficiency(2)).toBe("insufficient");
      // 3–6 → limited
      expect(overallSufficiency(3)).toBe("limited");
      expect(overallSufficiency(6)).toBe("limited");
      // 7+ → sufficient
      expect(overallSufficiency(7)).toBe("sufficient");
      expect(overallSufficiency(8)).toBe("sufficient");
    });

    it("boundary values are correct", () => {
      // Exact boundaries: none=1, insufficient=3, limited=7
      // Samples below each threshold fall into the lower level
      expect(overallSufficiency(0)).toBe("none"); // < 1
      expect(overallSufficiency(1)).toBe("insufficient"); // ≥ 1, < 3
      expect(overallSufficiency(2)).toBe("insufficient"); // < 3
      expect(overallSufficiency(3)).toBe("limited"); // ≥ 3, < 7
      expect(overallSufficiency(6)).toBe("limited"); // < 7
      expect(overallSufficiency(7)).toBe("sufficient"); // ≥ 7
    });
  });

  describe("canShowTrend", () => {
    it("returns false for insufficient data in either period", () => {
      expect(canShowTrend(2, 1, "sleepEfficiency")).toBe(false);
    });

    it("returns true for limited+ data in both periods", () => {
      expect(canShowTrend(4, 4, "sleepEfficiency")).toBe(true);
    });

    it("returns true for sufficient data", () => {
      expect(canShowTrend(7, 7, "sleepEfficiency")).toBe(true);
    });

    it("returns false if one period has zero records", () => {
      expect(canShowTrend(0, 5, "sleepEfficiency")).toBe(false);
    });
  });
});
