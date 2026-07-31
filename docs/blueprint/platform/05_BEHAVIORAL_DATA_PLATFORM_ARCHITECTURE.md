# 05_BEHAVIORAL_DATA_PLATFORM_ARCHITECTURE.md

# PAS-05 Behavioral Data Platform Architecture
### Product Architecture Specification

> Defines the canonical behavioral data model, lifecycle, ownership and governance that power the entire Somna platform.

---

# Architecture Metadata

| Field | Value |
|---|---|
| Blueprint ID | PAS-05 |
| Layer | Layer 2 – Platform |
| Status | Canonical |
| Version | 2.0 |
| Depends On | PAS-00, PAS-01, PAS-02, PAS-04 |
| Required By | PAS-06 ~ PAS-12 |

---

# Part A — Domain Foundation

## 1. Purpose

PAS-05 defines the Behavioral Data Platform, the single source of truth for all user-recorded sleep behaviors, reflections and derived metrics.

All downstream modules consume this platform but do not own it.

---

## 2. Scope

The Behavioral Data Platform governs:

- Sleep Diary
- Guided Reflection
- Behavioral Metrics
- Sleep Trends
- Data Versioning
- Behavioral History
- Behavioral Analytics Foundation

---

## 3. Canonical Behavioral Domain Model

```text
Behavior Record
│
├── Sleep Session
│     ├── Bed Time
│     ├── Sleep Attempt
│     ├── Sleep Latency
│     ├── Night Awakenings
│     ├── Wake After Sleep Onset
│     ├── Final Wake Time
│     ├── Out of Bed
│     └── Notes
│
├── Reflection
│     ├── Mood
│     ├── Stress
│     ├── Energy
│     └── Personal Notes
│
└── Derived Metrics
      ├── Total Sleep Time
      ├── Time in Bed
      ├── Sleep Efficiency
      ├── Sleep Regularity
      └── Trend Indicators
```

---

## 4. Behavioral Lifecycle

```text
Create
   ↓
Draft
   ↓
Save
   ↓
Validate
   ↓
Version
   ↓
Sync
   ↓
Archive
   ↓
Export
   ↓
Delete
```

---

## 5. Architecture Principles

- Record before interpretation.
- Observation before recommendation.
- Derived data never replaces source data.
- Every behavioral event is traceable.
- Historical records remain immutable.

---

## 6. Architecture Invariants

The following rules must always remain true:

- Raw observations are canonical.
- Reflection never overwrites observations.
- Metrics are reproducible.
- AI never modifies behavioral records.
- Every record has a single owner.
- Behavioral history is preserved.

---

## 7. Responsibilities

| Domain | Responsibility |
|---|---|
| Diary | Record behavior |
| Reflection | Capture interpretation |
| Metrics Engine | Calculate metrics |
| Dashboard | Display metrics |
| AI | Explain patterns |
| Export | User data portability |

---

# Part B — Runtime Architecture

## Runtime Pipeline

```text
User Input
      ↓
Validation
      ↓
Behavior Store
      ↓
Metric Calculation
      ↓
Trend Analysis
      ↓
Dashboard
      ↓
AI Explanation
```

---

## Behavioral State Machine

```text
Draft
   ↓
Saved
   ↓
Validated
   ↓
Synced
   ↓
Archived
```

---

## Data Ownership

| Data Type | Owner |
|---|---|
| Sleep Session | Behavioral Platform |
| Reflection | Behavioral Platform |
| Metrics | Metrics Engine |
| Dashboard Data | Dashboard |
| AI Summary | Intelligence Platform |

---

## Consumer Matrix

| Consumer | Read | Write |
|---|:---:|:---:|
| Diary | ✓ | ✓ |
| Reflection | ✓ | ✓ |
| Dashboard | ✓ | |
| Habit Engine | ✓ | |
| AI | ✓ | |
| Export | ✓ | |

Only the Behavioral Platform owns canonical records.

---

## Runtime Quality Gates

Every behavioral feature must:

- Preserve historical integrity.
- Maintain deterministic metrics.
- Be exportable.
- Be recoverable.
- Support synchronization.
- Respect privacy constraints.

---

# Part C — Governance

## AI Readiness

AI may:

- Read
- Summarize
- Correlate
- Explain

AI must not:

- Edit diary records
- Delete history
- Fabricate observations
- Rewrite user reflections

---

## Constitutional Fitness Functions

The Behavioral Platform should continuously satisfy:

- Single Source of Truth
- Offline-first recording
- Deterministic metric calculation
- Version traceability
- Data portability
- Explainable AI
- Immutable history

---

## Future Evolution

Future extensions may include:

- Wearable integration
- Passive sensing
- Adaptive habit scoring
- Personalized behavioral coaching

These capabilities must preserve canonical behavioral ownership.

---

## Revision History

### Version 2.0

- Renamed from Sleep Diary Architecture.
- Elevated to Behavioral Data Platform.
- Introduced Canonical Behavioral Domain Model.
- Added Consumer Matrix.
- Added Runtime Pipeline.
- Added Architecture Invariants.
- Added AI Readiness.

---

**End of PAS-05**
