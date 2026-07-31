/**
 * English — Reflection UI Text Content
 *
 * Natively authored UI strings for the Guided Reflection feature.
 */

export interface ReflectionUiStrings {
  title: string;
  subtitle: string;
  promptsHeader: string;
  wordCount: string;
  wordLimit: string;
  wordLimitReached: string;
  saveButton: string;
  historyButton: string;
  syncButton: string;
  saveStatus: {
    idle: string;
    saving: string;
    saved: string;
    error: string;
    unsaved: string;
  };
  toast: {
    saved: string;
    saveError: string;
    deleted: string;
    deleteError: string;
  };
  history: {
    title: string;
    empty: string;
    backToToday: string;
    edit: string;
    delete: string;
    deleteConfirm: string;
    deleteConfirmAction: string;
    cancel: string;
  };
  privacy: string;
  accessibility: {
    editorLabel: string;
    wordCountAnnounce: string;
    savedAnnounce: string;
  };
  stats: {
    streak: string;
    thisMonth: string;
    total: string;
  };
}

export const EN_REFLECTION_UI: ReflectionUiStrings = {
  title: "Guided CBT-I Reflection",
  subtitle: "Three daily prompts to explore your relationship with sleep",
  promptsHeader: "Today's prompts",
  word: "word",
  wordLimit: "words",
  wordLimitReached: "Word limit reached — you can still edit and delete",
  saveButton: "Save Reflection",
  historyButton: "View History",
  syncButton: "Sync across devices",
  saveStatus: {
    idle: "",
    saving: "Saving...",
    saved: "Saved locally",
    error: "Save failed",
    unsaved: "Unsaved changes",
  },
  toast: {
    saved: "Reflection saved successfully",
    saveError: "Could not save your reflection. Please try again.",
    deleted: "Reflection deleted",
    deleteError: "Could not delete reflection. Please try again.",
  },
  history: {
    title: "Reflection History",
    empty: "No reflections yet. Start with today's reflection!",
    backToToday: "Back to Today",
    edit: "Edit",
    delete: "Delete",
    deleteConfirm: "Are you sure you want to delete this reflection? This cannot be undone.",
    deleteConfirmAction: "Delete",
    cancel: "Cancel",
  },
  privacy: "Your reflections are stored locally on your device and never sent to our servers.",
  accessibility: {
    editorLabel: "Reflection editor. Three daily prompts to explore your relationship with sleep",
    wordCountAnnounce: "You have written",
    savedAnnounce: "Your reflection has been saved locally",
  },
  stats: {
    streak: "day streak",
    thisMonth: "this month",
    total: "total reflections",
  },
};
