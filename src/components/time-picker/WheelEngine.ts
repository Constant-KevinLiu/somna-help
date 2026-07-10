"use client";

/**
 * WheelEngine — reusable low-level scrolling engine for Somna pickers.
 *
 * Composes Gesture → Physics → Animation → Virtual Renderer → Accessibility.
 *
 * Design constraints:
 *   - React state is NOT updated during drag or animation frames.
 *   - All motion is GPU-accelerated via translate3d/will-change.
 *   - Infinite looping wheels are first-class.
 *   - Pointer capture prevents page scroll while interacting.
 */

import { createWheelAnimation } from "./WheelAnimation";
import type { GestureEvent } from "./WheelGesture";
import { createWheelGesture } from "./WheelGesture";
import { createWheelHaptics } from "./WheelHaptics";
import {
  clamp,
  clampVelocity,
  computeMomentumDestination,
  computeSnapOffset,
  DEFAULT_PHYSICS,
  indexToOffset,
  normalizeIndex,
  offsetToIndex,
  type WheelPhysicsConfig,
} from "./WheelPhysics";
import { createWheelRenderer } from "./WheelRenderer";
import { createWheelSound } from "./WheelSound";
import { createVirtualWheel, type VirtualWheelState } from "./VirtualWheel";
import { createWheelAccessibility } from "./WheelAccessibility";
import { updateWheelDebug, type WheelDebugState } from "./WheelDebug";

export interface WheelEngineConfig {
  container: HTMLElement;
  values: readonly string[];
  value: string;
  label: string;
  loop?: boolean;
  itemHeight?: number;
  visibleCount?: number;
  physics?: Partial<WheelPhysicsConfig>;
  onChange?: (value: string, index: number) => void;
  onSelectionChanged?: (value: string, index: number) => void;
  onClose?: () => void;
  onCommit?: () => void;
}

export interface WheelEngine {
  /** Move to a specific value (used for controlled updates / keyboard). */
  setValue: (value: string) => void;
  /** Read the current logical index. */
  getIndex: () => number;
  /** Focus the wheel for keyboard navigation. */
  focus: () => void;
  /** Tear down all event listeners and animations. */
  destroy: () => void;
}

export function createWheelEngine(config: WheelEngineConfig): WheelEngine {
  const {
    container,
    values,
    value,
    label,
    loop = false,
    itemHeight = 48,
    visibleCount = 5,
    physics: physicsOverrides,
    onChange,
    onSelectionChanged,
    onClose,
    onCommit,
  } = config;

  const itemCount = values.length;
  const physics: WheelPhysicsConfig = {
    ...DEFAULT_PHYSICS,
    ...physicsOverrides,
    itemHeight,
    itemCount,
    loop,
  };

  // Internal mutable state (never exposed to React directly).
  let currentIndex = Math.max(0, values.indexOf(value));
  let offset = indexToOffset(currentIndex, itemHeight);
  let isDragging = false;
  let reducedMotion = false;
  let physicsState: WheelDebugState["physics"] = "idle";
  let pointerCaptured = false;
  let renderCount = 0;
  let gestureState: WheelDebugState["gesture"] = "idle";
  let lastVelocity = 0;
  let wheelSnapTimeoutId: number | null = null;

  const virtualWheel = createVirtualWheel({
    itemHeight,
    visibleCount,
    itemCount,
    loop,
    values,
  });

  const renderer = createWheelRenderer({
    container,
    itemHeight,
    slotCount: virtualWheel.slotCount,
    createSlot: () => {
      const el = document.createElement("div");
      el.className = "flex h-12 items-center justify-center text-2xl font-medium select-none";
      return el;
    },
  });

  const animation = createWheelAnimation();
  const sound = createWheelSound();
  const haptics = createWheelHaptics();

  let lastState: VirtualWheelState | null = null;
  let lastNotifiedIndex = currentIndex;
  let lastSoundIndex = currentIndex;

  function detectReducedMotion(): boolean {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  reducedMotion = detectReducedMotion();

  function getValueText(index: number): string {
    return values[normalizeIndex(index, itemCount)] ?? "";
  }

  function updateVisuals(immediate = false) {
    const state = virtualWheel.update(offset);

    renderCount += 1;
    updateWheelDebug({
      selectedIndex: state.normalizedCenterIndex,
      renderCount,
      physics: physicsState,
      gesture: gestureState,
      pointerCaptured,
      velocity: lastVelocity,
      momentum: physicsState === "momentum",
      snapping: physicsState === "snapping",
    });

    // Notify selection changes during drag/momentum.
    if (state.normalizedCenterIndex !== lastNotifiedIndex) {
      lastNotifiedIndex = state.normalizedCenterIndex;
      onSelectionChanged?.(getValueText(lastNotifiedIndex), lastNotifiedIndex);
      haptics.trigger();
    }

    // Play sound only when selection changes.
    if (state.normalizedCenterIndex !== lastSoundIndex) {
      lastSoundIndex = state.normalizedCenterIndex;
      sound.play(lastSoundIndex);
    }

    if (!virtualStateEqual(state, lastState)) {
      lastState = state;
      renderer.render(state, offset);
    } else if (immediate) {
      renderer.render(state, offset);
    }

    accessibility.setAttributes(
      state.normalizedCenterIndex,
      getValueText(state.normalizedCenterIndex),
    );
  }

  function snapTo(index: number, animated = true) {
    const targetIndex = loop ? normalizeIndex(index, itemCount) : clamp(index, 0, itemCount - 1);
    const targetOffset = computeSnapOffset(targetIndex, { itemHeight, itemCount, loop });

    if (!animated || reducedMotion) {
      offset = targetOffset;
      currentIndex = targetIndex;
      physicsState = "ready";
      updateVisuals(true);
      emitChangeIfNeeded();
      return;
    }

    physicsState = "snapping";
    animation.animate({
      startOffset: offset,
      targetOffset,
      startTime: performance.now(),
      duration: physics.snapDuration,
      onFrame(nextOffset) {
        offset = nextOffset;
        updateVisuals();
      },
      onComplete() {
        offset = targetOffset;
        currentIndex = targetIndex;
        physicsState = "ready";
        gestureState = "idle";
        updateVisuals(true);
        emitChangeIfNeeded();
      },
    });
  }

  function emitChangeIfNeeded() {
    const centeredIndex = offsetToIndex(offset, itemHeight);
    const normalized = loop
      ? normalizeIndex(centeredIndex, itemCount)
      : clamp(centeredIndex, 0, itemCount - 1);
    if (normalized !== currentIndex) {
      currentIndex = normalized;
      onChange?.(values[currentIndex] ?? "", currentIndex);
    }
  }

  // Gesture handlers.
  function onStart() {
    animation.cancel();
    isDragging = true;
    gestureState = "start";
    physicsState = "dragging";
    updateWheelDebug({ gesture: gestureState, physics: physicsState });
  }

  function onMove(_event: GestureEvent, deltaY: number) {
    gestureState = "active";
    physicsState = "dragging";
    const nextOffset = offset + deltaY;
    if (loop) {
      // Infinite wheels have no bounds.
      offset = nextOffset;
    } else {
      const min = indexToOffset(itemCount - 1, itemHeight);
      const max = 0;
      offset = clamp(nextOffset, min, max);
    }
    lastVelocity = 0;
    updateWheelDebug({ velocity: 0, momentum: false, snapping: false });
    updateVisuals();
  }

  function onEnd(_event: GestureEvent, velocity: number) {
    isDragging = false;
    gestureState = "end";
    const clamped = clampVelocity(velocity, physics.maxVelocity);
    lastVelocity = clamped;
    const destination = computeMomentumDestination(offset, clamped, physics);
    const hasMomentum = Math.abs(clamped) >= physics.minVelocity;
    physicsState = hasMomentum ? "momentum" : "snapping";

    if (reducedMotion) {
      snapTo(destination.targetIndex, false);
      return;
    }

    animation.animate({
      startOffset: offset,
      targetOffset: destination.targetOffset,
      startTime: performance.now(),
      duration: destination.duration,
      onFrame(nextOffset) {
        offset = nextOffset;
        updateVisuals();
      },
      onComplete() {
        offset = destination.targetOffset;
        currentIndex = destination.targetIndex;
        physicsState = "ready";
        gestureState = "idle";
        updateVisuals(true);
        emitChangeIfNeeded();
      },
    });
  }

  function onCancel() {
    isDragging = false;
    gestureState = "idle";
    physicsState = "snapping";
    snapTo(currentIndex, !reducedMotion);
  }

  // Wheel (mousewheel / trackpad) handler: apply the delta directly to the
  // offset and then snap to the nearest item. Each column has its own engine
  // instance, so gestures stay isolated per wheel.
  function onWheel(_event: GestureEvent, deltaY: number) {
    if (isDragging) return;
    animation.cancel();
    gestureState = "active";
    physicsState = "dragging";

    const nextOffset = offset - deltaY;
    if (loop) {
      offset = nextOffset;
    } else {
      const min = indexToOffset(itemCount - 1, itemHeight);
      const max = 0;
      offset = clamp(nextOffset, min, max);
    }

    lastVelocity = 0;
    updateWheelDebug({ velocity: 0, momentum: false, snapping: false });
    updateVisuals();

    // Debounce snap so fast consecutive wheel events feel continuous.
    if (wheelSnapTimeoutId !== null) {
      window.clearTimeout(wheelSnapTimeoutId);
    }
    wheelSnapTimeoutId = window.setTimeout(() => {
      wheelSnapTimeoutId = null;
      gestureState = "end";
      physicsState = "snapping";
      snapTo(offsetToIndex(offset, itemHeight), !reducedMotion);
    }, 80);
  }

  const gesture = createWheelGesture({
    element: container,
    handlers: { onStart, onMove, onEnd, onCancel, onWheel },
    onPointerCaptureChanged: (captured) => {
      pointerCaptured = captured;
      updateWheelDebug({ pointerCaptured });
    },
  });

  const accessibility = createWheelAccessibility({
    element: container,
    label,
    itemCount,
    loop,
    valueText: getValueText(currentIndex),
    valueNow: currentIndex,
    onChange: (index) => snapTo(index, !reducedMotion),
    onClose,
    onCommit,
  });

  function setValue(nextValue: string) {
    const nextIndex = values.indexOf(nextValue);
    if (nextIndex < 0) return;
    currentIndex = nextIndex;
    snapTo(nextIndex, !reducedMotion);
  }

  // Initial render: schedule after the browser has measured the container so
  // the first frame is applied with a valid layout. A double rAF ensures we
  // never start physics before the initial paint.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      updateVisuals(true);
      physicsState = "ready";
      updateWheelDebug({ physics: physicsState });
    });
  });

  return {
    setValue,
    getIndex: () => currentIndex,
    focus: () => accessibility.focus(),
    destroy() {
      if (wheelSnapTimeoutId !== null) {
        window.clearTimeout(wheelSnapTimeoutId);
        wheelSnapTimeoutId = null;
      }
      animation.cancel();
      gesture();
      renderer.destroy();
      accessibility.destroy();
    },
  };
}

function virtualStateEqual(a: VirtualWheelState, b: VirtualWheelState | null): boolean {
  if (!b) return false;
  if (a.items.length !== b.items.length) return false;
  return a.items.every(
    (item, i) =>
      item.value === b.items[i]?.value &&
      item.y === b.items[i]?.y &&
      item.selected === b.items[i]?.selected,
  );
}
