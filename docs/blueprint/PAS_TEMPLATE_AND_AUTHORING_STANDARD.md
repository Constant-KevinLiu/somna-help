# PAS_TEMPLATE_AND_AUTHORING_STANDARD.md

# Product Architecture Specification (PAS)
## Authoring Template & Writing Standard

> Defines the mandatory structure, naming conventions and governance rules for every PAS document.

---

# 1. Purpose

This document is the authoring standard for the Somna Product Architecture Specification (PAS).

Every architecture document (PAS-01 and beyond) MUST follow this standard.

---

# 2. Naming Convention

## Repository File

```
00_PRODUCT_CONSTITUTION.md
01_FOUNDATION_AND_PRODUCT_BOUNDARIES.md
02_PRODUCT_PRINCIPLES_AND_CBTI_FRAMEWORK.md
...
12_GOVERNANCE_AND_RELEASE_PLATFORM.md
```

## Blueprint ID

```
PAS-00
PAS-01
PAS-02
...
PAS-12
```

Always reference documents by Blueprint ID inside ADRs, design documents and code comments.

---

# 3. Standard Metadata

Every PAS document begins with the following metadata table.

| Field | Description |
|--------|-------------|
| Blueprint ID | PAS identifier |
| Title | Official title |
| Layer | Architecture layer |
| Status | Draft / Review / Canonical |
| Version | Semantic version |
| Owner | Responsible role |
| Review Cycle | Review cadence |
| Depends On | Upstream PAS |
| Required By | Downstream PAS |
| Stability | Experimental / Stable |
| Last Updated | Date |

---

# 4. Standard Document Structure

## Part A — Domain Foundation

1. Purpose
2. Scope
3. Goals
4. Non-goals
5. Design Principles
6. Architecture Decisions
7. Architecture Constraints
8. Canonical Domain Model *
9. Lifecycle *
10. State Machine *
11. Responsibilities
12. Dependencies

## Part B — Runtime Architecture

1. Runtime Overview
2. Runtime Components
3. Runtime Pipeline *
4. Runtime APIs
5. Data Ownership *
6. Consumer Matrix *
7. Storage
8. Synchronization
9. Security
10. Runtime Quality Gates

## Part C — Governance

1. Governance Principles
2. Product Quality Gates
3. AI Readiness *
4. Privacy Boundary
5. Architecture Decision Records
6. Future Evolution
7. Blueprint Governance
8. Appendix
9. Glossary
10. Revision History

(*) Required for domain-centric architecture.

---

# 5. Required Diagrams

Each platform or domain document should include, where applicable:

- Domain Model
- Lifecycle Diagram
- State Machine
- Runtime Pipeline
- Dependency Diagram

ASCII diagrams are acceptable.

---

# 6. Required Tables

Every PAS should include:

- Responsibilities
- Dependencies
- Consumer Matrix
- Data Ownership
- Quality Gates
- Revision History

---

# 7. Writing Principles

Each section should answer:

- Why?
- What?
- How?
- Who?
- Future evolution?

Write in normative language.

Prefer:

- MUST
- SHOULD
- MAY

Avoid implementation details unless architecturally significant.

---

# 8. Cross-cutting Concerns

Every PAS shall consider:

- Privacy
- Security
- Accessibility
- Localization
- Performance
- Observability
- Maintainability
- AI Compatibility

---

# 9. Architecture Invariants

Every PAS must define invariants that cannot be violated.

Example:

- Canonical records are immutable.
- Derived data never overwrites source data.
- Ownership is singular.
- AI cannot mutate user records.

---

# 10. Architecture Fitness Functions

Every PAS should define measurable architectural health indicators.

Examples:

- Offline-first support
- Exportable user data
- Deterministic derived metrics
- Explainable AI outputs
- Single Source of Truth

---

# 11. Governance Rules

Architecture precedence:

PAS-00
↓
PAS
↓
ADR
↓
Technical Design
↓
Implementation
↓
Code

No implementation may contradict PAS.

---

# 12. Review Checklist

Before approval verify:

- Metadata complete
- Scope clear
- Boundaries defined
- Domain model complete
- Runtime pipeline present
- Dependencies explicit
- Invariants defined
- Quality gates present
- Governance complete
- Revision history updated

---

# 13. Definition of Done (Architecture)

A PAS is complete only when:

- Architectural responsibilities are explicit.
- Interfaces are identified.
- Dependencies are documented.
- Constraints are documented.
- Governance is defined.
- Future evolution is identified.

---

# Revision History

## v2.0

Initial enterprise authoring standard for the Somna Product Architecture Specification.
