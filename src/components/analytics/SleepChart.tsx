/**
 * Phase F — Sleep Chart Component
 *
 * Multi-metric trend chart using Recharts (already in the project).
 *
 * Features:
 * - Supports multiple metrics (efficiency, sleep time, latency)
 * - Accessible labels via aria-label
 * - Empty state with safe messaging
 * - Missing dates handled (gaps shown, not zero)
 * - Respects reduced-motion preference via isAnimationActive
 * - 7/14/30/90 day ranges
 */

import { useMemo, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SleepRecord } from "@/lib/sleep-records";
import type { MetricKey, WindowKey } from "@/lib/analytics/types";
import { getDateRange, enumerateDates, recordsInRange } from "@/lib/analytics/date-ranges";
import { computeTotalSleepTime, computeWASO, hhmmToMinutes } from "@/lib/analytics/metrics";
import { cn } from "@/lib/utils";

type ChartMetricKey = "sleepEfficiency" | "totalSleepTime" | "sleepOnsetLatency" | "avgBedtime" | "avgWakeTime";

interface SleepChartProps {
  records: SleepRecord[];
  window: WindowKey;
  t: (key: string) => string;
  className?: string;
}

const METRIC_OPTIONS: { key: ChartMetricKey; labelKey: string; color: string }[] = [
  { key: "sleepEfficiency", labelKey: "chart.efficiency", color: "oklch(0.78 0.12 285)" },
  { key: "totalSleepTime", labelKey: "chart.sleepTime", color: "oklch(0.78 0.13 200)" },
  { key: "sleepOnsetLatency", labelKey: "chart.latency", color: "oklch(0.78 0.14 60)" },
  { key: "avgWakeTime", labelKey: "chart.wakeTime", color: "oklch(0.78 0.12 150)" },
];

export function SleepChart({ records, window, t, className }: SleepChartProps) {
  const [metric, setMetric] = useState<ChartMetricKey>("sleepEfficiency");
  const reduceMotion = useReducedMotion();

  const chartData = useMemo(() => {
    const range = getDateRange(window);
    const windowRecords = recordsInRange(records, range.start, range.end) as SleepRecord[];
    const recordMap = new Map(windowRecords.map((r) => [r.date, r]));
    const allDates = enumerateDates(range.start, range.end);

    return allDates.map((date) => {
      const record = recordMap.get(date);
      const dataPoint: Record<string, number | string | null> = {
        date,
        label: date.slice(5), // MM-DD
      };

      if (record) {
        dataPoint.sleepEfficiency = record.sleepEfficiency;
        dataPoint.totalSleepTime = computeTotalSleepTime(record);
        dataPoint.sleepOnsetLatency = record.sleepLatency;
        dataPoint.avgBedtime = hhmmToMinutes(record.bedtime);
        dataPoint.avgWakeTime = hhmmToMinutes(record.wakeUpTime);
      } else {
        dataPoint.sleepEfficiency = null;
        dataPoint.totalSleepTime = null;
        dataPoint.sleepOnsetLatency = null;
        dataPoint.avgBedtime = null;
        dataPoint.avgWakeTime = null;
      }

      return dataPoint;
    });
  }, [records, window]);

  const hasData = chartData.some(
    (d) => d[metric] !== null && d[metric] !== undefined,
  );

  const currentMetricOpt = METRIC_OPTIONS.find((m) => m.key === metric)!;

  // Y-axis domain depends on metric
  const yDomain = () => {
    switch (metric) {
      case "sleepEfficiency":
        return [0, 100];
      case "totalSleepTime":
        return ["auto", "auto"];
      case "sleepOnsetLatency":
        return [0, "auto"];
      case "avgBedtime":
      case "avgWakeTime":
        // Show 6 hours range around the data — but for simplicity use auto
        return ["auto", "auto"];
      default:
        return ["auto", "auto"];
    }
  };

  // Format Y-axis ticks
  const yTickFormatter = (value: number): string => {
    switch (metric) {
      case "sleepEfficiency":
        return `${value}%`;
      case "totalSleepTime":
        return `${Math.round(value / 60)}h`;
      case "sleepOnsetLatency":
        return `${value}m`;
      case "avgBedtime":
      case "avgWakeTime": {
        const hours = Math.floor(value / 60);
        const mins = value % 60;
        return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
      }
      default:
        return String(value);
    }
  };

  // Custom tooltip formatter
  const tooltipFormatter = (value: number | string, _name: string) => {
    if (value === null || value === undefined) return ["—", t(currentMetricOpt.labelKey)];
    const numVal = Number(value);
    switch (metric) {
      case "sleepEfficiency":
        return [`${numVal}%`, t(currentMetricOpt.labelKey)];
      case "totalSleepTime":
        return [`${Math.round(numVal / 60)}h ${numVal % 60}m`, t(currentMetricOpt.labelKey)];
      case "sleepOnsetLatency":
        return [`${numVal} ${t("analytics.unit.minutes")}`, t(currentMetricOpt.labelKey)];
      case "avgBedtime":
      case "avgWakeTime": {
        const hours = Math.floor(numVal / 60);
        const mins = numVal % 60;
        return [`${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`, t(currentMetricOpt.labelKey)];
      }
      default:
        return [String(value), t(currentMetricOpt.labelKey)];
    }
  };

  return (
    <div className={cn("", className)}>
      {/* Metric selector */}
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Chart metric">
        {METRIC_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            role="tab"
            aria-selected={metric === opt.key}
            onClick={() => setMetric(opt.key)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full border transition",
              metric === opt.key
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10",
            )}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      {/* Chart */}
      {hasData ? (
        <div className="h-64 w-full" role="img" aria-label={`${t(currentMetricOpt.labelKey)} trend chart`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="oklch(1 0 0 / 8%)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="oklch(0.78 0.03 270)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={Math.floor(chartData.length / 6)}
              />
              <YAxis
                domain={yDomain() as [number, number]}
                stroke="oklch(0.78 0.03 270)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={yTickFormatter}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.22 0.045 270)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={tooltipFormatter as any}
                labelFormatter={(label) => label}
              />
              <Line
                type="monotone"
                dataKey={metric}
                stroke={currentMetricOpt.color}
                strokeWidth={2.5}
                dot={{ r: 3, fill: currentMetricOpt.color }}
                activeDot={{ r: 5 }}
                connectNulls={false}
                isAnimationActive={!reduceMotion}
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div
          className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5"
          role="status"
        >
          <p className="text-sm text-muted-foreground">{t("chart.noData")}</p>
        </div>
      )}
    </div>
  );
}
