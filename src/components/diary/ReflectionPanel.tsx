/**
 * Reflection Panel — combined Today + Timeline view with segmented tabs.
 *
 * Replaces the previous card + separate history page pattern.
 * Mobile-first, single-column, private timeline.
 */

import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { getContentLocale } from "@/lib/locale-registry";
import type { SupportedLocale } from "@/lib/locale-registry";
import type { ContentLocale } from "@/content/content-types";
import { GuidedReflectionCard } from "./GuidedReflectionCard";
import { ReflectionTimeline } from "./ReflectionTimeline";
import { EN_REFLECTION_UI } from "@/content/en/diary/reflection-ui";
import { ES_REFLECTION_UI } from "@/content/es/diary/reflection-ui";
import { PT_BR_REFLECTION_UI } from "@/content/pt-BR/diary/reflection-ui";
import { PL_REFLECTION_UI } from "@/content/pl/diary/reflection-ui";
import type { ReflectionUiStrings } from "@/content/en/diary/reflection-ui";

const UI_STRINGS: Partial<Record<ContentLocale, ReflectionUiStrings>> = {
  en: EN_REFLECTION_UI,
  es: ES_REFLECTION_UI,
  "pt-BR": PT_BR_REFLECTION_UI,
  pl: PL_REFLECTION_UI,
};

type Tab = "today" | "timeline";

interface ReflectionPanelProps {
  onOpenAuth?: () => void;
}

export function ReflectionPanel({ onOpenAuth }: ReflectionPanelProps) {
  const { lang } = useI18n();
  const uiLocale = lang as SupportedLocale;
  const contentLocale = getContentLocale(uiLocale) as ContentLocale;
  const strings = UI_STRINGS[contentLocale] ?? EN_REFLECTION_UI;

  const [activeTab, setActiveTab] = useState<Tab>("today");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleEdit = useCallback((_date: string) => {
    // Edit switches to "today" view — the GuidedReflectionCard
    // already loads the existing entry for the given date via its key
    // (the diary page handles editDate state)
    setActiveTab("today");
  }, []);

  return (
    <div className="space-y-4">
      {/* Tab controls */}
      <div
        role="tablist"
        aria-label="Reflection views"
        className="flex rounded-full bg-white/5 p-1"
      >
        <button
          role="tab"
          aria-selected={activeTab === "today"}
          aria-label={strings.accessibility.todayTab}
          onClick={() => setActiveTab("today")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
            activeTab === "today"
              ? "bg-white/10 text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {strings.timeline.tabToday}
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "timeline"}
          aria-label={strings.accessibility.timelineTab}
          onClick={() => setActiveTab("timeline")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
            activeTab === "timeline"
              ? "bg-white/10 text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {strings.timeline.tabTimeline}
        </button>
      </div>

      {/* Tab panels */}
      <div
        role="tabpanel"
        aria-labelledby={strings.timeline.tabToday}
        hidden={activeTab !== "today"}
      >
        <GuidedReflectionCard
          onViewHistory={() => setActiveTab("timeline")}
          onOpenAuth={onOpenAuth}
          onSaved={handleSaved}
        />
      </div>

      <div
        role="tabpanel"
        aria-labelledby={strings.timeline.tabTimeline}
        hidden={activeTab !== "timeline"}
      >
        <ReflectionTimeline
          strings={strings}
          locale={contentLocale}
          onEdit={handleEdit}
          refreshKey={refreshKey}
        />
      </div>
    </div>
  );
}
