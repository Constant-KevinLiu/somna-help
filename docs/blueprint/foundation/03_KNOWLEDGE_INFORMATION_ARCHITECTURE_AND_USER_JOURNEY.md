# 03_KNOWLEDGE_INFORMATION_ARCHITECTURE_AND_USER_JOURNEY.md

# PAS-03 Knowledge, Information Architecture & User Journey

### Product Architecture Specification

> Defines how knowledge, navigation, content and user journeys are organized across the Somna platform.

---

# Architecture Metadata

| Field        | Value                  |
| ------------ | ---------------------- |
| Blueprint ID | PAS-03                 |
| Layer        | Layer 1 – Foundation   |
| Status       | Canonical              |
| Version      | 2.0                    |
| Depends On   | PAS-00, PAS-01, PAS-02 |
| Required By  | PAS-04 ~ PAS-12        |

---

# Part A — Domain Foundation

## 1. Purpose

PAS-03 establishes the information architecture of Somna. It defines how users discover, understand and progress through the product.

## 2. Scope

This specification governs:

- Navigation
- Knowledge architecture
- Learning organization
- User journeys
- Content hierarchy
- Discoverability

## 3. Information Principles

- Learning before optimization
- Clarity before density
- Progressive disclosure
- Consistent navigation
- One concept, one canonical location
- Search-friendly architecture

## 4. Canonical Information Domains

- Home
- Assessment
- Sleep Diary
- Reflection
- Learning
- Sleep Tools
- Progress
- Settings

## 5. Canonical User Journey

```text
Discover
    ↓
Understand
    ↓
Assess
    ↓
Record
    ↓
Reflect
    ↓
Learn
    ↓
Practice
    ↓
Improve
```

## 6. Navigation Responsibilities

Each section should have a single primary purpose.

| Section    | Primary Responsibility      |
| ---------- | --------------------------- |
| Home       | Orientation                 |
| Assessment | Self-evaluation             |
| Diary      | Behavioral recording        |
| Reflection | Personal insights           |
| Learn      | Evidence-informed education |
| Tools      | Practical calculators       |
| Progress   | Long-term trends            |
| Settings   | Identity & privacy          |

---

# Part B — Runtime Architecture

## Navigation Model

```text
Home
├── Assessment
├── Diary
├── Reflection
├── Learn
├── Tools
├── Progress
└── Settings
```

## Knowledge Architecture

Educational content should be organized by topic rather than publication date.

Knowledge hierarchy:

```text
Topic
    ↓
Guide
    ↓
Lesson
    ↓
Reference
```

## Runtime Quality Gates

Navigation should be:

- Predictable
- Consistent
- Accessible
- Mobile-first
- Searchable
- Localizable

No page should exist without a clear architectural owner.

---

# Part C — Governance

## Architecture Invariants

- One concept has one canonical location.
- Navigation reflects behavioral progression.
- Learning content remains evidence-informed.
- URLs should remain stable whenever possible.

## Future Evolution

Future additions should integrate into the existing information hierarchy instead of creating parallel structures.

## Revision History

### Version 2.0

- Upgraded from Information Architecture to enterprise PAS.
- Added knowledge architecture.
- Added canonical user journey.
- Added navigation governance.

---

**End of PAS-03**
