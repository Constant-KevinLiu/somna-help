# Insight Dashboard

Explainable insight cards, trend charts, and weekly summaries integrated into the sleep dashboard. Part of Sleep Diary v2.4 (Phase F).

## Overview

The Insight Dashboard transforms raw analytics data into clear, actionable cards that users can understand at a glance. Every insight explains its own evidence — users can always see "why am I being told this?"

The dashboard extension is additive: all existing dashboard sections (CBT-I Brain, streak, program progress, reminders) remain unchanged. Analytics sections appear after the streak section.

## Dashboard Layout

```
┌─────────────────────────────────────────┐
│ 1. Today's Recommendation (existing)    │
├─────────────────────────────────────────┤
│ 2. CBT-I Brain (existing)               │
├─────────────────────────────────────────┤
│ 3. Program Progress (existing)          │
├─────────────────────────────────────────┤
│ 4. Last 7 Days Trend (existing)         │
├─────────────────────────────────────────┤
│ 5. Weekly Insight (existing)            │
├─────────────────────────────────────────┤
│ 6. Streak (existing)                    │
├─────────────────────────────────────────┤
│ 7. Analytics Overview [NEW — Phase F]   │
│    ┌───────────────────────────────┐    │
│    │  Time window selector         │    │
│    │  Data sufficiency banner      │    │
│    │  4 key metrics grid           │    │
│    │  Sleep efficiency chart       │    │
│    └───────────────────────────────┘    │
├─────────────────────────────────────────┤
│ 8. Insights [NEW — Phase F]             │
│    ┌────────────┐ ┌────────────┐       │
│    │ Insight 1  │ │ Insight 2  │       │
│    └────────────┘ └────────────┘       │
│    ┌────────────┐ ┌────────────┐       │
│    │ Insight 3  │ │ Insight 4  │       │
│    └────────────┘ └────────────┘       │
├─────────────────────────────────────────┤
│ 9. Weekly Summary + Focus [NEW]         │
│    ┌───────────────┐ ┌───────────────┐  │
│    │ Weekly Summary│ │ Weekly Focus  │  │
│    └───────────────┘ └───────────────┘  │
├─────────────────────────────────────────┤
│ 10. Weekly Reflection [NEW — Phase F]   │
├─────────────────────────────────────────┤
│ 11. Habit Reminders (existing)          │
└─────────────────────────────────────────┘
```

## Insight Cards

Each insight card is explainable by design. It answers:

- **What** — the finding or suggestion (prominent)
- **Type** — trend / pattern / encouragement / behavioral focus / metric
- **Confidence** — high / medium / low
- **Evidence** (behind "Show details" toggle):
  - Time period
  - Number of records used
  - Data sufficiency level
  - Supporting patterns

### Insight Generation Pipeline

Insights are generated in priority order, capped at 3-5 cards:

1. **Strongest trend** (if improving or declining with medium+ confidence)
2. **Most actionable pattern** (highest confidence pattern finding)
3. **Behavioral focus** (linked to weekly focus)
4. **Encouragement / milestone** (streaks, completion, consistency)
5. **Metric highlight** (most notable individual metric)

The pipeline ensures:

- No duplicate insight types
- Positive insights are balanced with observational ones
- Data sufficiency is always shown
- Confidence is never over-stated

### Types

| Type               | Icon       | Purpose                                          |
| ------------------ | ---------- | ------------------------------------------------ |
| `trend`            | TrendingUp | A metric meaningfully changed vs previous period |
| `pattern`          | Info       | A recurring pattern detected in the data         |
| `encouragement`    | Award      | Milestone, streak, or positive reinforcement     |
| `behavioral_focus` | Target     | Suggested area to focus on next week             |
| `metric`           | Sparkles   | A notable metric value worth highlighting        |

## Analytics Overview Card

The top analytics section includes:

### Time Window Selector

7d / 14d / 30d / 90d pill button group. Uses `aria-pressed` for accessibility. All metrics and charts update instantly when the window changes.

### Data Sufficiency Banner

Always visible when data is less than "sufficient". Clearly communicates:

- How many records were used
- What level of analysis is available
- What's needed for fuller insights

### Metrics Grid

4 key metrics at a glance:

- Sleep Efficiency
- Total Sleep Time
- Sleep Onset Latency
- Sleep Regularity

### Trend Chart

Recharts-based interactive line chart showing sleep efficiency across the selected window. Null/missing data points are handled gracefully (gaps, not connecting lines).

## Weekly Summary + Focus

Side-by-side on large screens, stacked on mobile.

### Weekly Summary

- Completion bar (recorded / eligible nights)
- 4-metric mini grid (avg sleep, efficiency, latency, regularity)
- Bedtime + wake time cards with variability (± minutes)
- Reminder completion (if active reminders exist)
- Interpretation section: strongest positive pattern + area to observe
- Week navigation (prev/next, can't go beyond current week)

### Weekly Focus Card

Rule-based suggestion for what to focus on this week. Categories in priority order:

1. **Baseline building** — < 3 records (just start recording)
2. **Recording consistency** — < 50% completion (build the habit of recording)
3. **Wake time consistency** — high wake SD + low efficiency (anchor your morning)
4. **Bedtime observation** — high bedtime SD (notice when you actually go to bed)
5. **Reminder routine** — low habit consistency (stick with your reminders)
6. **Maintenance** — good efficiency + regularity (keep doing what's working)

User actions:

- **Accept** — saves as "accepted", card shows confirmation
- **Save** — bookmarks for later
- **Dismiss** — hides for the week

All actions stored locally in `somna.weekly-focus.v1` localStorage key.

## Components

| Component               | Path                                                 |
| ----------------------- | ---------------------------------------------------- |
| `MetricCard`            | `src/components/analytics/MetricCard.tsx`            |
| `TrendRangeSelector`    | `src/components/analytics/TrendRangeSelector.tsx`    |
| `SleepChart`            | `src/components/analytics/SleepChart.tsx`            |
| `InsightCard`           | `src/components/analytics/InsightCard.tsx`           |
| `InsightSection`        | `src/components/analytics/InsightSection.tsx`        |
| `WeeklySummary`         | `src/components/analytics/WeeklySummary.tsx`         |
| `WeeklyFocusCard`       | `src/components/analytics/WeeklyFocusCard.tsx`       |
| `WeeklyReflectionFlow`  | `src/components/analytics/WeeklyReflectionFlow.tsx`  |
| `DataSufficiencyBanner` | `src/components/analytics/DataSufficiencyBanner.tsx` |

Barrel export: `src/components/analytics/index.ts`

## Accessibility

- All interactive elements have `aria-label` or visible text
- Insight cards use `<article>` with `aria-labelledby`
- "Show details" toggles use `aria-expanded` + `aria-controls`
- Progress bars have `role="progressbar"` with `aria-valuenow/min/max`
- Color is never the sole indicator of state (icons + text labels)
- Keyboard-navigable throughout (tab order, Enter/Space activation)

## Localization

All 5 app locales supported:

- English (`en`) — canonical
- Spanish (`es`)
- Portuguese (Brazil) (`pt`)
- Polish (`pl`)
- German (`de`)

Translation files: `src/locales/analytics/{lang}.ts` (~180 keys each)

## Performance

- All analytics computations are memoized via `useMemo` in the hook
- Recharts animation is active but lightweight (<900ms)
- No re-computation on unrelated state changes
- All calculations are O(n) or O(n log n) — acceptable even for 90 days of data

## Non-goals

- ❌ Replace existing dashboard sections
- ❌ Real-time streaming analytics
- ❌ Server-side rendering of computed metrics (data is localStorage-only)
- ❌ PDF export or printable reports
