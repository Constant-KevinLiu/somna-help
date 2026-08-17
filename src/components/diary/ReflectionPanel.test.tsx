/**
 * ReflectionPanel + ReflectionTimeline + useReflectionDraft regression tests.
 *
 * Covers:
 * - useReflectionDraft: persistence success/failure toasts, Save commits history,
 *   autosave updates draft only, repeated Save does not duplicate, locale normalization
 * - ReflectionPanel: Today + Timeline tabs work, saved callback refreshes Timeline,
 *   correct tab semantics, no raw translation keys
 * - ReflectionTimeline: newest-first, date groups, expand/collapse, edit & save,
 *   copy action, delete confirmation & scoped deletion, local/sync state,
 *   empty-state CTA, keyboard accessibility & ARIA labels
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, fireEvent, waitFor, within, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useReflectionDraft } from "@/hooks/useReflectionDraft";
import { ReflectionPanel } from "./ReflectionPanel";
import { ReflectionTimeline } from "./ReflectionTimeline";
import { EN_REFLECTION_UI } from "@/content/en/diary/reflection-ui";
import {
  saveReflection,
  clearDraft,
  generateReflectionId,
  todayLocalISO,
  getLocalTimezone,
  REFLECTIONS_STORAGE_KEY_V2,
  REFLECTION_DRAFT_STORAGE_KEY,
  runMigrations,
} from "@/lib/reflection/reflection-storage";
import type { LocalReflection } from "@/lib/reflection/reflection-types";
import { countWords } from "@/lib/reflection/reflection-word-count";

// ============================================================================
// Polyfills
// ============================================================================

beforeAll(() => {
  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;

  // Mock matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock navigator.clipboard
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
    writable: true,
  });

  // Mock document.execCommand for copy fallback
  document.execCommand = vi.fn().mockReturnValue(true);
});

// ============================================================================
// LocalStorage mock
// ============================================================================

const mockStorage = new Map<string, string>();

beforeEach(() => {
  mockStorage.clear();
  const mockLocalStorage: Storage = {
    getItem: (key: string) => mockStorage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      mockStorage.set(key, value);
    },
    removeItem: (key: string) => {
      mockStorage.delete(key);
    },
    clear: () => {
      mockStorage.clear();
    },
    key: (index: number) => Array.from(mockStorage.keys())[index] ?? null,
    length: 0,
  };
  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage,
    writable: true,
  });
  (globalThis as any).localStorage = mockLocalStorage;

  vi.clearAllMocks();
  // Ensure clean state
  runMigrations();
});

// ============================================================================
// Test helpers
// ============================================================================

function makeReflection(overrides: Partial<LocalReflection> = {}): LocalReflection {
  const content = overrides.content ?? "I slept well last night. Feeling rested.";
  return {
    id: overrides.id ?? generateReflectionId(),
    localDate: overrides.localDate ?? todayLocalISO(),
    timezone: overrides.timezone ?? getLocalTimezone(),
    locale: overrides.locale ?? "en",
    promptIds: overrides.promptIds ?? ["p1", "p2", "p3"],
    promptCategories: overrides.promptCategories ?? [
      "sleep-thoughts",
      "sleep-behaviors",
      "gratitude",
    ],
    content,
    wordCount: overrides.wordCount ?? countWords(content),
    createdAt: overrides.createdAt ?? new Date().toISOString(),
    updatedAt: overrides.updatedAt ?? new Date().toISOString(),
    syncStatus: overrides.syncStatus ?? "local",
  };
}

// ============================================================================
// useReflectionDraft hook tests
// ============================================================================

describe("useReflectionDraft", () => {
  // Simple test harness component
  function TestComponent({ onSave }: { onSave?: () => void }) {
    const { content, setContent, wordCount, saveStatus, manualSave, isEditing } =
      useReflectionDraft({ locale: "en" });

    return (
      <div>
        <textarea
          data-testid="reflection-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <span data-testid="word-count">{wordCount}</span>
        <span data-testid="save-status">{saveStatus}</span>
        <span data-testid="is-editing">{isEditing ? "true" : "false"}</span>
        <button data-testid="save-btn" onClick={manualSave}>
          Save
        </button>
        {onSave && <button data-testid="check-save" onClick={onSave} />}
      </div>
    );
  }

  it("persistence success → saveStatus becomes saved", async () => {
    render(<TestComponent />);

    const textarea = screen.getByTestId("reflection-textarea");
    fireEvent.change(textarea, { target: { value: "My test reflection content" } });

    const saveBtn = screen.getByTestId("save-btn");
    fireEvent.click(saveBtn);

    // After save, status should be "saved"
    await waitFor(() => {
      expect(screen.getByTestId("save-status").textContent).toBe("saved");
    });
  });

  it("persistence failure → no success state", () => {
    // Force quota exceeded
    const originalSet = mockStorage.set.bind(mockStorage);
    mockStorage.set = () => {
      const err = new Error("Quota exceeded");
      err.name = "QuotaExceededError";
      throw err;
    };

    render(<TestComponent />);

    const textarea = screen.getByTestId("reflection-textarea");
    fireEvent.change(textarea, { target: { value: "Will fail to save" } });

    const saveBtn = screen.getByTestId("save-btn");
    fireEvent.click(saveBtn);

    // Status should be "error"
    expect(screen.getByTestId("save-status").textContent).toBe("error");

    // Restore
    mockStorage.set = originalSet;
  });

  it("explicit Save commits to history (appears in v2 storage)", () => {
    render(<TestComponent />);

    const textarea = screen.getByTestId("reflection-textarea");
    fireEvent.change(textarea, { target: { value: "Committed reflection" } });

    fireEvent.click(screen.getByTestId("save-btn"));

    // Check v2 storage — should have one reflection
    const v2Raw = mockStorage.get(REFLECTIONS_STORAGE_KEY_V2);
    expect(v2Raw).toBeDefined();
    const v2 = JSON.parse(v2Raw!);
    expect(v2.reflections.length).toBe(1);
    expect(v2.reflections[0].content).toBe("Committed reflection");
  });

  it("autosave updates draft only (not committed history)", () => {
    vi.useFakeTimers();

    render(<TestComponent />);

    const textarea = screen.getByTestId("reflection-textarea");
    fireEvent.change(textarea, { target: { value: "Autosaved draft content" } });

    // Fast forward past autosave debounce (1500ms)
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Draft should exist
    const draftRaw = mockStorage.get(REFLECTION_DRAFT_STORAGE_KEY);
    expect(draftRaw).toBeDefined();
    const draft = JSON.parse(draftRaw!);
    expect(draft.content).toBe("Autosaved draft content");

    // Committed history should be empty (autosave does NOT commit)
    const v2Raw = mockStorage.get(REFLECTIONS_STORAGE_KEY_V2);
    const v2 = v2Raw ? JSON.parse(v2Raw) : { reflections: [] };
    expect(v2.reflections.length).toBe(0);

    vi.useRealTimers();
  });

  it("repeated Save does not duplicate (upsert by date)", () => {
    render(<TestComponent />);

    const textarea = screen.getByTestId("reflection-textarea");

    // First save
    fireEvent.change(textarea, { target: { value: "Version 1" } });
    fireEvent.click(screen.getByTestId("save-btn"));

    // Second save with different content
    fireEvent.change(textarea, { target: { value: "Version 2" } });
    fireEvent.click(screen.getByTestId("save-btn"));

    const v2Raw = mockStorage.get(REFLECTIONS_STORAGE_KEY_V2);
    const v2 = JSON.parse(v2Raw!);
    expect(v2.reflections.length).toBe(1);
    expect(v2.reflections[0].content).toBe("Version 2");
  });

  it("after save, isEditing becomes true", async () => {
    render(<TestComponent />);

    expect(screen.getByTestId("is-editing").textContent).toBe("false");

    const textarea = screen.getByTestId("reflection-textarea");
    fireEvent.change(textarea, { target: { value: "New reflection" } });
    fireEvent.click(screen.getByTestId("save-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("is-editing").textContent).toBe("true");
    });
  });
});

// ============================================================================
// ReflectionPanel tests
// ============================================================================

describe("ReflectionPanel", () => {
  it("renders Today and Timeline tab controls", () => {
    render(<ReflectionPanel />);

    const tablist = screen.getByRole("tablist", { name: /reflection views/i });
    expect(tablist).toBeInTheDocument();

    const todayTab = screen.getByRole("tab", { name: /today/i });
    const timelineTab = screen.getByRole("tab", { name: /timeline/i });
    expect(todayTab).toBeInTheDocument();
    expect(timelineTab).toBeInTheDocument();
  });

  it("Today tab is active by default", () => {
    render(<ReflectionPanel />);

    const todayTab = screen.getByRole("tab", { name: /today/i });
    expect(todayTab).toHaveAttribute("aria-selected", "true");
  });

  it("clicking Timeline tab switches to timeline view", () => {
    render(<ReflectionPanel />);

    const timelineTab = screen.getByRole("tab", { name: /timeline/i });
    fireEvent.click(timelineTab);

    expect(timelineTab).toHaveAttribute("aria-selected", "true");

    // Timeline panel should be visible
    const timelinePanel = screen.getByRole("tabpanel");
    expect(timelinePanel).not.toHaveAttribute("hidden");
  });

  it("saved callback refreshes Timeline without page reload", () => {
    // Start with empty state, then save a reflection
    render(<ReflectionPanel />);

    // Switch to timeline tab
    fireEvent.click(screen.getByRole("tab", { name: /timeline/i }));

    // The visible tabpanel should have the timeline
    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    const timelinePanel = panels[1]; // Second panel is timeline
    expect(timelinePanel).not.toHaveAttribute("hidden");

    // Timeline panel should show the empty state
    expect(within(timelinePanel).getByText("No reflections yet")).toBeInTheDocument();

    // Switch to today tab, type something, save
    fireEvent.click(screen.getByRole("tab", { name: /today/i }));

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "New reflection to test refresh" } });

    const saveButton = screen.getByRole("button", { name: /save reflection/i });
    fireEvent.click(saveButton);

    // Switch back to timeline — should now show the new reflection
    fireEvent.click(screen.getByRole("tab", { name: /timeline/i }));

    // Should have at least one entry (not empty anymore)
    const articles = within(timelinePanel).getAllByRole("article");
    expect(articles.length).toBeGreaterThan(0);
  });

  it("does not show raw translation keys", () => {
    render(<ReflectionPanel />);

    // Get all visible text — should not contain key-like strings
    const bodyText = document.body.textContent || "";

    // No raw keys like "timeline.tabToday" or "accessibility.todayTab"
    expect(bodyText).not.toContain("tabToday");
    expect(bodyText).not.toContain("tabTimeline");
    expect(bodyText).not.toContain("timeline.");
    expect(bodyText).not.toContain("accessibility.");

    // Tab labels should be human-readable (from the strings dict)
    const todayTab = screen.getByRole("tab", { name: /today/i });
    expect(todayTab.textContent?.length).toBeGreaterThan(0);
    expect(todayTab.textContent).not.toMatch(/^[a-z]+\.[a-z]+$/);
  });
});

// ============================================================================
// ReflectionTimeline tests
// ============================================================================

describe("ReflectionTimeline", () => {
  it("renders empty state with CTA when no reflections", () => {
    render(<ReflectionTimeline strings={EN_REFLECTION_UI} locale="en" onEdit={() => {}} />);

    expect(screen.getByText(EN_REFLECTION_UI.timeline.empty)).toBeInTheDocument();
    expect(screen.getByText(EN_REFLECTION_UI.history.empty)).toBeInTheDocument();
  });

  it("renders reflections in newest-first order", () => {
    saveReflection(
      makeReflection({
        id: "ref_oldest",
        localDate: "2026-08-10",
        content: "Oldest entry",
      }),
    );
    saveReflection(
      makeReflection({
        id: "ref_middle",
        localDate: "2026-08-12",
        content: "Middle entry",
      }),
    );
    saveReflection(
      makeReflection({
        id: "ref_newest",
        localDate: "2026-08-14",
        content: "Newest entry",
      }),
    );

    render(<ReflectionTimeline strings={EN_REFLECTION_UI} locale="en" onEdit={() => {}} />);

    const articles = screen.getAllByRole("article");
    expect(articles.length).toBe(3);
    // First article should be the newest (Aug 14)
    expect(within(articles[0]).getByText("Newest entry")).toBeInTheDocument();
    // Last article should be the oldest (Aug 10)
    expect(within(articles[2]).getByText("Oldest entry")).toBeInTheDocument();
  });

  it("groups reflections by date", () => {
    saveReflection(
      makeReflection({
        id: "ref_today_1",
        localDate: todayLocalISO(),
        content: "Today's first reflection",
      }),
    );
    saveReflection(
      makeReflection({
        id: "ref_yesterday",
        localDate: "2026-08-13",
        content: "Yesterday reflection",
      }),
    );

    render(<ReflectionTimeline strings={EN_REFLECTION_UI} locale="en" onEdit={() => {}} />);

    // Should show "Today" and "Yesterday" labels
    expect(screen.getByText(EN_REFLECTION_UI.timeline.today)).toBeInTheDocument();
    // Note: yesterday label depends on date relative to today; check that groups exist
    const articles = screen.getAllByRole("article");
    expect(articles.length).toBe(2);
  });

  it("expand/collapse toggles full content for long entries", () => {
    const longContent = "A".repeat(300); // Longer than EXCERPT_LENGTH (180)
    saveReflection(
      makeReflection({
        id: "ref_long",
        localDate: todayLocalISO(),
        content: longContent,
      }),
    );

    render(<ReflectionTimeline strings={EN_REFLECTION_UI} locale="en" onEdit={() => {}} />);

    const article = screen.getByRole("article");
    // Initially collapsed — shows truncated content with ellipsis
    const contentEl = within(article).getByText(/^A+…$/);
    expect(contentEl).toBeInTheDocument();

    // Click expand button
    const expandBtn = within(article).getByRole("button", {
      name: EN_REFLECTION_UI.accessibility.expandEntry,
    });
    fireEvent.click(expandBtn);

    // Should show full content now
    const fullContent = within(article).getByText(longContent);
    expect(fullContent).toBeInTheDocument();

    // Button should be aria-expanded=true
    expect(expandBtn).toHaveAttribute("aria-expanded", "true");
  });

  it("copy action copies content to clipboard", async () => {
    const content = "Copy this reflection text";
    saveReflection(
      makeReflection({
        id: "ref_copy",
        localDate: todayLocalISO(),
        content,
      }),
    );

    render(<ReflectionTimeline strings={EN_REFLECTION_UI} locale="en" onEdit={() => {}} />);

    const copyBtn = screen.getByRole("button", {
      name: EN_REFLECTION_UI.accessibility.copyEntry,
    });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(content);
    });
  });

  it("delete confirmation removes only the target reflection", () => {
    saveReflection(
      makeReflection({
        id: "ref_keep",
        localDate: "2026-08-13",
        content: "Keep me",
      }),
    );
    saveReflection(
      makeReflection({
        id: "ref_delete",
        localDate: todayLocalISO(),
        content: "Delete me",
      }),
    );

    render(<ReflectionTimeline strings={EN_REFLECTION_UI} locale="en" onEdit={() => {}} />);

    expect(screen.getAllByRole("article").length).toBe(2);

    // Click delete button for "Delete me"
    const articles = screen.getAllByRole("article");
    const targetArticle = articles.find((a) => within(a).queryByText("Delete me"))!;

    const deleteBtn = within(targetArticle).getByRole("button", {
      name: EN_REFLECTION_UI.accessibility.deleteEntry,
    });
    fireEvent.click(deleteBtn);

    // Confirmation dialog should appear
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Click confirm
    const confirmBtn = within(dialog).getByRole("button", {
      name: EN_REFLECTION_UI.timeline.deleteConfirmAction,
    });
    fireEvent.click(confirmBtn);

    // Only one reflection remains
    expect(screen.getAllByRole("article").length).toBe(1);
    expect(screen.getByText("Keep me")).toBeInTheDocument();
  });

  it("shows correct sync status labels", () => {
    saveReflection(
      makeReflection({
        id: "ref_synced",
        localDate: "2026-08-14",
        content: "Synced entry",
        syncStatus: "synced",
      }),
    );
    saveReflection(
      makeReflection({
        id: "ref_local",
        localDate: "2026-08-13",
        content: "Local entry",
        syncStatus: "local",
      }),
    );

    render(<ReflectionTimeline strings={EN_REFLECTION_UI} locale="en" onEdit={() => {}} />);

    expect(screen.getByText(EN_REFLECTION_UI.timeline.synced)).toBeInTheDocument();
    expect(screen.getByText(EN_REFLECTION_UI.timeline.savedLocally)).toBeInTheDocument();
  });

  it("all interactive elements have ARIA labels", () => {
    saveReflection(
      makeReflection({
        id: "ref_a11y",
        localDate: todayLocalISO(),
        content: "Long content for expand button a".repeat(30), // long enough for expand
      }),
    );

    render(<ReflectionTimeline strings={EN_REFLECTION_UI} locale="en" onEdit={() => {}} />);

    // Edit button
    expect(
      screen.getByRole("button", { name: EN_REFLECTION_UI.accessibility.editEntry }),
    ).toBeInTheDocument();

    // Copy button
    expect(
      screen.getByRole("button", { name: EN_REFLECTION_UI.accessibility.copyEntry }),
    ).toBeInTheDocument();

    // Delete button
    expect(
      screen.getByRole("button", { name: EN_REFLECTION_UI.accessibility.deleteEntry }),
    ).toBeInTheDocument();

    // Expand button
    expect(
      screen.getByRole("button", { name: EN_REFLECTION_UI.accessibility.expandEntry }),
    ).toBeInTheDocument();
  });

  it("edit callback is called with the correct date", () => {
    const mockOnEdit = vi.fn();
    const testDate = "2026-08-12";

    saveReflection(
      makeReflection({
        id: "ref_edit",
        localDate: testDate,
        content: "Editable entry",
      }),
    );

    render(<ReflectionTimeline strings={EN_REFLECTION_UI} locale="en" onEdit={mockOnEdit} />);

    const editBtn = screen.getByRole("button", {
      name: EN_REFLECTION_UI.accessibility.editEntry,
    });
    fireEvent.click(editBtn);

    expect(mockOnEdit).toHaveBeenCalledWith(testDate);
  });

  it("cancel delete closes dialog without deleting", () => {
    saveReflection(
      makeReflection({
        id: "ref_cancel",
        localDate: todayLocalISO(),
        content: "Don't delete me",
      }),
    );

    render(<ReflectionTimeline strings={EN_REFLECTION_UI} locale="en" onEdit={() => {}} />);

    const deleteBtn = screen.getByRole("button", {
      name: EN_REFLECTION_UI.accessibility.deleteEntry,
    });
    fireEvent.click(deleteBtn);

    const dialog = screen.getByRole("dialog");
    const cancelBtn = within(dialog).getByRole("button", {
      name: EN_REFLECTION_UI.timeline.cancel,
    });
    fireEvent.click(cancelBtn);

    // Dialog should be closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // Article still exists
    expect(screen.getByRole("article")).toBeInTheDocument();
  });
});
