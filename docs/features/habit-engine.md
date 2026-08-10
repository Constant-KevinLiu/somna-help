# Habit Engine

The Habit Engine is the core system that tracks and reinforces healthy sleep habits in Somna.

## Design Principles

### 1. Non-Judgmental

A missed reminder is just data, not a moral failure. The UI uses gentle, encouraging language.

### 2. Privacy-First

- All habit data stays in localStorage
- Browser notifications use generic text by default
- No sensitive sleep details exposed in notifications

### 3. Graceful Degradation

- In-app reminders always work
- Browser notifications are optional enhancement
- No dependency on external services

### 4. Deterministic

Progress calculations are pure functions:

- Same input → Same output
- Fully testable
- No hidden state or randomness

## Habit State Machine

```text
               ┌───────────┐
               │ Candidate │  ← User expressed interest
               └─────┬─────┘
                     │
                     ▼
               ┌───────────┐
               │  Planned  │  ← Reminder created but no completions
               └─────┬─────┘
                     │
                First completion
                     │
                     ▼
               ┌───────────┐
               │  Active   │  ← Building momentum
               └─────┬─────┘
                     │
          21 days + 80% consistency
                     │
                     ▼
               ┌───────────┐
               │ Maintained│  ← Well-established habit
               └───────────┘

Additional transitions:

Active ←→ Paused     (User takes break)
Planned → Archived   (User removes reminder)
Active → Archived    (User removes reminder)
```

## Streak Calculation

### Algorithm

1. Group completions by calendar day (in user's timezone)
2. Count consecutive days with at least one completion
3. A missed day breaks the streak (but pause days don't)
4. Gaps during reminder pause preserve streak

### Example

```
Day 1: Complete ✓
Day 2: Complete ✓
Day 3: Missed    ✗
Day 4: Complete ✓

Current Streak: 1
Longest Streak: 2
```

## Consistency Rate

### Definition

```
Consistency Rate =
  Completed Occurrences / Total Eligible Occurrences
```

### Eligibility Rules

An occurrence is eligible if:

1. It was scheduled (not cancelled)
2. The reminder was active at the time
3. The due date has passed

### Exclusions

- Cancelled occurrences (reminder paused/archived)
- Paused periods (not counted as misses)
- Future scheduled occurrences

## Event Sourcing

All habit state changes are recorded as immutable events:

| Event Type  | Trigger                |
| ----------- | ---------------------- |
| `created`   | Reminder created       |
| `updated`   | Reminder edited        |
| `scheduled` | Occurrence generated   |
| `delivered` | Reminder shown to user |
| `completed` | User marked complete   |
| `snoozed`   | User snoozed           |
| `dismissed` | User dismissed         |
| `missed`    | Not resolved in time   |
| `paused`    | Reminder paused        |
| `resumed`   | Reminder resumed       |
| `archived`  | Reminder archived      |

### Benefits

1. **Audit Trail** - Full history of user behavior
2. **Recalculation** - Progress can be recomputed from events
3. **Debugging** - Easy to trace how state was reached
4. **Future Analytics** - Can answer questions not anticipated yet

## Integration Patterns

### 1. Diary → Habit (Reinforcement)

When user completes a diary entry:

- Find matching morning/evening reminders
- Auto-complete any due occurrences
- Update progress metrics

### 2. Habit → Dashboard (Motivation)

Dashboard displays:

- Current streaks
- Consistency rates
- Progress toward habit milestones
- Quick access to reminder settings

### 3. Habit → Program (Personalization)

Future:

- Adjust program pace based on habit adherence
- Suggest reminders based on program phase
- Personalize recommendations

## Testing Strategy

### Unit Tests (Pure Functions)

```typescript
// Scheduling
getNextOccurrenceDate(schedule, timezone, after);

// Progress
calculateCurrentStreak(completionDays, timezone, now);
calculateConsistencyRate(completions, opportunities);

// Event handling
processMissedReminders(gracePeriod);
```

### Integration Tests (State + Effects)

```typescript
// Complete flow
createReminder()
generateOccurrences()
deliverDueReminders()
completeOccurrence()
expect(progress).toMatch(...)

// Diary integration
saveDiaryEntry()
expect(occurrence.status).toBe("completed_by_related_action")
```

### Edge Cases

- Timezone changes mid-streak
- Multiple tabs open simultaneously
- Reminder edited while occurrence is due
- Reminder paused while snoozed
- Clock manipulation by user
- Offline period followed by reconnect

## Performance Considerations

### Occurrence Generation

- Generate 7 days ahead by default
- Batch generate on app start
- Incrementally generate as time passes

### Event Pruning

- Keep events for 90 days by default
- Older events pruned from localStorage
- Progress metrics preserved independently

### Polling Interval

- Check for due reminders every 30 seconds
- Also check on visibility change (tab becomes active)
- Check on app load (recover from offline)

## Privacy Guarantees

1. **Local Storage Only** - All habit data stays in user's browser
2. **No Sync by Default** - User must explicitly enable cloud sync
3. **Notification Privacy** - No sensitive sleep data in notifications
4. **Exportable** - User can export all their habit data
5. **Deletable** - User can wipe all habit data at any time

## Future Evolution

### Phase E2 - Enhanced Metrics

- Habit heatmap visualization
- Best/worst performing times
- Completion time variance analysis
- Correlation with sleep metrics

### Phase F - Adaptive System

- Intelligent reminder time suggestions
- Adaptive difficulty based on performance
- Habit stacking suggestions
- Social accountability features (optional)

### Phase G - Clinical Integration

- Reminder adherence reports for clinicians
- CBT-I outcome correlation analysis
- Treatment adjustment recommendations
