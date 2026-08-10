# 02_PRODUCT_PRINCIPLES_AND_CBTI_FRAMEWORK.md

# PAS-02 Product Principles & CBT-I Framework

### Product Architecture Specification

> Defines the behavioral philosophy and evidence-informed principles that guide every user experience within Somna.

---

# Architecture Metadata

| Field        | Value                |
| ------------ | -------------------- |
| Blueprint ID | PAS-02               |
| Layer        | Layer 1 – Foundation |
| Status       | Canonical            |
| Version      | 2.0                  |
| Depends On   | PAS-00, PAS-01       |
| Required By  | PAS-03 ~ PAS-12      |

---

# Part A — Domain Foundation

## 1. Purpose

PAS-02 defines the enduring product principles that shape Somna's behavioral design. It translates CBT-I inspired concepts into consistent product architecture without prescribing clinical treatment.

## 2. Scope

This document governs:

- Behavioral guidance
- User education
- Reflection philosophy
- Habit formation
- AI behavioral boundaries

It does not define implementation details or clinical protocols.

## 3. Product Principles

Somna is built around these principles:

1. Behavior before outcome.
2. Progress before perfection.
3. Education before automation.
4. Reflection before recommendation.
5. Trust before engagement.
6. Consistency before complexity.

## 4. CBT-I Inspired Framework

Somna draws inspiration from established CBT-I concepts including:

- Sleep education
- Sleep scheduling
- Stimulus control
- Sleep habit formation
- Cognitive reflection
- Lifestyle awareness

The platform presents these as educational and self-management guidance.

## 5. Design Principles

- Calm interactions
- Explainable guidance
- Small achievable steps
- Evidence-informed content
- User autonomy
- Respect for uncertainty

## 6. Architecture Decisions

- Behavioral records are primary.
- Insights are derived.
- Reflection is optional.
- AI supplements education, never replaces judgement.

---

# Part B — Runtime Architecture

## Behavioral Loop

```text
Record
   ↓
Reflect
   ↓
Learn
   ↓
Plan
   ↓
Practice
   ↓
Review
```

## Responsibilities

- Diary records observations.
- Reflection captures interpretation.
- Learning explains concepts.
- Habit Engine reinforces routines.
- AI summarizes and explains patterns.

## Consumer Matrix

| Domain       | Read | Write |
| ------------ | :--: | :---: |
| Diary        |  ✓   |   ✓   |
| Reflection   |  ✓   |   ✓   |
| Learning     |  ✓   |       |
| Habit Engine |  ✓   |       |
| AI           |  ✓   |       |

## Runtime Quality Gates

Every behavioral feature should:

- Encourage autonomy.
- Avoid manipulation.
- Preserve historical records.
- Clearly distinguish observations from interpretations.

---

# Part C — Governance

## AI Readiness

AI may:

- Summarize
- Explain
- Correlate
- Educate

AI must not:

- Diagnose disease
- Rewrite diary records
- Make medical claims
- Hide uncertainty

## Architecture Invariants

- Behavior remains the central product domain.
- Reflection never overwrites observations.
- Educational content remains transparent.
- Users retain final control over decisions.

## Future Evolution

Future versions may incorporate:

- Personalized coaching
- Adaptive learning paths
- Wearable-informed insights

These capabilities must remain compatible with PAS-00 and PAS-01.

## Revision History

### Version 2.0

- Rewritten using PAS enterprise template.
- Separated constitutional principles into PAS-00.
- Established behavioral principles as a standalone architectural layer.

---

**End of PAS-02**
