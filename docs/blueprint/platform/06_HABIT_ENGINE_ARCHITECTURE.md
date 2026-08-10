# 06_HABIT_ENGINE_ARCHITECTURE.md

# PAS-06 Habit Engine Architecture

### Product Architecture Specification

> Defines how Somna transforms behavioral records into sustainable sleep habits through evidence-informed habit formation, reminders and adaptive routines.

---

# Architecture Metadata

| Field        | Value                          |
| ------------ | ------------------------------ |
| Blueprint ID | PAS-06                         |
| Layer        | Layer 3 – Behavior System      |
| Status       | Canonical                      |
| Version      | 2.0                            |
| Depends On   | PAS-00, PAS-02, PAS-04, PAS-05 |
| Required By  | PAS-07 ~ PAS-12                |

---

# Part A — Domain Foundation

## 1. Purpose

The Habit Engine converts behavioral observations into repeatable healthy routines while respecting user autonomy and privacy.

The engine reinforces habits; it never forces compliance.

---

## 2. Scope

This specification governs:

- Habit plans
- Behavioral goals
- Reminder scheduling
- Routine tracking
- Streak calculation
- Habit scoring
- Adaptive reinforcement

---

## 3. Habit Formation Model

```text
Observe
    ↓
Understand
    ↓
Plan
    ↓
Practice
    ↓
Repeat
    ↓
Habit
```

---

## 4. Core Design Principles

- Consistency over intensity
- Gentle encouragement
- Small achievable actions
- User agency
- Explainable recommendations
- Positive reinforcement

---

## 5. Canonical Habit Model

```text
Habit
│
├── Goal
├── Routine
├── Reminder
├── Completion
├── Consistency
├── Streak
├── Confidence
└── Progress
```

---

## 6. Responsibilities

| Component             | Responsibility               |
| --------------------- | ---------------------------- |
| Habit Engine          | Habit lifecycle              |
| Reminder Engine       | Timely prompts               |
| Behavioral Platform   | Source observations          |
| Dashboard             | Progress visualization       |
| Intelligence Platform | Personalized recommendations |

---

## 7. Architecture Invariants

- Habits are derived from behavior.
- Reminders never modify behavioral records.
- Missing a reminder is not failure.
- Habit scores are reproducible.
- User may disable reminders at any time.

---

# Part B — Runtime Architecture

## Runtime Pipeline

```text
Behavior Recorded
        ↓
Pattern Detection
        ↓
Habit Opportunity
        ↓
Goal Creation
        ↓
Reminder Schedule
        ↓
Routine Completion
        ↓
Progress Update
```

---

## Reminder Lifecycle

```text
Create
   ↓
Schedule
   ↓
Notify
   ↓
Dismiss / Complete / Snooze
   ↓
Evaluate
   ↓
Adjust
```

---

## Consumer Matrix

| Consumer            | Read | Write |
| ------------------- | :--: | :---: |
| Behavioral Platform |  ✓   |       |
| Habit Engine        |  ✓   |   ✓   |
| Reminder Engine     |  ✓   |   ✓   |
| Dashboard           |  ✓   |       |
| AI                  |  ✓   |       |

---

## Runtime Quality Gates

Every habit feature must:

- Support personalization.
- Respect notification preferences.
- Avoid excessive reminders.
- Preserve user control.
- Be explainable.
- Be measurable.

---

# Part C — Governance

## AI Readiness

AI may:

- Suggest routines
- Recommend reminder timing
- Summarize consistency
- Explain trends

AI must not:

- Create mandatory habits
- Manipulate behavior
- Override user preferences
- Fabricate completions

---

## Future Evolution

Potential extensions:

- Adaptive reminder timing
- Circadian-aware scheduling
- Wearable-informed routines
- Multi-goal prioritization
- Seasonal habit adaptation

---

## Revision History

### Version 2.0

- Introduced Habit Engine as an independent platform domain.
- Separated habits from behavioral recording.
- Added reminder lifecycle.
- Added canonical habit model.
- Defined AI boundaries for habit support.

---

**End of PAS-06**
