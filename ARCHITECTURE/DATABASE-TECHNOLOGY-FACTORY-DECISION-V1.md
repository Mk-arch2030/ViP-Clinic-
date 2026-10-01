# Dr.Roby Clinic — Database Technology Factory Decision V1

DOCUMENT = DATABASE TECHNOLOGY FACTORY DECISION
PRODUCT = Dr.Roby Clinic

STATUS = CLOSED + PROVEN

## 1. PURPOSE

This document establishes the authoritative database technology selection
for Dr.Roby Clinic.

The selected technology is PostgreSQL.

The decision is intentionally separated from:

- Product domain meaning
- Persistence technical contract
- Persistence schema meaning
- CPN format decision
- CPN starting value decision
- CPN generation mechanism decision
- CPN implementation authorization

No existing closed product, domain, persistence, or CPN decision is reopened
by this document.

## 2. AUTHORITY BASIS

This decision is constrained by:

- Product Manuscript
- Closed Product Contracts C01-C08
- Proven Domain / Persistence Boundary
- Persistence Technical Contract Proof
- Persistence Schema Definition
- Persistence Implementation Authorization Decision
- Final Authority Map
- CPN Format Factory Decision
- CPN Starting Value Factory Decision
- CPN Generation Mechanism Decision
- CPN Generation Implementation Authorization Decision

These authorities define what the database must support.

They do not, by themselves, select the database technology.

## 3. SELECTION

DATABASE TECHNOLOGY = PostgreSQL

DATABASE TECHNOLOGY SELECTED = YES

The selection is an explicit Factory Decision.

The selection is not based on:

- external auditor recommendation
- another project
- package availability
- developer preference alone

E17 — PostgreSQL as Persistence Implementation remains a non-authoritative
external recommendation. The authoritative selection is established by this
Factory Decision.

## 4. SELECTION RATIONALE

PostgreSQL is selected because it provides an appropriate relational
foundation for the already-authorized Dr.Roby Clinic persistence requirements.

The selection is aligned with the need for:

1. Transactional integrity
2. Concurrency control
3. Durable authoritative sequential allocation
4. Uniqueness enforcement
5. Relational integrity
6. Durable Patient identity
7. Stable Clinic Patient Number
8. Preservation of Patient / Case / Visit / Clinic Day relationships
9. Reliable automated testing
10. Local development suitability
11. Future deployment suitability
12. Bounded Node.js application integration

The selection does not require any change to Product meaning, Domain
authority, Persistence contracts, or CPN semantics.

## 5. CPN COMPATIBILITY

PostgreSQL is capable of supporting the already-closed CPN decisions:

- CPN format = CPN- + sequential number
- starting value = 1
- generation direction = persistence-authoritative
- concurrent-safe authoritative allocation
- CPN generated only at first Patient registration
- CPN remains stable for the Patient

This decision does not select the physical CPN allocation mechanism.

Sequential allocation must not be interpreted as a requirement for gapless
numbers unless such a requirement is separately established by authority.

## 6. DECISION BOUNDARY

This decision selects only the database technology.

It does NOT select:

- SQL schema
- table names
- column names
- migrations
- sequences
- identity columns
- triggers
- ORM
- repository architecture
- API behavior
- authentication
- authorization
- deployment topology
- CPN allocator implementation
- Patient technical identifier type
- unrelated persistence mechanisms

Those decisions remain governed by their respective gates.

## 7. IMPLEMENTATION STATUS

DATABASE TECHNOLOGY SELECTION = CLOSED + PROVEN

POSTGRESQL PACKAGE INSTALLATION = NOT PERFORMED BY THIS DECISION

DATABASE SERVER STARTUP = NOT PERFORMED

DATABASE CREATION = NOT PERFORMED

SCHEMA EXECUTION = NOT PERFORMED

MIGRATION EXECUTION = NOT PERFORMED

ORM INSTALLATION = NOT PERFORMED

REPOSITORY IMPLEMENTATION = NOT PERFORMED

CPN GENERATION IMPLEMENTATION = NOT PERFORMED

## 8. GOVERNANCE

No database implementation may exceed the authorized persistence boundary.

No CPN technical design detail may establish a different database technology.

No implementation may mutate Product, Domain, Persistence, or CPN contracts.

Any future physical PostgreSQL mechanism must be established through its own
bounded technical design and authorization gate.

## 9. PROOF CONDITIONS

The following are proven by this decision:

- authoritative technology selection exists
- selected technology = PostgreSQL
- selection is bounded to database technology
- CPN decisions remain unchanged
- no schema mechanism is silently selected
- no implementation was executed
- no unrelated capability or authority was introduced
- FAIL = 0

## 10. FINAL DECISION

DATABASE TECHNOLOGY DECISION = CLOSED + PROVEN

DATABASE TECHNOLOGY SELECTED = POSTGRESQL

IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT = NO

CONTRACT MUTATION = NO

SCOPE EXPANSION = NO

FAIL = 0

NEXT GATE = DATABASE TECHNOLOGY TECHNICAL DESIGN

END OF DATABASE TECHNOLOGY FACTORY DECISION V1
