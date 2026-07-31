# Somna Product Architecture Specification (PAS)

> **The single source of truth for Somna's product architecture.**

---

# Overview

The Somna Product Architecture Specification (PAS) defines the long-term architectural blueprint for the Somna platform.

Unlike a traditional Product Requirements Document (PRD) or Technical Design Document (TDD), PAS establishes the permanent architectural contract between Product, Design, Engineering and AI Coding Agents.

It describes **what the product is**, **how its architecture is organized**, **how architectural decisions are made**, and **how the platform should evolve over time**.

Every architectural decision should be traceable back to PAS.

---

# Objectives

PAS exists to ensure that Somna remains:

- Scientifically grounded
- Privacy-first
- Behavior-centered
- AI-ready
- Maintainable
- Evolvable
- Consistent across teams and AI coding tools

PAS is intended to guide both human contributors and AI-assisted development.

---

# What PAS Is

PAS is:

- Product Architecture Specification
- Long-term architectural blueprint
- Product engineering contract
- Domain model definition
- Governance framework

PAS is **not**:

- A Product Requirements Document (PRD)
- An implementation guide
- API documentation
- UI specification
- Sprint planning documentation

Implementation details belong to ADRs, technical design documents and code repositories.

---

# Architecture Philosophy

Somna is not organized around pages or isolated features.

Somna is organized around **behavior change**.

The platform architecture follows a continuous behavioral journey:

```text
Identity
        │
        ▼
Behavior
        │
        ▼
Habit
        │
        ▼
Intelligence
        │
        ▼
Learning
        │
        ▼
Trust
```

Every module within Somna exists to support this behavioral loop.

---

# Architecture Layers

The PAS is organized into five architectural layers.

```text
Layer 0
────────────────────────────
Product Constitution

↓

Layer 1
────────────────────────────
Foundation

↓

Layer 2
────────────────────────────
Platform

↓

Layer 3
────────────────────────────
Behavior System

↓

Layer 4
────────────────────────────
Experience

↓

Layer 5
────────────────────────────
Governance
```

Each layer depends only on lower layers and provides capabilities to higher layers.

---

# Blueprint Structure

```
docs/
└── blueprint/
    ├── README.md
    ├── 00_PRODUCT_CONSTITUTION.md
    │
    ├── Layer 1 — Foundation
    ├── 01_FOUNDATION_SCOPE_AND_PRODUCT_BOUNDARIES.md
    ├── 02_PRODUCT_PRINCIPLES_AND_CBTI_FRAMEWORK.md
    ├── 03_INFORMATION_ARCHITECTURE_AND_USER_JOURNEYS.md
    │
    ├── Layer 2 — Platform
    ├── 04_AUTHENTICATION_IDENTITY_AND_CLOUD_SYNC_ARCHITECTURE.md
    ├── 05_SLEEP_DIARY_AND_GUIDED_REFLECTION_ARCHITECTURE.md
    │
    ├── Layer 3 — Behavior System
    ├── 06_REMINDER_AND_HABIT_ENGINE_ARCHITECTURE.md
    ├── 07_AI_READINESS_AND_CBTI_INTELLIGENCE_PLATFORM.md
    │
    ├── Layer 4 — Experience
    ├── 08_ACCOUNT_PRIVACY_AND_DATA_LIFECYCLE.md
    ├── 09_LOCALIZATION_AND_CONTENT_GOVERNANCE.md
    ├── 10_PUBLIC_CONTENT_AND_SEO_ARCHITECTURE.md
    ├── 11_DESIGN_SYSTEM_AND_EXPERIENCE_ARCHITECTURE.md
    │
    └── Layer 5 — Governance
        └── 12_QUALITY_TESTING_RELEASE_AND_GOVERNANCE.md
```

---

# Architecture Dependency Graph

```text
PAS-00 Product Constitution
            │
            ▼
PAS-01 Foundation
            │
            ▼
PAS-02 Product Principles
            │
            ▼
PAS-03 Information Architecture
       ┌───────────────┐
       ▼               ▼
PAS-04 Identity    PAS-05 Behavioral Data
       │               │
       └───────┬───────┘
               ▼
      PAS-06 Reminder & Habit Engine
               │
               ▼
 PAS-07 AI Readiness & Intelligence
       ┌────────┼────────┐
       ▼        ▼        ▼
 PAS-08     PAS-09    PAS-10
 Privacy  Localization   SEO
               │
               ▼
      PAS-11 Design System
               │
               ▼
 PAS-12 Quality & Governance
```

---

# Recommended Reading Order

| Role | Recommended Chapters |
|------|----------------------|
| Product Manager | PAS-00 → PAS-03 → PAS-05 |
| UX / UI Designer | PAS-00 → PAS-03 → PAS-11 |
| Frontend Engineer | PAS-04 → PAS-05 → PAS-11 |
| Backend Engineer | PAS-04 → PAS-05 → PAS-08 |
| AI Engineer | PAS-05 → PAS-07 |
| QA Engineer | PAS-12 |

---

# Writing Standard

Every PAS chapter follows the same architectural template.

## Part A — Domain Foundation

- Purpose
- Scope
- Goals
- Non-goals
- Design Principles
- Architecture Decisions
- Architecture Constraints
- Canonical Domain Model*
- Lifecycle*
- State Machine*
- Responsibilities
- Dependencies

## Part B — Runtime Architecture

- Runtime Overview
- Runtime Pipeline*
- Runtime Components
- Runtime APIs
- Data Ownership*
- Consumer Matrix*
- Storage
- Synchronization
- Security
- Runtime Quality Gates

## Part C — Governance

- Governance Principles
- Product Quality Gates
- AI Readiness*
- Privacy Boundary
- Architecture Decision Records (ADR)
- Future Evolution
- Blueprint Governance
- Appendix
- Glossary
- Revision History

> Sections marked with * are required for domain-centric chapters.

---

# Governance Hierarchy

Architectural authority follows the hierarchy below.

```text
Product Constitution
        │
        ▼
Product Architecture Specification (PAS)
        │
        ▼
Architecture Decision Records (ADR)
        │
        ▼
Technical Design
        │
        ▼
Implementation
        │
        ▼
Source Code
```

No implementation should contradict the PAS.

---

# Architectural Change Process

Major architectural changes follow a formal review process.

```text
Proposal
      │
      ▼
Discussion
      │
      ▼
ADR Draft
      │
      ▼
PAS Update
      │
      ▼
Implementation
      │
      ▼
Release
```

This ensures architectural consistency across documentation and implementation.

---

# Versioning

| Version | Description |
|----------|-------------|
| v1.0 | Initial Product Blueprint |
| v2.0 | Enterprise Product Architecture Specification |

---

# Repository Principles

This repository follows several permanent principles:

- Single Source of Truth
- Canonical Domain Models
- Architecture before implementation
- Privacy by design
- Behavior-first product design
- Evolution through governance
- Long-term maintainability

---

# License

Internal product architecture documentation.

All contributors should follow the governance defined by PAS.