"use client";

/**
 * TimeWheelPicker — Somna time picker entry point.
 *
 * This file is now a thin composition layer over the reusable WheelEngine.
 * The actual scrolling physics, gestures, virtual rendering, accessibility,
 * sound, and haptics are implemented in src/components/time-picker/.
 *
 * Public API remains backward compatible with all existing call sites.
 */

import * as React from "react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  parseTime,
  formatTime,
  formatLocaleTime,
  localePrefers12Hour,
  getLocalePeriodLabels,
} from "@/lib/time-picker-utils";
import { WheelColumn } from "./WheelColumn";

export interface TimeWheelPickerProps {
  value: string;
  onChange: (value: string) => void;
  locale?: string;
  format?: "auto" | "12h" | "24h";
  /** Accessible label for the time field trigger. */
  label?: string;
  /** Optional className applied to the trigger button. */
  className?: string;
  /** Optional placeholder shown on the trigger when no value is set. */
  placeholder?: string;
  /** If true, the trigger is disabled. */
  disabled?: boolean;
}

const VISIBLE_ITEMS = 5; // odd number so a center row exists
const ITEM_HEIGHT = 48;

interface PickerState {
  hourIndex: number;
  minuteIndex: number;
  period: "AM" | "PM";
}

export function TimeWheelPicker({
  value,
  onChange,
  locale = "en-US",
  format = "auto",
  label = "Select time",
  className,
  placeholder = "--:--",
  disabled,
}: TimeWheelPickerProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement>(null);

  const display = useMemo(() => {
    if (!value) return placeholder;
    const is12h = format === "12h" || (format === "auto" && localePrefers12Hour(locale));
    return formatLocaleTime(value, locale, { hour12: is12h });
  }, [value, locale, format, placeholder]);

  const openPicker = useCallback(() => {
    if (disabled) return;
    returnFocusRef.current = triggerRef.current;
    setOpen(true);
  }, [disabled]);

  const closePicker = useCallback(
    (commitValue?: string) => {
      setOpen(false);
      if (commitValue !== undefined && commitValue !== value) {
        onChange(commitValue);
      }
      // Restore focus after the dialog closes so keyboard users stay oriented.
      window.setTimeout(() => {
        returnFocusRef.current?.focus();
      }, 0);
    },
    [onChange, value],
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        onClick={openPicker}
        className={cn(
          "inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 font-display text-3xl text-foreground outline-none transition",
          "hover:bg-white/[0.07] focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <span className={cn(!value && "text-muted-foreground")}>{display}</span>
      </button>
      {open &&
        createPortal(
          <TimeWheelDialog
            value={value}
            locale={locale}
            format={format}
            label={label}
            onCancel={() => closePicker(value)}
            onDone={(next) => closePicker(next)}
          />,
          document.body,
        )}
    </>
  );
}

interface TimeWheelDialogProps {
  value: string;
  locale: string;
  format: "auto" | "12h" | "24h";
  label: string;
  onCancel: () => void;
  onDone: (value: string) => void;
}

function TimeWheelDialog({ value, locale, format, label, onCancel, onDone }: TimeWheelDialogProps) {
  const is12h = format === "12h" || (format === "auto" && localePrefers12Hour(locale));
  const hours = useMemo(() => (is12h ? generate12Hours() : generate24Hours()), [is12h]);
  const minutes = useMemo(() => generateMinutes(), []);
  const periodLabels = useMemo(() => getLocalePeriodLabels(locale), [locale]);

  const parse = useCallback(
    (v: string): PickerState => {
      let { h } = parseTime(v || "00:00");
      const { m } = parseTime(v || "00:00");
      let period: "AM" | "PM" = "AM";
      if (is12h) {
        period = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
      }
      return {
        hourIndex: hours.indexOf(is12h ? h : h),
        minuteIndex: minutes.indexOf(m),
        period,
      };
    },
    [hours, minutes, is12h],
  );

  const [state, setState] = useState<PickerState>(() => parse(value));
  const [, setCommitted] = useState<string>(value);

  // Live mirror of the three columns' currently centered values. Updated on
  // every selection change (including mid-drag), so Done always reads the
  // real current selection instead of a stale snapped value.
  const initial = parse(value);
  const liveRef = useRef<{ hour: string; minute: string; period: "AM" | "PM" }>({
    hour: String(hours[initial.hourIndex] ?? hours[0]),
    minute: String(minutes[initial.minuteIndex] ?? minutes[0]).padStart(2, "0"),
    period: initial.period,
  });

  // Keep internal state in sync if the external value changes while open.
  useEffect(() => {
    setState(parse(value));
    setCommitted(value);
  }, [value, parse]);

  const buildValue = useCallback(
    (s: PickerState): string => {
      let h = hours[s.hourIndex] ?? 0;
      const m = minutes[s.minuteIndex] ?? 0;
      if (is12h) {
        if (s.period === "AM" && h === 12) h = 0;
        else if (s.period === "PM" && h !== 12) h += 12;
      }
      return formatTime(h, m);
    },
    [hours, minutes, is12h],
  );

  const commit = useCallback(
    (next: PickerState) => {
      const v = buildValue(next);
      setCommitted(v);
    },
    [buildValue],
  );

  const handleHourChange = useCallback(
    (hourLabel: string) => {
      const hourIndex = hours.indexOf(Number.parseInt(hourLabel, 10));
      if (hourIndex < 0) return;

      // Synchronize the period wheel when crossing the 12-hour boundary.
      const crossedBoundary =
        (state.hourIndex === hours.length - 1 && hourIndex === 0) ||
        (state.hourIndex === 0 && hourIndex === hours.length - 1);
      const period: "AM" | "PM" = crossedBoundary
        ? state.period === "AM"
          ? "PM"
          : "AM"
        : state.period;
      const next = { ...state, hourIndex, period };
      setState(next);
      liveRef.current.hour = hourLabel;
      liveRef.current.period = period;
      commit(next);
    },
    [state, commit, hours],
  );

  const handleMinuteChange = useCallback(
    (minuteLabel: string) => {
      const minuteIndex = minutes.indexOf(Number.parseInt(minuteLabel, 10));
      if (minuteIndex < 0) return;
      const next = { ...state, minuteIndex };
      setState(next);
      liveRef.current.minute = minuteLabel;
      commit(next);
    },
    [state, commit, minutes],
  );

  const handlePeriodChange = useCallback(
    (periodLabel: string) => {
      const period: "AM" | "PM" = periodLabel === periodLabels.am ? "AM" : "PM";
      const next = { ...state, period };
      setState(next);
      liveRef.current.period = period;
      commit(next);
    },
    [state, commit, periodLabels],
  );

  // Per-column selection mirrors so Done always reads the real current value
  // (updated even mid-drag), independent of snap/commit timing.
  const handleHourSelectionChanged = useCallback((label: string) => {
    liveRef.current.hour = label;
  }, []);

  const handleMinuteSelectionChanged = useCallback((label: string) => {
    liveRef.current.minute = label;
  }, []);

  const handlePeriodSelectionChanged = useCallback((label: string) => {
    liveRef.current.period = label === periodLabels.am ? "AM" : "PM";
  }, [periodLabels]);

  // Read the three columns' current centered values and assemble a standard
  // "HH:MM" (24h) time string, then push it back to the parent state.
  const handleDone = useCallback(() => {
    const rawHour = Number.parseInt(liveRef.current.hour, 10) || 0;
    const minute = Number.parseInt(liveRef.current.minute, 10) || 0;
    const period: "AM" | "PM" =
      liveRef.current.period === "AM" ? "AM" : "PM";

    let h = rawHour;
    if (is12h) {
      if (period === "AM" && h === 12) h = 0;
      else if (period === "PM" && h !== 12) h += 12;
    }
    const next = formatTime(h, minute);
    setCommitted(next);
    onDone(next);
  }, [is12h, onDone]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleDone();
      }
    },
    [onCancel, handleDone],
  );

  const dialogRef = useRef<HTMLDivElement>(null);

  // Click outside closes the dialog without committing.
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (dialogRef.current && !dialogRef.current.contains(target)) {
        onCancel();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [onCancel]);

  // Lock body scroll while the modal is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const hourValues = useMemo(() => hours.map((h) => String(h)) as string[], [hours]);
  const minuteValues = useMemo(
    () => minutes.map((m) => String(m).padStart(2, "0")) as string[],
    [minutes],
  );
  const periodValues = useMemo(
    () => [periodLabels.am, periodLabels.pm] as string[],
    [periodLabels],
  );

  const selectedHour = String(hours[state.hourIndex] ?? hours[0]);
  const selectedMinute = String(minutes[state.minuteIndex] ?? minutes[0]).padStart(2, "0");
  const selectedPeriod = state.period === "AM" ? periodLabels.am : periodLabels.pm;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      role="presentation"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn(
          "w-full max-w-sm overflow-hidden rounded-t-3xl border border-white/10 bg-popover/95 p-5 shadow-2xl backdrop-blur-xl",
          "sm:rounded-3xl",
          "animate-in slide-in-from-bottom-8 fade-in duration-200",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md p-1 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Cancel"
            >
              <span aria-hidden>×</span>
            </button>
          </div>
        </div>

        <div
          className="relative mt-6 flex justify-center gap-3"
          style={{ height: VISIBLE_ITEMS * ITEM_HEIGHT }}
        >
          {/* Center highlight bar */}
          <div
            className="pointer-events-none absolute left-0 right-0 rounded-xl bg-accent/15"
            style={{
              top: `${Math.floor(VISIBLE_ITEMS / 2) * ITEM_HEIGHT}px`,
              height: `${ITEM_HEIGHT}px`,
            }}
          />

          <WheelColumn
            values={hourValues}
            value={selectedHour}
            onChange={handleHourChange}
            onSelectionChanged={handleHourSelectionChanged}
            label="Hours"
            loop
          />
          <WheelColumn
            values={minuteValues}
            value={selectedMinute}
            onChange={handleMinuteChange}
            onSelectionChanged={handleMinuteSelectionChanged}
            label="Minutes"
            loop
          />

          {is12h && (
            <WheelColumn
              values={periodValues}
              value={selectedPeriod}
              onChange={handlePeriodChange}
              onSelectionChanged={handlePeriodSelectionChanged}
              label="Period"
              loop
              style={{ minWidth: "6rem" }}
            />
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" className="flex-1" onClick={handleDone}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

function generate12Hours(): number[] {
  return Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
}

function generate24Hours(): number[] {
  return Array.from({ length: 24 }, (_, i) => i);
}

function generateMinutes(): number[] {
  return Array.from({ length: 60 }, (_, i) => i);
}
