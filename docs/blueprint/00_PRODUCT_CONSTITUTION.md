# 00_PRODUCT_CONSTITUTION.md

# Somna Product Constitution
### Product Architecture Specification (PAS-00)

> **The constitutional foundation of the Somna platform.**

---

## Architecture Metadata

| Field | Value |
|-------|-------|
| Blueprint ID | PAS-00 |
| Status | Canonical |
| Version | 2.0 |
| Layer | Layer 0 – Product Constitution |
| Owner | Product Architecture |
| Review Cycle | Quarterly |
| Applies To | PAS-01 ~ PAS-12 |
| Authority | Highest |

---

# 1. Purpose

This document defines the permanent constitutional principles governing the Somna platform.

PAS-00 establishes the architectural, product, clinical, privacy and governance foundations upon which every other PAS chapter is built.

No downstream architecture, implementation or feature may contradict this document.

---

# 2. Mission

Help people build healthier sleep behaviors through evidence-informed, privacy-first digital tools inspired by Cognitive Behavioral Therapy for Insomnia (CBT-I).

---

# 3. Vision

Become the world's most trusted self-guided behavioral sleep improvement platform by combining evidence-based guidance, thoughtful product design and responsible AI.

---

# 4. Core Values

- Science before opinion
- Behavior before features
- Privacy by design
- Simplicity over complexity
- Trust through transparency
- Accessibility for everyone
- Long-term maintainability

---

# 5. Architecture Philosophy

Somna is organized around **behavior change**, not around pages or isolated features.

```text
Identity
    ↓
Behavior
    ↓
Habit
    ↓
Intelligence
    ↓
Learning
    ↓
Trust
```

Every architectural decision should strengthen this behavioral loop.

---

# 6. Non-negotiable Principles

1. Local-first whenever practical.
2. Progressive authentication.
3. Anonymous usage before mandatory identity.
4. Native multilingual content.
5. Privacy before personalization.
6. Accessibility by default.
7. Evidence-informed product decisions.
8. AI augments, never replaces, human judgement.

---

# 7. Global Architecture Invariants

- Identity is optional until cloud capabilities are requested.
- Behavioral records are canonical historical facts.
- Derived metrics never replace original records.
- AI never modifies canonical behavioral records.
- Dashboard consumes data but does not own data.
- Reminder supports habits but never rewrites history.
- Every user-owned record is exportable.
- Every user-owned record is deletable.

---

# 8. Product Boundaries

Somna is:
- A behavioral sleep improvement platform.
- A CBT-I inspired self-management companion.
- A private journaling and learning environment.

Somna is not:
- A medical diagnosis system.
- A replacement for clinicians.
- An emergency service.
- A social network.

---

# 9. Quality Philosophy

Quality is defined by:
- User trust
- Scientific integrity
- Reliability
- Privacy
- Accessibility
- Architectural consistency

---

# 10. Governance Hierarchy

```text
PAS-00 Product Constitution
        ↓
Product Architecture Specification
        ↓
Architecture Decision Records
        ↓
Technical Design
        ↓
Implementation
        ↓
Source Code
```

---

# 11. Architectural Change Policy

```text
Proposal
    ↓
Discussion
    ↓
ADR
    ↓
PAS Update
    ↓
Implementation
    ↓
Release
```

---

# 12. Architecture Layers

- Layer 0: Product Constitution
- Layer 1: Foundation
- Layer 2: Platform
- Layer 3: Behavior System
- Layer 4: Experience
- Layer 5: Governance

Higher layers may depend on lower layers, but lower layers must not depend on higher layers.

---

# 13. Long-term Product Evolution

```text
Identity
    ↓
Behavior
    ↓
Habit
    ↓
Intelligence
    ↓
Personalized Guidance
    ↓
Connected Ecosystem
```

Future capabilities must preserve the constitutional principles defined in PAS-00.

---

# 14. Constitutional Fitness Functions

- Single source of truth
- Offline-first behavioral recording
- Deterministic derived metrics
- Privacy preservation
- Data portability
- Read-only AI over canonical records
- Consistent governance across modules

---

# 15. Relationship to Other PAS Documents

PAS-00 provides constitutional guidance for every subsequent chapter.

- PAS-01 defines product scope.
- PAS-02 defines behavioral and CBT-I principles.
- PAS-03 defines information architecture.
- PAS-04 defines identity.
- PAS-05 defines behavioral data.
- PAS-06~PAS-12 extend the platform while remaining consistent with PAS-00.

---

# Revision History

## Version 2.0

- Introduced Product Constitution.
- Established global architecture philosophy.
- Defined global architecture invariants.
- Created governance hierarchy.
- Formalized constitutional fitness functions.

---

**End of PAS-00**
