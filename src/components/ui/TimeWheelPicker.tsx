"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  parseTime,
  formatTime,
  clamp,
  snapIndex,
  formatLocaleTime,
  localePrefers12Hour,
  getLocalePeriodLabels,
} from "@/lib/time-picker-utils";

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

const ITEM_HEIGHT = 48; // px; must match Tailwind h-12 on each item
const VISIBLE_ITEMS = 5; // odd number so a center row exists
const SNAP_BUFFER_MS = 180;
const WHEEL_DEBOUNCE_MS = 80;

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
  const [committed, setCommitted] = useState<string>(value);

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
    (hourIndex: number) => {
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
      commit(next);
    },
    [state, commit, hours.length],
  );

  const handleMinuteChange = useCallback(
    (minuteIndex: number) => {
      const next = { ...state, minuteIndex };
      setState(next);
      commit(next);
    },
    [state, commit],
  );

  const handlePeriodChange = useCallback(
    (periodLabel: string) => {
      const period: "AM" | "PM" = periodLabel === periodLabels.am ? "AM" : "PM";
      const next = { ...state, period };
      setState(next);
      commit(next);
    },
    [state, commit, periodLabels],
  );

  const handleSelectionChanged = useCallback(() => {
    // Hook for future haptic feedback; vibration is intentionally not
    // hardcoded inside the reusable wheel component.
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        /* ignore unsupported vibrators */
      }
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        onDone(committed);
      }
    },
    [onCancel, onDone, committed],
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
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md p-1 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Cancel"
          >
            <span aria-hidden>×</span>
          </button>
        </div>

        <div className="relative mt-6 flex h-[240px] justify-center gap-3">
          {/* Center highlight bar */}
          <div
            className="pointer-events-none absolute left-0 right-0 rounded-xl bg-accent/15"
            style={{
              top: `${Math.floor(VISIBLE_ITEMS / 2) * ITEM_HEIGHT}px`,
              height: `${ITEM_HEIGHT}px`,
            }}
          />

          <WheelColumn
            values={hours.map(String)}
            value={String(hours[state.hourIndex])}
            onChange={(hour) => handleHourChange(hours.indexOf(Number.parseInt(hour, 10)))}
            onSelectionChanged={handleSelectionChanged}
            label="Hours"
          />
          <WheelColumn
            values={minutes.map((m) => String(m).padStart(2, "0"))}
            value={String(minutes[state.minuteIndex]).padStart(2, "0")}
            onChange={(minute) => handleMinuteChange(minutes.indexOf(Number.parseInt(minute, 10)))}
            onSelectionChanged={handleSelectionChanged}
            label="Minutes"
          />

          {is12h && (
            <WheelColumn
              values={[periodLabels.am, periodLabels.pm]}
              value={state.period === "AM" ? periodLabels.am : periodLabels.pm}
              onChange={handlePeriodChange}
              onSelectionChanged={handleSelectionChanged}
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
          <Button type="button" className="flex-1" onClick={() => onDone(committed)}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

interface WheelColumnProps<T extends string> {
  values: readonly T[];
  value: T;
  onChange: (value: T) => void;
  onSelectionChanged?: (value: T, index: number) => void;
  label: string;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const LOOP_REPEAT = 7;

function WheelColumn<T extends string>({
  values,
  value,
  onChange,
  onSelectionChanged,
  label,
  loop = false,
  className,
  style,
}: WheelColumnProps<T>) {
  const baseLength = values.length;
  const repeat = loop ? LOOP_REPEAT : 1;
  const displayValues = useMemo(
    () => Array.from({ length: baseLength * repeat }, (_, i) => values[i % baseLength] as T),
    [baseLength, repeat, values],
  );
  const centerCycle = Math.floor(repeat / 2);

  const selectedBaseIndex = values.indexOf(value);
  const baseIndex = selectedBaseIndex >= 0 ? selectedBaseIndex : 0;
  const safeIndex = centerCycle * baseLength + baseIndex;

  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(-safeIndex * ITEM_HEIGHT);
  const targetIndexRef = useRef(safeIndex);
  const rafRef = useRef<number | null>(null);
  const lastSnapRef = useRef<number>(Date.now());
  const soundEnabledRef = useRef(getSoundEnabled());
  const lastSoundIndexRef = useRef<number>(safeIndex);
  const lastNotifiedIndexRef = useRef<number>(baseIndex);
  const reducedMotionRef = useRef(prefersReducedMotion());

  // Track the index that is currently visually centered to provide feedback.
  const visualIndexRef = useRef(safeIndex);

  const toDisplayIndex = useCallback(
    (index: number) => {
      const len = displayValues.length;
      const normalized = ((index % len) + len) % len;
      const base = normalized % baseLength;
      return centerCycle * baseLength + base;
    },
    [baseLength, centerCycle, displayValues.length],
  );

  const notifySelectionChanged = useCallback(
    (displayIndex: number) => {
      const idx = displayIndex % baseLength;
      if (idx !== lastNotifiedIndexRef.current) {
        lastNotifiedIndexRef.current = idx;
        onSelectionChanged?.(displayValues[displayIndex] as T, idx);
      }
    },
    [baseLength, displayValues, onSelectionChanged],
  );

  const playTick = useCallback((displayIndex: number) => {
    if (displayIndex === lastSoundIndexRef.current) return;
    lastSoundIndexRef.current = displayIndex;
    if (soundEnabledRef.current && typeof window !== "undefined") {
      try {
        playClick();
      } catch {
        /* ignore autoplay restrictions */
      }
    }
  }, []);

  // Keep the visual offset in sync with controlled value changes.
  useEffect(() => {
    targetIndexRef.current = safeIndex;
    setOffset(-safeIndex * ITEM_HEIGHT);
    visualIndexRef.current = safeIndex;
    lastSoundIndexRef.current = safeIndex;
    lastNotifiedIndexRef.current = baseIndex;
  }, [safeIndex, baseIndex]);

  const cancelAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const commitIndex = useCallback(
    (displayIndex: number) => {
      const nextBaseIndex = displayIndex % baseLength;
      if (nextBaseIndex !== baseIndex) {
        onChange(values[nextBaseIndex] as T);
      }
    },
    [baseIndex, baseLength, onChange, values],
  );

  const snapTo = useCallback(
    (index: number, { animated = true }: { animated?: boolean } = {}) => {
      const target = toDisplayIndex(index);
      targetIndexRef.current = target;
      lastSnapRef.current = Date.now();

      if (!animated || reducedMotionRef.current) {
        setOffset(-target * ITEM_HEIGHT);
        visualIndexRef.current = target;
        playTick(target);
        notifySelectionChanged(target);
        commitIndex(target);
        return;
      }

      cancelAnimation();
      const startOffset = offset;
      const endOffset = -target * ITEM_HEIGHT;
      const startTime = performance.now();
      const duration = SNAP_BUFFER_MS;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = startOffset + (endOffset - startOffset) * eased;
        setOffset(current);

        const center = snapIndex(-current / ITEM_HEIGHT);
        if (center !== visualIndexRef.current) {
          visualIndexRef.current = center;
          playTick(center);
          notifySelectionChanged(center);
        }

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          rafRef.current = null;
          setOffset(endOffset);
          visualIndexRef.current = target;
          playTick(target);
          notifySelectionChanged(target);
          commitIndex(target);
        }
      };

      rafRef.current = requestAnimationFrame(step);
    },
    [cancelAnimation, commitIndex, notifySelectionChanged, offset, playTick, toDisplayIndex],
  );

  // Pointer drag handling.
  const pointerState = useRef<{ startY: number; startOffset: number; dragging: boolean } | null>(
    null,
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      cancelAnimation();
      el.setPointerCapture(e.pointerId);
      pointerState.current = {
        startY: e.clientY,
        startOffset: offset,
        dragging: false,
      };
    },
    [cancelAnimation, offset],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerState.current) return;
      const delta = e.clientY - pointerState.current.startY;
      if (Math.abs(delta) > 4) pointerState.current.dragging = true;
      const next = pointerState.current.startOffset + delta;
      const min = -(displayValues.length - 1) * ITEM_HEIGHT;
      const max = 0;
      const clamped = clamp(next, min, max);
      setOffset(clamped);

      const center = snapIndex(-clamped / ITEM_HEIGHT);
      if (center !== visualIndexRef.current) {
        visualIndexRef.current = center;
        playTick(center);
        notifySelectionChanged(center);
      }
    },
    [displayValues.length, notifySelectionChanged, playTick],
  );

  const onPointerUp = useCallback(() => {
    if (!pointerState.current) return;
    const wasDragging = pointerState.current.dragging;
    pointerState.current = null;
    if (wasDragging) {
      const idx = snapIndex(-offset / ITEM_HEIGHT);
      snapTo(idx);
    }
  }, [offset, snapTo]);

  // Wheel / trackpad handling with momentum-like smoothing.
  const wheelTimeoutRef = useRef<number | null>(null);
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      cancelAnimation();

      const direction = e.deltaY > 0 ? 1 : -1;
      const next = snapIndex(-offset / ITEM_HEIGHT) + direction;
      const target = toDisplayIndex(next);
      setOffset(-target * ITEM_HEIGHT);
      playTick(target);
      notifySelectionChanged(target);

      if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = window.setTimeout(() => {
        snapTo(target);
      }, WHEEL_DEBOUNCE_MS);
    },
    [cancelAnimation, notifySelectionChanged, offset, playTick, snapTo, toDisplayIndex],
  );

  // Keyboard handling for this wheel.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let delta = 0;
      switch (e.key) {
        case "ArrowUp":
          delta = -1;
          break;
        case "ArrowDown":
          delta = 1;
          break;
        case "PageUp":
          delta = -5;
          break;
        case "PageDown":
          delta = 5;
          break;
        case "Home":
          e.preventDefault();
          snapTo(centerCycle * baseLength);
          return;
        case "End":
          e.preventDefault();
          snapTo((centerCycle + 1) * baseLength - 1);
          return;
        default:
          return;
      }
      e.preventDefault();
      snapTo(safeIndex + delta);
    },
    [baseLength, centerCycle, safeIndex, snapTo],
  );

  const valueNow = baseIndex;
  const valueMin = 0;
  const valueMax = baseLength - 1;

  return (
    <div
      className={cn("relative h-full overflow-hidden", className)}
      style={{ minWidth: "5.5rem", ...style }}
      role="spinbutton"
      aria-label={label}
      aria-orientation="vertical"
      aria-valuemin={valueMin}
      aria-valuemax={valueMax}
      aria-valuenow={valueNow}
      aria-valuetext={displayValues[safeIndex]}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      {/* Top fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-popover to-transparent" />
      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-popover to-transparent" />

      <div
        ref={containerRef}
        className="absolute inset-x-0 will-change-transform"
        style={{
          transform: `translateY(${Math.floor(VISIBLE_ITEMS / 2) * ITEM_HEIGHT + offset}px)`,
        }}
      >
        {displayValues.map((itemValue, idx) => {
          const isSelected = idx === safeIndex;
          return (
            <div
              key={`${itemValue}-${idx}`}
              className={cn(
                "flex h-12 items-center justify-center text-2xl font-medium transition-colors duration-150 select-none",
                isSelected ? "text-accent" : "text-muted-foreground/60",
              )}
            >
              {itemValue}
            </div>
          );
        })}
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

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const CLICK_URL = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU";

let clickAudio: HTMLAudioElement | null = null;

function getSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = window.localStorage.getItem("somna-time-picker-sound");
    return stored === null ? true : stored === "true";
  } catch {
    return true;
  }
}

function playClick() {
  if (!clickAudio) {
    clickAudio = new Audio(CLICK_URL);
    clickAudio.volume = 0.15;
  }
  clickAudio.currentTime = 0;
  void clickAudio.play().catch(() => {
    /* ignore autoplay restrictions */
  });
}
