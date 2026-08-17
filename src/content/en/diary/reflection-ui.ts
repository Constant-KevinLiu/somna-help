/**
 * English — Reflection UI Text Content
 *
 * Natively authored UI strings for the Guided Reflection feature.
 */

export interface ReflectionUiStrings {
  title: string;
  subtitle: string;
  promptsHeader: string;
  word: string;
  wordCount: string;
  wordLimit: string;
  wordLimitReached: string;
  saveButton: string;
  saveChangesButton: string;
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
    copied: string;
    copyError: string;
  };
  timeline: {
    tabToday: string;
    tabTimeline: string;
    title: string;
    empty: string;
    emptyCta: string;
    today: string;
    yesterday: string;
    savedLocally: string;
    synced: string;
    pending: string;
    expand: string;
    collapse: string;
    edit: string;
    copy: string;
    copied: string;
    delete: string;
    deleteConfirm: string;
    deleteConfirmAction: string;
    cancel: string;
    backToToday: string;
    total: string;
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
    expandEntry: string;
    collapseEntry: string;
    editEntry: string;
    copyEntry: string;
    deleteEntry: string;
    timelineTab: string;
    todayTab: string;
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
  wordCount: "word count",
  wordLimit: "words",
  wordLimitReached: "Word limit reached — you can still edit and delete",
  saveButton: "Save Reflection",
  saveChangesButton: "Save changes",
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
    copied: "Copied to clipboard",
    copyError: "Could not copy to clipboard",
  },
  timeline: {
    tabToday: "Today",
    tabTimeline: "Timeline",
    title: "Reflection History",
    empty: "No reflections yet",
    emptyCta: "Write today's reflection",
    today: "Today",
    yesterday: "Yesterday",
    savedLocally: "Saved locally",
    synced: "Synced",
    pending: "Sync pending",
    expand: "Show more",
    collapse: "Show less",
    edit: "Edit",
    copy: "Copy",
    copied: "Copied",
    delete: "Delete",
    deleteConfirm: "Are you sure you want to delete this reflection? This cannot be undone.",
    deleteConfirmAction: "Delete",
    cancel: "Cancel",
    backToToday: "Back to Today",
    total: "total reflections",
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
    expandEntry: "Expand entry to read full reflection",
    collapseEntry: "Collapse entry",
    editEntry: "Edit this reflection",
    copyEntry: "Copy reflection text to clipboard",
    deleteEntry: "Delete this reflection",
    timelineTab: "View reflection timeline",
    todayTab: "Return to today's reflection",
  },
  stats: {
    streak: "day streak",
    thisMonth: "this month",
    total: "total reflections",
  },
};
