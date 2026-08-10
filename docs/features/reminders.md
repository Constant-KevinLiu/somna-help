# Reminders & Habit Engine

A complete reminder and habit-formation system for Somna that helps users build consistent sleep habits.

## Overview

The Reminder & Habit Engine provides:

- **Reminder Creation** - Create custom reminders with flexible scheduling
- **In-App Delivery** - Prominent reminder dialog shown while app is open
- **Browser Notifications** - Optional browser notifications (with user permission)
- **Habit Progress Tracking** - Streaks, consistency rate, completion counting
- **Sleep Diary Integration** - Diary entries auto-complete matching reminders
- **Multi-Tab Coordination** - Prevents duplicate delivery across browser tabs

## Architecture

### Core Services

```
src/services/habit/
├── habit-types.ts            # Domain model definitions
├── habit-storage.ts          # localStorage persistence layer
├── habit-scheduler.ts        # Scheduling & occurrence generation
├── habit-events.ts           # Event logging & history
├── habit-progress.ts         # Habit metrics calculation
├── habit-delivery.ts         # Delivery orchestration
└── notification-service.ts   # Browser notification handling
```

### React Hooks

```
src/hooks/
├── useReminders.ts           # Reminder CRUD + actions
└── useHabitProgress.ts       # Progress calculation hooks
```

### Components

```
src/components/reminder/
├── ReminderList.tsx          # Reminder list + management UI
├── ReminderForm.tsx          # Create/edit reminder form
├── InAppReminder.tsx         # In-app reminder dialog
├── HabitProgressCard.tsx     # Progress display widget
└── NotificationPermission.tsx  # Browser notification settings
```

### Routes

- `/reminders` - Main reminders dashboard

## Domain Model

### Reminder

```typescript
interface Reminder {
  id: string;
  ownerId: string;
  habitId?: string;
  title: string;
  message?: string;
  status: "active" | "paused" | "archived";
  channels: ReminderChannel[]; // "in_app" | "browser_notification"
  schedule: ReminderSchedule;
  timezone: string;
  snoozeOptionsMinutes: number[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  relatedAction?: "diary_morning" | "diary_evening" | "wind_down" | "relaxation";
}
```

### Reminder Schedule

```typescript
interface ReminderSchedule {
  type: "daily" | "weekdays";
  time: string; // HH:MM format
  days?: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD (optional)
}
```

### Occurrence States

```typescript
type ReminderOccurrenceStatus =
  | "scheduled" // Not yet due
  | "due" // Currently due
  | "delivered" // Shown to user
  | "completed" // User marked as done
  | "snoozed" // User snoozed
  | "dismissed" // User dismissed
  | "missed" // Not resolved in time
  | "cancelled" // Reminder paused/archived
  | "completed_by_related_action"; // Auto-completed by diary entry
```

## Delivery Flow

```text
Reminder Created
    ↓
Occurrence Generated (7 days ahead)
    ↓
Occurrence Becomes Due
    ↓
Delivery Eligibility Check
    ├─ Is reminder active?
    ├─ Has occurrence already been delivered?
    └─ Within quiet hours?
    ↓
Channel Selection & Delivery
    ├─ In-App Dialog (always available)
    └─ Browser Notification (if permission granted)
    ↓
User Action Received
    ├─ Complete → Log event + Update progress
    ├─ Snooze → Reschedule occurrence
    └─ Dismiss → Log dismissal
```

## Habit Progress Metrics

### Consistency Rate

```
Completed Occurrences / Total Eligible Occurrences
```

### Current Streak

Consecutive days with at least one completed reminder.

### Longest Streak

Historical maximum streak achieved.

### Total Completions

Count of all completed occurrences.

## Multi-Tab Coordination

Uses:

1. **BroadcastChannel API** - Notify other tabs of delivery
2. **LocalStorage Locks** - Prevent duplicate concurrent delivery
3. **Custom Events** - Cross-tab state synchronization

## Browser Notification Limitations

### Current Capabilities

- ✅ Works while browser is open and tab is active
- ✅ Works across tabs (one tab can trigger all)
- ✅ Privacy-first (no sensitive content in notification by default)

### Limitations

- ❌ No background delivery when browser is closed
- ❌ No push notifications from server
- ❌ iOS Safari has stricter notification policies
- ❌ Requires user permission (explicit gesture required)

### Privacy Features

1. **Default Generic Text** - "Somna reminder: Your check-in is ready"
2. **Opt-In Sensitive Content** - User must enable custom text
3. **No External Servers** - All notifications are client-side only

## Sleep Diary Integration

When a user saves a diary entry, the system:

1. Finds all active reminders with `relatedAction` matching diary type
2. Looks for any due or recently due occurrences
3. Marks occurrences as `completed_by_related_action`
4. Updates habit progress accordingly

This creates a seamless experience where the user's actual behavior reinforces their habit tracking.

## Future Enhancements

### Web Push Notifications (Service Worker)

- Add service worker registration
- Implement VAPID key authentication
- Server-side delivery via Cloudflare Cron
- Subscription storage & cleanup

### Advanced Scheduling

- Bi-weekly patterns
- Reminder windows (not just fixed times)
- Intelligent scheduling based on sleep data

### Habit Insights

- Correlation between reminder completion and sleep metrics
- Personalized reminder recommendations
- Adaptive difficulty

### Integration Points

- Program lesson reminders
- Relaxation practice reminders
- Sleep restriction schedule reminders
