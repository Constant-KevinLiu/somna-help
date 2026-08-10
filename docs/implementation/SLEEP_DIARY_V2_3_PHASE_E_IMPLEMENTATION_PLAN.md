# Sleep Diary v2.3 — Phase E Implementation Plan

## Repository Architecture Discovered

### Current Architecture Summary

**1. Persistence Layer**

- Primary: `localStorage` with defensive patterns (SSR guard, try/catch recovery, validation)
- Cloud Sync: Cloudflare D1 database via `/api/sync` endpoint
- Sync mechanism: Offline queue with exponential backoff, conflict resolution
- Data keys: `sleepRecords`, `reflections`, `reminderSettings`, `programProgress`

**2. Existing Reminder System**

- Email-only reminder system (Cloudflare Worker cron — `*/15 * * * *`)
- Types: `ReminderSettings`, `ReminderPayload`, `ReminderProvider`
- Storage: `reminder-storage.ts` (localStorage) + `reminder-storage-server.ts` (D1)
- Limited to morning/evening/weekly email reminders

**3. State Management**

- React Context + localStorage pattern (no Zustand/Redux)
- Custom events for cross-tab reactivity
- `useSession.tsx` for auth context

**4. PWA Status**

- Web manifest available (`public/site.webmanifest`)
- **No Service Worker implemented**
- **No Web Push infrastructure**

**5. Localization**

- Languages: en, zh, es, pt, pl, de
- Dictionary pattern: `Record<string, string>` via `useI18n()` hook
- Date/time formatting utilities in `src/lib/format.ts` and `src/lib/i18n.tsx`

**6. Design System**

- Radix UI + shadcn/ui components
- Tailwind CSS v4 with custom color palette
- Key components: `card`, `button`, `dialog`, `switch`, `select`, `toast`, `TimeWheelPicker`

**7. Testing**

- Pure function unit tests exist (`.test.ts` files)
- No test runner configured in package.json
- TypeScript strict mode + ESLint as quality gates

---

## Files Expected to Change

### New Files (Core Services)

```
src/services/habit/
├── habit-types.ts           # Domain models: Reminder, Occurrence, Event, HabitProgress
├── habit-storage.ts         # localStorage persistence for reminders/events
├── habit-scheduler.ts       # Scheduling engine (next occurrence, range calculation)
├── habit-delivery.ts        # Delivery decision engine
├── habit-events.ts          # Event append-only store
├── habit-progress.ts        # Habit metrics calculation
└── notification-service.ts  # Browser notification permission & delivery

src/hooks/
├── useReminders.ts          # Reminder management hook
├── useHabitProgress.ts      # Habit progress hook
└── useNotificationPermission.ts  # Permission state hook

src/routes/
└── reminders.tsx            # Reminder list & management page

src/components/reminder/
├── ReminderList.tsx         # Reminder list component
├── ReminderForm.tsx         # Create/edit reminder form
├── ReminderCard.tsx         # Individual reminder display
├── InAppReminder.tsx        # In-app reminder overlay/dialog
├── HabitProgressCard.tsx    # Habit progress summary
└── NotificationPermission.tsx  # Permission request UI
```

### Modified Files

```
# Existing reminder system extension
src/services/reminder/reminder-types.ts      # Extend types for in-app/browser channels
src/services/reminder/reminder-storage.ts    # Integrate with new habit storage

# Localization (add new keys)
src/lib/i18n.tsx                             # English dictionary
src/lib/i18n-pl-dict.ts                      # Polish dictionary
src/services/i18n/de/                        # German dictionary
src/locales/es.ts                            # Spanish dictionary
src/locales/pt.ts                            # Portuguese dictionary

# App layout integration
src/routes/__root.tsx                        # Add in-app reminder provider
src/components/Header.tsx                    # Add reminder status indicator
src/routes/dashboard.tsx                     # Add habit progress widget

# Sleep Diary integration
src/routes/diary.tsx                         # Hook into diary save events
```

---

## Data Migration Requirements

### Migration 1: Reminder Settings → New Reminder System

Existing `reminderSettings` (email reminders) should be preserved but separate from new in-app reminders.

**Strategy:**

1. Keep existing `reminderSettings` key unchanged for email functionality
2. Create new storage keys: `habitReminders`, `reminderOccurrences`, `reminderEvents`
3. No automatic migration — email and in-app reminders are separate systems
4. User can configure both independently

### Migration 2: Storage Key Isolation

```
# New keys (separate from canonical sleep diary):
- habitReminders       # Reminder definitions
- reminderOccurrences  # Scheduled/delivered occurrences
- reminderEvents       # Append-only event log
- notificationPrefs    # Browser notification preferences
```

**Rationale:** Follows PAS-08 — keep notification permission data separate from sleep diary content.

---

## Browser Notification Limitations

### Current Capabilities

1. **Level 1 (In-App):** ✅ Fully implementable
   - Works while app is open
   - Uses `setInterval` + visibilitychange events
   - Recovery on page reload

2. **Level 2 (Browser Notifications):** ✅ Implementable with safeguards
   - Requires explicit user permission (no auto-prompt)
   - Only works while tab is open (no Service Worker = no background)
   - Permission states: `default`, `granted`, `denied`

3. **Level 3 (Background Web Push):** ❌ Not possible
   - Missing: Service Worker
   - Missing: Push subscription handling
   - Missing: VAPID keys
   - Missing: Server-side push delivery
   - Missing: Secure subscription storage

### Documented Limitations

- **No closed-tab delivery:** Without Service Worker + Web Push, notifications only work while tab is open
- **Mobile browser variance:** iOS Safari has stricter notification policies
- **Multi-tab coordination:** Will use BroadcastChannel to prevent duplicate delivery
- **Browser quota limits:** localStorage quota (~5MB) is sufficient for reminder history

---

## True Background Push Delivery Status

**NOT CURRENTLY POSSIBLE**

Required infrastructure missing:

1. `sw.ts` — Service Worker registration and event handling
2. Push subscription management UI
3. VAPID key generation and storage
4. Server-side Web Push library integration
5. Subscription database with cleanup
6. Cron-based server-side schedule checker

**Recommendation:** Implement clean interfaces that allow Web Push to be added later without architectural changes.

---

## Implementation Sequence

### Phase E.1 — Foundation (Types & Storage)

1. Create domain models (`habit-types.ts`)
2. Create localStorage persistence (`habit-storage.ts`)
3. Create event store (`habit-events.ts`)
4. Add storage migration utilities

### Phase E.2 — Scheduling Engine

1. Implement `ReminderScheduler` (next occurrence, range queries)
2. Implement timezone handling
3. Implement duplicate occurrence prevention
4. Unit tests for scheduling logic

### Phase E.3 — Delivery System

1. Implement delivery decision rules
2. Level 1: In-app delivery
3. Level 2: Browser notification service (with permission flow)
4. Multi-tab coordination (BroadcastChannel)
5. Recovery mechanism on page load

### Phase E.4 — Habit Progress Calculation

1. Implement consistency rate
2. Implement streak calculation
3. Implement opportunity counting
4. Unit tests for all metrics

### Phase E.5 — User Interface

1. Reminder list page
2. Create/edit reminder form
3. In-app reminder dialog
4. Habit progress card
5. Notification permission UI
6. Integrate with Dashboard

### Phase E.6 — Sleep Diary Integration

1. Diary save → reminder resolution hook
2. Explicit mapping rules documentation
3. No automatic diary creation from reminders

### Phase E.7 — Localization & Accessibility

1. Add i18n keys for all languages
2. Keyboard navigation
3. Screen reader announcements
4. Reduced motion support

### Phase E.8 — Testing & Documentation

1. Unit tests for pure functions
2. Integration tests for reminder flow
3. Update documentation (`docs/features/reminders.md`, `docs/features/habit-engine.md`)
4. Build/type-check/lint verification

---

## Interface Extension Points for Future Web Push

```typescript
// Future provider can implement this same interface
interface ReminderChannel {
  id: "in_app" | "browser_notification" | "web_push";
  available(): boolean;
  deliver(reminder: Reminder, occurrence: ReminderOccurrence): Promise<DeliveryResult>;
}
```

Web Push can be added later without changing the core habit engine or scheduler.

---

## Risk Mitigation

| Risk                         | Mitigation                                 |
| ---------------------------- | ------------------------------------------ |
| localStorage quota exceeded  | Auto-prune old events (> 90 days)          |
| Multi-tab duplicate delivery | BroadcastChannel + idempotency keys        |
| Timezone changes             | Store all times in UTC + original timezone |
| Permission denied            | Graceful fallback to in-app only           |
| Missed reminders on reload   | Recalculate due occurrences on mount       |
| Clock manipulation           | Compare with server time on sync           |

---

**End of Implementation Plan**
