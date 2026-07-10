"use client";

/**
 * WheelColumn — React composition layer around WheelEngine.
 *
 * This component is intentionally thin: it creates a container ref, mounts a
 * WheelEngine instance, and forwards controlled value changes. All heavy
 * lifting (gestures, physics, virtual rendering) lives in the engine.
 */

import * as React from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { createWheelEngine, type WheelEngine } from "./WheelEngine";

export interface WheelColumnProps<T extends string> {
  values: readonly T[];
  value: T;
  onChange: (value: T) => void;
  onSelectionChanged?: (value: T, index: number) => void;
  label: string;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;

export function WheelColumn<T extends string>({
  values,
  value,
  onChange,
  onSelectionChanged,
  label,
  loop = false,
  className,
  style,
}: WheelColumnProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<WheelEngine | null>(null);

  // Initialize engine once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    engineRef.current = createWheelEngine({
      container,
      values,
      value,
      label,
      loop,
      itemHeight: ITEM_HEIGHT,
      visibleCount: VISIBLE_ITEMS,
      physics: {
        friction: 0.92,
        minVelocity: 0.15,
        maxVelocity: 2.5,
        snapDuration: 160,
      },
      onChange: (nextValue) => onChange(nextValue as T),
      onSelectionChanged: (nextValue, index) => onSelectionChanged?.(nextValue as T, index),
    });

    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, [values, value, label, loop, onChange, onSelectionChanged]);

  // Sync controlled value changes.

  useEffect(() => {
    if (engineRef.current && values[engineRef.current.getIndex()] !== value) {
      engineRef.current.setValue(value);
    }
  }, [value, values]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-[240px] overflow-hidden", className)}
      style={{ minWidth: "5.5rem", ...style }}
    >
      {/* Top fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-popover to-transparent" />
      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-popover to-transparent" />
    </div>
  );
}
