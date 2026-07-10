"use client";

/**
 * WheelAccessibility — keyboard navigation, ARIA roles, and focus management
 * for WheelEngine.
 *
 * Keeps accessibility concerns separate from physics and rendering so the
 * wheel remains fully operable with keyboards, screen readers, VoiceOver,
 * and TalkBack.
 */

import { normalizeIndex } from "./WheelPhysics";

export interface WheelAccessibilityConfig {
  element: HTMLElement;
  label: string;
  itemCount: number;
  loop: boolean;
  /** Current value as a human-readable string. */
  valueText: string;
  /** Current logical index. */
  valueNow: number;
  onChange: (index: number) => void;
  onClose?: () => void;
  onCommit?: () => void;
}

export interface WheelAccessibility {
  setAttributes: (valueNow: number, valueText: string) => void;
  focus: () => void;
  destroy: () => void;
}

export function createWheelAccessibility(config: WheelAccessibilityConfig): WheelAccessibility {
  const { element, label, itemCount, loop, valueText, valueNow, onChange, onClose, onCommit } =
    config;

  function setAttributes(now: number, text: string) {
    element.setAttribute("role", "spinbutton");
    element.setAttribute("aria-label", label);
    element.setAttribute("aria-orientation", "vertical");
    element.setAttribute("aria-valuemin", "0");
    element.setAttribute("aria-valuemax", String(Math.max(0, itemCount - 1)));
    element.setAttribute("aria-valuenow", String(now));
    element.setAttribute("aria-valuetext", text);
    if (!element.getAttribute("tabindex")) {
      element.setAttribute("tabindex", "0");
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
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
        onChange(loop ? valueNow : 0);
        return;
      case "End":
        e.preventDefault();
        onChange(loop ? valueNow : Math.max(0, itemCount - 1));
        return;
      case "Escape":
        e.preventDefault();
        onClose?.();
        return;
      case "Enter":
        e.preventDefault();
        onCommit?.();
        return;
      default:
        return;
    }

    e.preventDefault();
    const next = loop
      ? normalizeIndex(valueNow + delta, itemCount)
      : clamp(valueNow + delta, 0, Math.max(0, itemCount - 1));
    onChange(next);
  }

  setAttributes(valueNow, valueText);
  element.addEventListener("keydown", handleKeyDown);

  return {
    setAttributes,
    focus() {
      element.focus({ preventScroll: true });
    },
    destroy() {
      element.removeEventListener("keydown", handleKeyDown);
    },
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
