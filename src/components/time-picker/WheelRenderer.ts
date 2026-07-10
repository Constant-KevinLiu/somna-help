"use client";

/**
 * WheelRenderer — GPU-accelerated DOM renderer for WheelEngine.
 *
 * Translates virtual wheel state into translate3d transforms applied directly
 * to DOM elements. No React state is updated during drag or animation frames.
 */

import type { VirtualWheelState } from "./VirtualWheel";
import { updateWheelDebug } from "./WheelDebug";

export interface WheelRendererConfig {
  container: HTMLElement;
  itemHeight: number;
  slotCount: number;
  /**
   * Optional callback invoked when the renderer creates a slot element.
   * Use this to apply shared class names or attributes.
   */
  createSlot?: () => HTMLElement;
}

export interface WheelRenderer {
  render: (state: VirtualWheelState, offset: number) => void;
  destroy: () => void;
}

function isValidTransformValue(value: number): boolean {
  return Number.isFinite(value);
}

export function createWheelRenderer(config: WheelRendererConfig): WheelRenderer {
  const { container, itemHeight, slotCount, createSlot } = config;
  const slots: HTMLElement[] = [];

  // Build the initial pool of reused DOM nodes.
  for (let i = 0; i < slotCount; i++) {
    const el = createSlot ? createSlot() : document.createElement("div");
    el.style.position = "absolute";
    el.style.left = "0";
    el.style.right = "0";
    el.style.height = `${itemHeight}px`;
    el.style.willChange = "transform";
    el.style.transform = "translate3d(0, 0, 0)";
    el.style.opacity = "1";
    el.style.visibility = "visible";
    container.appendChild(el);
    slots.push(el);
  }

  function render(state: VirtualWheelState, offset: number) {
    if (!isValidTransformValue(offset)) {
      if (import.meta.env?.DEV)
        console.warn("[WheelRenderer] ignoring invalid container offset", offset);
      return;
    }

    // Fix: keep the container at the origin of the clipping parent. Previously
    // the container itself was translated by `offset`, which moved the whole
    // track outside the `overflow-hidden` parent and caused the visible items
    // to be clipped. Instead, bake `offset` into each slot's local transform.
    // The centering offset (half the visible window) is added so the selected
    // item lines up with the highlight bar.
    const halfVisible = Math.max(0, Math.floor((state.slotCount - 2) / 2));
    const centerOffset = halfVisible * itemHeight;
    container.style.transform = "translate3d(0, 0, 0)";

    const { items } = state;

    // Debug telemetry: surface renderer health without forcing React re-renders.
    updateWheelDebug({
      visibleItems: items.length,
      virtualStart: items[0]?.index ?? 0,
      translateY: offset,
    });

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const item = items[i];
      if (!slot || !item) continue;

      if (!isValidTransformValue(item.y)) {
        if (import.meta.env?.DEV) console.warn("[WheelRenderer] ignoring invalid item Y", item.y);
        continue;
      }

      // Position each slot relative to the container origin. Adding `offset`
      // scrolls the virtual window; adding `centerOffset` centers the active
      // value in the visible area.
      const localY = item.y + offset + centerOffset;
      slot.style.transform = `translate3d(0, ${localY}px, 0)`;
      slot.textContent = item.value;

      // Accessibility: mark the centered slot as selected.
      if (item.selected) {
        slot.setAttribute("aria-selected", "true");
        slot.classList.add("wheel-item-selected");
        slot.classList.remove("wheel-item-inactive");
      } else {
        slot.setAttribute("aria-selected", "false");
        slot.classList.remove("wheel-item-selected");
        slot.classList.add("wheel-item-inactive");
      }
    }
  }

  function destroy() {
    for (const slot of slots) {
      slot.remove();
    }
    slots.length = 0;
  }

  return { render, destroy };
}
