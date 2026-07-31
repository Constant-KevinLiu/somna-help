import { describe, it, expect } from "vitest";
import { createWheelRenderer } from "./WheelRenderer";
import { createVirtualWheel } from "./VirtualWheel";

const values = Array.from({ length: 12 }, (_, i) => String(i).padStart(2, "0"));

function makeContainer(): HTMLElement {
  // Minimal DOM shim for the renderer under Node test runner.
  const children: HTMLElement[] = [];
  const style = { transform: "" } as unknown as CSSStyleDeclaration;
  const el: HTMLElement = {
    style,
    children: children as unknown as HTMLCollection,
    appendChild(child: HTMLElement) {
      children.push(child);
      return child;
    },
    remove() {
      /* no-op in shim */
    },
    getAttribute() {
      return null;
    },
    setAttribute() {
      /* no-op */
    },
    classList: {
      add() {
        /* no-op */
      },
      remove() {
        /* no-op */
      },
      contains() {
        return false;
      },
    } as unknown as DOMTokenList,
  } as unknown as HTMLElement;
  return el;
}

function makeSlot(): HTMLElement {
  const el = makeContainer();
  el.textContent = "";
  return el;
}

describe("WheelRenderer", () => {
  it("creates the configured number of slots", () => {
    const container = makeContainer();
    const renderer = createWheelRenderer({ container, itemHeight: 48, slotCount: 7 });
    expect(container.children.length).toBe(7);
    renderer.destroy();
  });

  it("applies translate3d to container and slots", () => {
    const container = makeContainer();
    const wheel = createVirtualWheel({
      itemHeight: 48,
      visibleCount: 5,
      itemCount: values.length,
      loop: true,
      values,
    });
    const renderer = createWheelRenderer({
      container,
      itemHeight: 48,
      slotCount: wheel.slotCount,
    });
    const offset = -48 * 3;
    const state = wheel.update(offset);
    renderer.render(state, offset);

    // The container stays at the clipping origin; motion is baked into slots.
    expect(container.style.transform).toBeTruthy();

    const slots = Array.from(container.children) as HTMLElement[];
    expect(slots.every((slot) => slot.style.transform.includes("translate3d"))).toBeTruthy();

    renderer.destroy();
  });

  it("ignores invalid offset values", () => {
    const container = makeContainer();
    const wheel = createVirtualWheel({
      itemHeight: 48,
      visibleCount: 5,
      itemCount: values.length,
      loop: true,
      values,
    });
    const renderer = createWheelRenderer({ container, itemHeight: 48, slotCount: wheel.slotCount });
    const state = wheel.update(0);
    renderer.render(state, 0);
    const before = container.style.transform;

    renderer.render(state, NaN);
    expect(container.style.transform).toBe(before);

    renderer.render(state, Infinity);
    expect(container.style.transform).toBe(before);

    renderer.destroy();
  });

  it("marks selected item with aria-selected and wheel-item-selected", () => {
    const container = makeContainer();
    const wheel = createVirtualWheel({
      itemHeight: 48,
      visibleCount: 5,
      itemCount: values.length,
      loop: true,
      values,
    });
    const renderer = createWheelRenderer({ container, itemHeight: 48, slotCount: wheel.slotCount });
    const state = wheel.update(0);
    renderer.render(state, 0);

    const slots = Array.from(container.children) as HTMLElement[];
    const selected = slots.find((slot) => slot.getAttribute("aria-selected") === "true");
    expect(selected).toBeTruthy();
    expect(selected!.getAttribute("aria-selected")).toBeTruthy();
    expect(selected!.classList.contains("wheel-item-selected")).toBeTruthy();

    renderer.destroy();
  });
});
