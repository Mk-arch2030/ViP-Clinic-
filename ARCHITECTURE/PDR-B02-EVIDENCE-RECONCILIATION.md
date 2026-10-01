# PDR-B02 — FACTORY EVIDENCE RECONCILIATION

## 1. PURPOSE

This artifact records the Factory's current evidence baseline for:

PDR-B02 — Visit Clinical Content Structure

It does not select a persistence structure and does not authorize
database schema or implementation.

## 2. AUTHORITATIVE PRODUCT FACTS

The Visit clinical content includes:

- Current Complaint
- Investigation / Diagnosis
- Treatment
- Follow-up

Each recorded Visit contributes clinical information to the Patient's
Clinical History.

A later follow-up return creates a new Visit.

A later Visit must not overwrite a previous Visit.

Clinical History accumulates across recorded Visits.

## 3. AMENDMENT BOUNDARY

The existing product contracts establish that certain clinical
information may require modification by explicit Doctor action.

Diagnosis modification requires an explicit Doctor command.

Treatment modification requires a stronger explicit Doctor command.

Investigation modification requires a stronger explicit Doctor command.

This amendment behavior is a product-level boundary.

The technical persistence representation of amendments remains undefined.

## 4. TECHNICAL PERSISTENCE QUESTION

The following remain deliberately undefined:

- Field/cardinality structure.
- Whether Visit clinical content is represented as scalar fields,
  structured records, or another persistence representation.
- Exact technical amendment semantics.
- Technical schema representation.
- Database tables and columns.
- Constraints and indexes.
- Repository implementation.
- API implementation.
- UI implementation.
- Authorization implementation.

## 5. FACTORY SCOPE GUARD

This evidence reconciliation does not authorize:

- database schema
- SQL
- migrations
- ORM
- repository implementation
- API routes
- UI controls
- authentication
- authorization implementation
- audit implementation
- workflow state-machine implementation

No capability outside the closed Product Manuscript and Contracts may
be introduced through PDR-B02.

## 6. CURRENT GATE

PDR-B02 = BLOCKING TECHNICAL DECISION

DATABASE_SCHEMA = NOT_DEFINED

PERSISTENCE_IMPLEMENTATION_AUTHORIZED = NO

NEXT ACTION = FACTORY TECHNICAL EXCAVATION

