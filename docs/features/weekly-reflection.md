# Weekly Reflection

Guided weekly reflection with rule-selected prompts and user-owned storage. Part of Sleep Diary v2.4 (Phase F).

## Overview

Weekly Reflection is a structured journaling tool that helps users review their sleep week. It combines data-informed prompts with open-ended reflection to build self-awareness — a core CBT-I principle.

Reflections are **100% user-owned**: stored locally in the browser, never sent to any server, editable and deletable at any time.

## How It Works

1. **Rule-selected prompts** — based on the user's sleep data, the app selects 3-4 relevant prompts from a pool of 10
2. **Guided flow** — user goes through prompts one at a time, can skip any
3. **Auto-saved locally** — responses saved to localStorage
4. **Editable anytime** — users can revisit, edit, or delete past reflections

## Prompt Categories

8 categories, 10 total prompts:

| Category                  | Prompt                                                             | Condition                                |
| ------------------------- | ------------------------------------------------------------------ | ---------------------------------------- |
| **wins**                  | What went well this week with your sleep?                          | Always shown                             |
| **next_week_observation** | What's one thing you'd like to observe about your sleep next week? | Always shown                             |
| **schedule_pattern**      | Have you noticed a pattern in when you go to bed or wake up?       | High bedtime variability                 |
| **energy_pattern**        | How has your energy been on days after better sleep?               | Good efficiency + variable sleep         |
| **wind_down**             | What helps you wind down before bed?                               | High SOL or variable bedtime             |
| **barrier**               | What made it hard to stick with your sleep routine this week?      | Low completion or declining trend        |
| **progress**              | How is your sleep different from when you started?                 | 14+ records with positive trend          |
| **gratitude**             | What are you grateful for right now?                               | Good week (high efficiency + regularity) |
| **body_signals**          | What physical cues tell you it's time for bed?                     | Low regularity                           |
| **self_compassion**       | What would you tell a friend with your sleep pattern?              | Declining or difficult week              |

### Selection Rules

- **Always include**: `wins` + `next_week_observation`
- **Add 1-2 adaptive prompts** based on strongest data signal
- If data is insufficient (< 3 records), show only the always-include prompts plus `wind_down`
- If week is going well, add `gratitude` or `progress`
- If week is struggling, add `barrier` or `self_compassion`
- If schedule is irregular, add `schedule_pattern` or `body_signals`
- Maximum 4 prompts total

## User Experience

### Flow

```
┌─────────────────────────────────┐
│ Weekly Reflection               │
│ A few minutes to look back.     │
│                                 │
│ 2 / 4  ·  42 words              │
│                                 │
│ ┌───────────────────────────┐   │
│ │ What went well this week? │   │
│ │                           │   │
│ │ [text area]               │   │
│ └───────────────────────────┘   │
│                                 │
│ ◀ Previous    Skip ▶           │
│                                 │
│                    [ Save ]     │
└─────────────────────────────────┘
```

### Saved View

After saving, users see all their responses displayed clearly, with:

- Word count
- Edit button (returns to edit mode)
- Delete button (with confirmation)

## Data Model

```ts
interface WeeklyReflection {
  id: string; // UUID-ish
  weekStart: string; // YYYY-MM-DD (Monday)
  weekEnd: string; // YYYY-MM-DD (Sunday)
  timezone: string; // e.g. "Asia/Shanghai"
  locale: string; // en/es/pt/pl/de
  responses: WeeklyReflectionResponse[];
  wordCount: number;
  createdAt: string; // ISO timestamp
  updatedAt: string;
  syncStatus: "local" | "synced" | "pending" | "conflict";
}

interface WeeklyReflectionResponse {
  promptId: string;
  category: WeeklyReflectionPromptCategory;
  content: string;
}
```

## Storage

**Key**: `somna.weekly-reflections.v1`

**Structure**:

```ts
{
  version: "1",
  reflections: WeeklyReflection[]
}
```

**Safety**:

- Loaded via `safeLocalStorageGet` with defensive validation
- Malformed entries silently dropped
- Empty fallback returned if storage is corrupt
- All operations are try/catch wrapped

**Storage limits**:

- No hard cap, but each reflection is ~1-2 KB
- Even 52 weeks/year × 5 years = < 1 MB total
- localStorage quota (5-10 MB) is not a concern

## Privacy

- Reflections never leave the user's device
- No telemetry, no analytics, no cloud sync (by design)
- User can delete individual reflections or all at any time
- Data is only as safe as the user's browser storage — appropriate for personal reflection, not sensitive medical records

## Implementation

| Module                    | Path                                                |
| ------------------------- | --------------------------------------------------- |
| Types                     | `src/lib/weekly-reflection/types.ts`                |
| Prompts & selection rules | `src/lib/weekly-reflection/prompts.ts`              |
| Storage                   | `src/lib/weekly-reflection/storage.ts`              |
| UI Component              | `src/components/analytics/WeeklyReflectionFlow.tsx` |

### Storage API

```ts
import {
  loadWeeklyReflections,
  saveWeeklyReflection,
  deleteWeeklyReflection,
  getWeeklyReflectionByWeek,
  generateWeeklyReflectionId,
  calculateWordCount,
  getLocalTimezone,
} from "@/lib/weekly-reflection/storage";
```

### Prompt Selection

```ts
import { selectWeeklyPrompts } from "@/lib/weekly-reflection/prompts";

const prompts = selectWeeklyPrompts(weekRecords, habitProgress, weekStartStr);
// Returns 3-4 WeeklyReflectionPrompt[]
```

## Relationship to Diary Reflection

Weekly Reflection is separate from the existing daily diary reflection feature:

|              | Daily Reflection                 | Weekly Reflection                      |
| ------------ | -------------------------------- | -------------------------------------- |
| **Cadence**  | Per-day, optional field          | Per-week, structured flow              |
| **Context**  | Tied to a specific night's sleep | Big-picture review                     |
| **Prompts**  | Single free-text note            | 3-4 guided, adaptive prompts           |
| **Storage**  | Part of `SleepRecord`            | Separate `somna.weekly-reflections.v1` |
| **Use case** | Quick note about the night       | Self-awareness building                |

## Non-goals

- ❌ AI-generated reflection questions (all prompt selection is rule-based)
- ❌ Sentiment analysis of responses
- ❌ Cloud sync or sharing
- ❌ Prompt customization by users
- ❌ Reminders to do weekly reflection (may be added later via the habit engine)
- ❌ Streaks for reflection completion (intentional — no gamification of journaling)
