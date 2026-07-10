/**
 * WheelGesture — pointer-driven gesture handling for WheelEngine.
 *
 * Uses Pointer Events as the primary interaction model and automatically
 * falls back to Touch Events when Pointer Events are unavailable.
 *
 * Responsibilities:
 *   - Capture pointer on press and release on up/cancel.
 *   - Track drag deltas and compute instantaneous velocity.
 *   - Prevent page/parent scrolling while interacting with a wheel.
 *   - Emit lifecycle events: start, move, end, cancel.
 */

import { clampVelocity, smoothVelocity } from "./WheelPhysics";

export interface GestureEvent {
  clientX: number;
  clientY: number;
  pointerId: number;
  timeStamp: number;
}

export interface GestureHandlers {
  onStart?: (event: GestureEvent) => void;
  onMove?: (event: GestureEvent, deltaY: number) => void;
  onEnd?: (event: GestureEvent, velocity: number) => void;
  onCancel?: (event: GestureEvent) => void;
  /** Optional handler for physical wheel / trackpad scroll deltas. */
  onWheel?: (event: GestureEvent, deltaY: number) => void;
}

export interface WheelGestureConfig {
  element: HTMLElement;
  handlers: GestureHandlers;
  /** Pixels of movement before the gesture is considered a drag. */
  dragThreshold?: number;
  /** Maximum tracked velocity in px/ms. */
  maxVelocity?: number;
  /** Alpha for velocity smoothing EMA. */
  velocitySmoothing?: number;
  /** Optional callback to report pointer capture state for debugging. */
  onPointerCaptureChanged?: (captured: boolean) => void;
}

interface PointSample {
  y: number;
  t: number;
}

export function createWheelGesture(config: WheelGestureConfig): () => void {
  const {
    element,
    handlers,
    dragThreshold = 4,
    maxVelocity = 2.5,
    velocitySmoothing = 0.7,
    onPointerCaptureChanged,
  } = config;

  let pointerId: number | null = null;
  let startY = 0;
  let startX = 0;
  let dragging = false;
  let samples: PointSample[] = [];
  let velocity = 0;
  let rafId: number | null = null;
  let pointerCaptured = false;
  let removed = false;

  function setPointerCaptured(captured: boolean) {
    if (pointerCaptured === captured) return;
    pointerCaptured = captured;
    onPointerCaptureChanged?.(captured);
  }

  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const supportsPointer = typeof window !== "undefined" && "PointerEvent" in window;

  function toGestureEvent(e: PointerEvent | Touch): GestureEvent {
    return {
      clientX: e.clientX,
      clientY: e.clientY,
      pointerId: "pointerId" in e ? e.pointerId : 0,
      timeStamp: performance.now(),
    };
  }

  function releasePointer() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    pointerId = null;
    dragging = false;
    setPointerCaptured(false);
  }

  function computeVelocity(): number {
    if (samples.length < 2) return 0;
    // Use the last 4 samples to estimate release velocity.
    const recent = samples.slice(-4);
    const first = recent[0];
    const last = recent[recent.length - 1];
    const dt = last.t - first.t;
    if (dt <= 0) return 0;
    return clampVelocity((last.y - first.y) / dt, maxVelocity);
  }

  function addSample(y: number) {
    const now = performance.now();
    samples.push({ y, t: now });
    // Keep a small rolling window to avoid stale samples.
    while (samples.length > 6) samples.shift();
  }

  function handleStart(e: PointerEvent | TouchEvent) {
    if (removed) return;

    const native = "touches" in e ? e.touches[0] : e;
    if (!native) return;

    // Mice must scroll exclusively through the physical wheel / trackpad.
    // Reject mouse pointerdown so hovering or moving the cursor over the
    // container can never start a drag or otherwise shift the wheel offset.
    // Touch / pen pointers keep their drag-driven (inertia + snap) scrolling.
    if ("pointerType" in native && native.pointerType === "mouse") return;

    e.preventDefault();
    pointerId = "pointerId" in native ? native.pointerId : 0;
    startY = native.clientY;
    startX = native.clientX;
    dragging = false;
    samples = [{ y: startY, t: performance.now() }];
    velocity = 0;

    // Capture pointer so the element keeps receiving events even if the finger
    // leaves the wheel bounds.
    if (supportsPointer && "pointerId" in native && element.setPointerCapture) {
      try {
        element.setPointerCapture(native.pointerId);
        setPointerCaptured(true);
      } catch {
        /* ignore */
      }
    }

    handlers.onStart?.(toGestureEvent(native));
  }

  function handleMove(e: PointerEvent | TouchEvent) {
    if (removed) return;

    const native = "touches" in e ? e.touches[0] : e;
    if (!native) return;

    // Hard filter: ignore every mouse-driven move (hover, cursor enter/leave,
    // button-less movement). Only the native wheel event scrolls for mice, and
    // only touch / pen pointers are allowed to drive the wheel via dragging.
    if ("pointerType" in native && native.pointerType === "mouse") return;

    // Ignore moves from other pointers when one is already active.
    const pid = "pointerId" in native ? native.pointerId : 0;
    if (pointerId !== null && pid !== pointerId) return;

    const y = native.clientY;
    const deltaY = y - startY;

    if (!dragging) {
      if (Math.abs(deltaY) <= dragThreshold) return;
      dragging = true;
      // Once we commit to a vertical drag, suppress scrolling.
      element.style.touchAction = "none";
      element.style.overscrollBehavior = "none";
    }

    e.preventDefault();
    addSample(y);
    const raw = computeVelocity();
    velocity = smoothVelocity(velocity, raw, velocitySmoothing);
    handlers.onMove?.(toGestureEvent(native), deltaY);
    startY = y;
  }

  function handleEnd(e: PointerEvent | TouchEvent) {
    if (removed) return;

    const native = "changedTouches" in e ? e.changedTouches[0] : e;
    if (!native) return;

    const pid = "pointerId" in native ? native.pointerId : 0;
    if (pointerId !== null && pid !== pointerId) return;

    if (pointerCaptured && "pointerId" in native && element.releasePointerCapture) {
      try {
        element.releasePointerCapture(native.pointerId);
      } catch {
        /* ignore */
      }
    }

    element.style.touchAction = "";
    element.style.overscrollBehavior = "";

    const finalVelocity = dragging ? computeVelocity() : 0;
    handlers.onEnd?.(toGestureEvent(native), finalVelocity);
    releasePointer();
  }

  function handleCancel(e: PointerEvent | TouchEvent) {
    if (removed) return;

    const native = "changedTouches" in e ? e.changedTouches[0] : e;
    if (!native) return;

    const pid = "pointerId" in native ? native.pointerId : 0;
    if (pointerId !== null && pid !== pointerId) return;

    if (pointerCaptured && "pointerId" in native && element.releasePointerCapture) {
      try {
        element.releasePointerCapture(native.pointerId);
      } catch {
        /* ignore */
      }
    }

    element.style.touchAction = "";
    element.style.overscrollBehavior = "";

    handlers.onCancel?.(toGestureEvent(native));
    releasePointer();
  }

  // Pointer Events path.
  function onPointerDown(e: PointerEvent) {
    // Only primary pointers (mouse left, single touch).
    if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
    handleStart(e);
  }

  function onPointerMove(e: PointerEvent) {
    handleMove(e);
  }

  function onPointerUp(e: PointerEvent) {
    handleEnd(e);
  }

  function onPointerCancel(e: PointerEvent) {
    handleCancel(e);
  }

  // Touch Events fallback.
  function onTouchStart(e: TouchEvent) {
    if (e.touches.length !== 1) return;
    handleStart(e);
  }

  function onTouchMove(e: TouchEvent) {
    handleMove(e);
  }

  function onTouchEnd(e: TouchEvent) {
    handleEnd(e);
  }

  function onTouchCancel(e: TouchEvent) {
    handleCancel(e);
  }

  // Wheel/trackpad handling for desktop.
  // We bind the native wheel event directly and route it to the engine so the
  // list can be scrolled with a physical mouse wheel or trackpad. Hover is NOT
  // used as a trigger; scrolling only happens while the user is actively
  // wheeling over the wheel container.
  //
  // Normalize the raw pixel delta into a single-item step: a physical mouse
  // notch (≈100px) must advance exactly ONE option, matching native iOS wheel
  // stepping. We scale the delta to one item height and clamp each event to a
  // single item so one notch can never jump two rows. Trackpad deltas stay
  // proportional and smooth because they are typically far smaller than a notch.
  function normalizeWheelDelta(e: WheelEvent): number {
    const ITEM_HEIGHT = 48; // matches WheelEngine / WheelColumn item height
    const NOTCH_PX = 100; // typical deltaY for one mouse-wheel notch
    let raw = e.deltaY;
    if (e.deltaMode === 1) raw *= 16; // lines → px
    else if (e.deltaMode === 2) raw *= ITEM_HEIGHT; // pages → px
    const step = (raw / NOTCH_PX) * ITEM_HEIGHT;
    return Math.max(-ITEM_HEIGHT, Math.min(ITEM_HEIGHT, step));
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    handlers.onWheel?.(
      { clientX: e.clientX, clientY: e.clientY, pointerId: -1, timeStamp: performance.now() },
      normalizeWheelDelta(e),
    );
  }

  // Bind Pointer Events when available (handles mouse/touch/pen),
  // but always also bind Touch Events on touch-capable devices. This
  // ensures devices that expose PointerEvent *but* dispatch TouchEvents
  // (or that have buggy PointerEvent support) still receive touch handling
  // so mobile touch gestures are reliably recognised.
  if (supportsPointer) {
    element.addEventListener("pointerdown", onPointerDown, { passive: false });
    element.addEventListener("pointermove", onPointerMove, { passive: false });
    element.addEventListener("pointerup", onPointerUp, { passive: false });
    element.addEventListener("pointercancel", onPointerCancel, { passive: false });
  }

  if (isTouch) {
    element.addEventListener("touchstart", onTouchStart, { passive: false });
    element.addEventListener("touchmove", onTouchMove, { passive: false });
    element.addEventListener("touchend", onTouchEnd, { passive: false });
    element.addEventListener("touchcancel", onTouchCancel, { passive: false });
  }

  // Wheel events do not need capture; prevent default to stop page scroll.
  element.addEventListener("wheel", onWheel, { passive: false });

  return function destroy() {
    removed = true;
    releasePointer();
    if (supportsPointer) {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerCancel);
    }
    if (isTouch) {
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
      element.removeEventListener("touchcancel", onTouchCancel);
    }
    element.removeEventListener("wheel", onWheel);
  };
}
