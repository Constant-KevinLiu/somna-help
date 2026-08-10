# 01_FOUNDATION_AND_PRODUCT_BOUNDARIES.md

# PAS-01 Foundation & Product Boundaries

### Product Architecture Specification

> Defines what Somna is, what it is not, and the architectural boundaries that govern all downstream decisions.

---

# Architecture Metadata

| Field        | Value                |
| ------------ | -------------------- |
| Blueprint ID | PAS-01               |
| Layer        | Layer 1 – Foundation |
| Status       | Canonical            |
| Version      | 2.0                  |
| Depends On   | PAS-00               |
| Required By  | PAS-02 ~ PAS-12      |

---

# Part A — Domain Foundation

## 1. Purpose

PAS-01 establishes the permanent scope and product boundaries of Somna. It defines the platform's responsibilities, intended users, and explicit exclusions.

## 2. Scope

Somna is a digital platform for self-guided behavioral sleep improvement inspired by CBT-I principles.

Core capabilities include:

- Sleep behavior recording
- Guided reflection
- Habit formation
- Educational content
- Privacy-preserving analytics
- Responsible AI assistance

## 3. Goals

- Deliver trustworthy behavioral support.
- Build sustainable sleep habits.
- Keep user data under user control.
- Enable long-term architectural evolution.

## 4. Non-goals

Somna does not aim to:

- Diagnose disease.
- Replace licensed healthcare professionals.
- Provide emergency medical services.
- Maximize engagement through addictive mechanics.

## 5. Target Users

Primary:

- Adults seeking better sleep habits.
- Individuals experiencing occasional or persistent insomnia symptoms.

Secondary:

- Health-conscious users tracking sleep behavior.
- Users following structured CBT-I style programs.

## 6. Product Boundaries

Included:

- Journaling
- Reflection
- Education
- Calculators
- Habit support
- Progress tracking

Excluded:

- Prescription management
- Clinical diagnosis
- Telemedicine
- Medical record systems

## 7. Design Principles

- Behavior-first
- Calm user experience
- Privacy-first
- Evidence-informed
- Accessibility by default
- Progressive enhancement

## 8. Responsibilities

Somna MUST:

- Preserve canonical behavioral records.
- Explain generated insights.
- Support export and deletion.
- Maintain architectural consistency.

---

# Part B — Runtime Architecture

## Runtime Overview

The platform is organized around five core domains.

```text
Identity
    ↓
Behavior
    ↓
Habit
    ↓
Intelligence
    ↓
Experience
```

## Platform Components

- Identity Platform
- Behavioral Data Platform
- Habit Engine
- Intelligence Platform
- Learning & Content
- Privacy Platform

## Dependency Rules

- Higher layers may depend on lower layers.
- Foundation depends only on PAS-00.
- Circular dependencies are prohibited.

## Runtime Quality Gates

Every new feature must:

- Respect PAS-00.
- Stay within declared product boundaries.
- Preserve user ownership.
- Avoid creating new architectural coupling without review.

---

# Part C — Governance

## Governance Principles

All downstream PAS documents inherit the principles defined in PAS-00.

## Architecture Invariants

- Product scope remains behavior-centered.
- User trust has higher priority than feature velocity.
- Privacy requirements cannot be relaxed for convenience.
- Canonical records remain the single source of truth.

## Future Evolution

Future expansion may include:

- Wearable integrations
- AI coaching
- Research participation
- Clinician collaboration

These extensions must remain compatible with PAS-00 and PAS-01.

## Revision History

### Version 2.0

- Rewritten using the enterprise PAS template.
- Separated constitutional principles into PAS-00.
- Refocused PAS-01 on scope and boundaries.

---

**End of PAS-01**
