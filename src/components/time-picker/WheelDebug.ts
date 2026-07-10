"use client";

/**
 * WheelDebug — development-only debugging overlay for WheelEngine.
 *
 * This module is fully tree-shaken in production builds because every
 * public symbol is guarded by `import.meta.env.DEV` and consumers only
 * reference it from dev-only code paths. No runtime cost in production.
 */

export interface WheelDebugState {
  selectedIndex: number;
  translateY: number;
  velocity: number;
  acceleration: number;
  momentum: boolean;
  snapping: boolean;
  physics: "idle" | "dragging" | "momentum" | "snapping" | "ready";
  visibleItems: number;
  virtualStart: number;
  renderCount: number;
  frameCount: number;
  pointerCaptured: boolean;
  gesture: "idle" | "start" | "active" | "end";
  fps: number;
}

export interface WheelDebugSnapshot extends WheelDebugState {
  timestamp: number;
  ua: string;
}

const DEFAULT_STATE: WheelDebugState = {
  selectedIndex: 0,
  translateY: 0,
  velocity: 0,
  acceleration: 0,
  momentum: false,
  snapping: false,
  physics: "idle",
  visibleItems: 0,
  virtualStart: 0,
  renderCount: 0,
  frameCount: 0,
  pointerCaptured: false,
  gesture: "idle",
  fps: 0,
};

function formatNum(n: number): string {
  if (!Number.isFinite(n)) return "INVALID";
  return n.toFixed(2);
}

class WheelDebugPanel {
  private element: HTMLElement | null = null;
  private state: WheelDebugState = { ...DEFAULT_STATE };
  private renderCount = 0;
  private rafId: number | null = null;
  private visible = false;
  private frameTimestamps: number[] = [];

  constructor() {
    this.createPanel();
    this.bindToggle();
    this.scheduleUpdate();
    // Only show by default in dev/debug mode; production callers never reach here.
    if (isWheelDebugEnabled()) {
      this.visible = true;
      if (this.element) {
        this.element.style.opacity = "0.92";
        this.element.style.pointerEvents = "auto";
      }
    }
  }

  private createPanel() {
    if (this.element) return;
    const el = document.createElement("div");
    el.id = "wheel-debug-panel";
    el.setAttribute(
      "style",
      [
        "position:fixed",
        "bottom:12px",
        "right:12px",
        "z-index:9999",
        "width:260px",
        "padding:12px",
        "border-radius:12px",
        "font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace",
        "font-size:12px",
        "line-height:1.45",
        "color:rgba(255,255,255,0.92)",
        "background:rgba(15,18,34,0.92)",
        "backdrop-filter:blur(8px)",
        "-webkit-backdrop-filter:blur(8px)",
        "border:1px solid rgba(124,140,255,0.35)",
        "box-shadow:0 16px 48px rgba(0,0,0,0.35)",
        "pointer-events:none",
        "opacity:0",
        "transition:opacity 150ms ease-out",
        "user-select:none",
      ].join(";"),
    );

    const title = document.createElement("div");
    title.textContent = "Wheel Debug";
    title.setAttribute(
      "style",
      "font-weight:700;margin-bottom:8px;color:rgb(124,140,255);letter-spacing:0.05em;",
    );
    el.appendChild(title);

    const rows = document.createElement("div");
    rows.id = "wheel-debug-rows";
    el.appendChild(rows);

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy Debug State";
    copyBtn.setAttribute(
      "style",
      [
        "margin-top:8px",
        "padding:4px 8px",
        "border-radius:6px",
        "border:1px solid rgba(124,140,255,0.35)",
        "background:rgba(124,140,255,0.12)",
        "color:rgba(255,255,255,0.9)",
        "font-size:10px",
        "cursor:pointer",
        "pointer-events:auto",
      ].join(";"),
    );
    copyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      copyWheelDebugState();
    });
    el.appendChild(copyBtn);

    const hint = document.createElement("div");
    hint.textContent = "Ctrl+Shift+W to toggle";
    hint.setAttribute("style", "margin-top:6px;font-size:10px;color:rgba(255,255,255,0.5);");
    el.appendChild(hint);

    document.body.appendChild(el);
    this.element = el;
  }

  private bindToggle() {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "W" || e.key === "w")) {
        e.preventDefault();
        this.toggle();
      }
    };
    document.addEventListener("keydown", handler);
  }

  private scheduleUpdate() {
    if (this.rafId !== null) return;
    const loop = (now: number) => {
      this.computeFps(now);
      if (this.visible) {
        this.render();
      }
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  private computeFps(now: number) {
    this.frameTimestamps.push(now);
    while (this.frameTimestamps.length > 0 && now - this.frameTimestamps[0] > 1000) {
      this.frameTimestamps.shift();
    }
    this.state.fps = this.frameTimestamps.length;
  }

  toggle() {
    this.visible = !this.visible;
    if (this.element) {
      this.element.style.opacity = this.visible ? "0.92" : "0";
      this.element.style.pointerEvents = this.visible ? "auto" : "none";
    }
  }

  private render() {
    if (!this.element) return;
    const rows = this.element.querySelector<HTMLDivElement>("#wheel-debug-rows");
    if (!rows) return;

    const isHealthy = this.validate();
    const borderColor = isHealthy ? "rgba(124,220,140,0.45)" : "rgba(255,100,100,0.55)";
    this.element.style.borderColor = borderColor;

    const lines: string[] = [
      `Visible Items: ${this.state.visibleItems}`,
      `Selected: ${String(this.state.selectedIndex).padStart(2, "0")}`,
      `Virtual Start: ${this.state.virtualStart}`,
      `translateY: ${formatNum(this.state.translateY)}px`,
      `Velocity: ${formatNum(this.state.velocity)}`,
      `Accel: ${formatNum(this.state.acceleration)}`,
      `Momentum: ${this.state.momentum ? "ON" : "OFF"}`,
      `Physics: ${this.state.physics.toUpperCase()}`,
      `FPS: ${this.state.fps}`,
      `Render #: ${this.state.renderCount}`,
      `Gesture: ${this.state.gesture.toUpperCase()}`,
      `Pointer: ${this.state.pointerCaptured ? "CAPTURED" : "FREE"}`,
    ];

    rows.innerHTML = lines
      .map((line) => `<div style="white-space:pre;">${escapeHtml(line)}</div>`)
      .join("");
  }

  private validate(): boolean {
    if (this.state.visibleItems <= 0) return false;
    if (!Number.isFinite(this.state.translateY)) return false;
    if (!Number.isFinite(this.state.velocity)) return false;
    if (!Number.isFinite(this.state.acceleration)) return false;
    return true;
  }

  update(patch: Partial<WheelDebugState>) {
    if (!this.element) return;
    Object.assign(this.state, patch);
    this.renderCount += 1;
    this.state.renderCount = this.renderCount;
  }

  incrementFrame() {
    this.renderCount += 1;
  }

  snapshot(): WheelDebugSnapshot {
    return {
      ...this.state,
      timestamp: Date.now(),
      ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
    };
  }

  destroy() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function isWheelDebugEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (import.meta.env.DEV) return true;
  } catch {
    /* import.meta.env may not be available in tests */
  }
  // Fallback: detect Vite dev client by the presence of the HMR preamble flag.
  if (
    typeof window !== "undefined" &&
    (window as Window & { __vite_plugin_react_preamble_installed__?: boolean })
      .__vite_plugin_react_preamble_installed__
  ) {
    return true;
  }
  try {
    if (window.localStorage.getItem("DEBUG_WHEEL") === "true") return true;
  } catch {
    /* ignore */
  }
  return false;
}

// Singleton panel reused across all wheels.
let panel: WheelDebugPanel | null = null;

export function getWheelDebugPanel(): WheelDebugPanel | null {
  if (typeof window === "undefined") return null;
  if (!panel) {
    panel = new WheelDebugPanel();
  }
  return panel;
}

export function updateWheelDebug(patch: Partial<WheelDebugState>) {
  getWheelDebugPanel()?.update(patch);
}

export function copyWheelDebugState(): Promise<void> {
  const snapshot = getWheelDebugPanel()?.snapshot();
  if (!snapshot || typeof navigator === "undefined") return Promise.resolve();
  const json = JSON.stringify(snapshot, null, 2);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(json).catch(() => {
      fallbackCopy(json);
    });
  }
  fallbackCopy(json);
  return Promise.resolve();
}

function fallbackCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
  } catch {
    /* ignore */
  }
  ta.remove();
}
