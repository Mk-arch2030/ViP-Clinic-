# ACTOR CANONICAL REBUILD AUTHORITY DECISION V1

## 1. PURPOSE

This document establishes the authority boundary for defining a canonical
rebuild source for the Actor persistence foundation.

The forensic discovery established:

ACTOR_CANONICAL_REBUILD_SOURCE = NOT_FOUND
CLEAN_ENVIRONMENT_REBUILD = IMPOSSIBLE
REPRODUCIBILITY_GAP = PROVEN

This document determines what must be true before a canonical rebuild
source may be implemented.

This document does NOT perform implementation.

---

## 2. PRESERVED PRODUCT TRUTH

Historical Local Storage behavior remains valid product heritage and
behavioral evidence.

The current live PostgreSQL Actor foundation remains valid live evidence.

These facts are preserved:

HISTORICAL_LOCAL_STORAGE_TRUTH = PRESERVED

LIVE_POSTGRESQL_ACTOR_TRUTH = PRESERVED

FIRST_REAL_MAIN_ADMIN_ACTOR = PRESERVED

DATA_PRESERVATION = PROVEN

ROLLBACK_SAFETY = PROVEN

REGRESSION_BASELINE = 31 PASS / 0 FAIL

The rebuildability gap does not invalidate historical Local Storage
behavior or the existing live PostgreSQL Actor evidence.

---

## 3. FORENSIC BASELINE

The repository currently contains no proven executable canonical source
that reconstructs:

public.actors

with the complete established physical foundation:

actor_id UUID PRIMARY KEY
actor_id DEFAULT uuidv7()
actor_role constrained to DOCTOR / NURSE
lifecycle_state constrained to ACTIVE / DEACTIVATED

The following are NOT equivalent to a canonical rebuild source:

Architecture Documentation
Live PostgreSQL State
Live Proof Documentation
Domain Object Representation
Historical Local Storage Runtime

Therefore:

DOCUMENTATION != EXECUTABLE_REBUILD_SOURCE

LIVE_PROOF != CLEAN_DATABASE_INITIALIZATION

DOMAIN_REPRESENTATION != POSTGRESQL_SCHEMA

---

## 4. CANONICAL REBUILD AUTHORITY — REQUIRED DEFINITION

The future canonical Actor rebuild source MUST be:

1. Repository-controlled.
2. Executable.
3. Deterministic.
4. Reproducible from a clean PostgreSQL database.
5. Explicitly versioned in Git.
6. Capable of creating public.actors without relying on undocumented
   pre-existing database state.
7. Capable of reproducing the approved physical Actor constraints.
8. Traceable to an explicit architecture authority.
9. Testable independently from the live production-like database.
10. Compatible with the final approved Actor lifecycle semantics.

The canonical source MUST NOT depend on:

- manual undocumented SQL,
- an existing live database,
- historical database state,
- hidden local machine state,
- undocumented initialization steps,
- accidental database objects,
- test-only fixtures.

---

## 5. REQUIRED PHYSICAL CONTRACT

Before implementation authority is granted, the canonical rebuild
definition MUST explicitly reconcile:

ACTOR_TABLE = public.actors

ACTOR_PERSISTENCE_KEY = actor_id

ACTOR_PERSISTENCE_TYPE = PostgreSQL UUID

ACTOR_PERSISTENCE_GENERATION = PostgreSQL 18 native uuidv7()

APPROVED_ROLES = DOCTOR + NURSE

LIFECYCLE_STORAGE = lifecycle_state

LIFECYCLE_VALUES = ACTIVE + DEACTIVATED

The final lifecycle semantics must be resolved separately before the
physical rebuild implementation is considered complete.

---

## 6. LIFECYCLE DEPENDENCY

Canonical rebuild authority MUST NOT silently resolve the current
lifecycle semantic gap.

The following remains unresolved:

Is lifecycle_state:

A. an Actor-wide invariant applying to Doctor and Nurse,

OR

B. a Nurse-specific lifecycle concept that is physically represented in
   a broader schema structure?

Doctor lifecycle semantics must be explicitly decided before a final
canonical rebuild source is declared semantically complete.

Therefore:

LIFECYCLE_SEMANTICS = OPEN DECISION

DOMAIN_UNDERSPECIFICATION = PRESERVED

SEMANTIC_GAP = PROVEN

---

## 7. REBUILD SOURCE AUTHORITY

The factory may authorize creation of a canonical rebuild source only
through a separate implementation authorization decision.

This document itself does NOT authorize:

- CREATE TABLE public.actors
- schema.sql modification
- migration creation
- database initialization implementation
- lifecycle domain modification
- live database modification
- data migration
- Actor recreation
- Actor deletion
- Actor replacement

Therefore:

REBUILD_SOURCE_IMPLEMENTATION_AUTHORITY = NONE

DATABASE_MODIFICATION_AUTHORITY = NONE

SCHEMA_MODIFICATION_AUTHORITY = NONE

MIGRATION_AUTHORITY = NONE

DOMAIN_MODIFICATION_AUTHORITY = NONE

---

## 8. REQUIRED IMPLEMENTATION PROOF

If implementation is authorized in a future decision, closure MUST
include proof of:

1. Clean PostgreSQL reconstruction.
2. public.actors creation.
3. UUID primary key.
4. uuidv7() default.
5. DOCTOR / NURSE role constraint.
6. ACTIVE / DEACTIVATED lifecycle constraint.
7. Alignment with the final lifecycle semantics.
8. Idempotence or explicitly defined initialization behavior.
9. Regression preservation.
10. Live-data preservation.
11. Rollback safety where applicable.
12. Exact source-to-live reconciliation.

No implementation may be declared canonical without these proofs.

---

## 9. AUTHORITY SEPARATION

The following concepts remain separate:

Dr_Roby
= Main Admin / Doctor / Clinical Authority / System Owner

DR/MK_ROBY
= application authentication login identifier

actor_id
= Actor persistence key

u0_a282
= PostgreSQL runtime role

Historical Local Storage
= product heritage / behavioral evidence

PostgreSQL public.actors
= current live Actor persistence foundation

Canonical Rebuild Source
= repository-controlled future reproducibility authority

No identity, username, database role, or historical runtime may be
silently substituted for the canonical rebuild source.

---

## 10. FINAL AUTHORITY DECISION

ACTOR_CANONICAL_REBUILD_SOURCE = NOT_FOUND

CLEAN_ENVIRONMENT_REBUILD = IMPOSSIBLE

REPRODUCIBILITY_GAP = PROVEN

LIFECYCLE_SEMANTICS = OPEN DECISION

SEMANTIC_GAP = PROVEN

REBUILD_SOURCE_IMPLEMENTATION_AUTHORITY = NONE

DATABASE_MODIFICATION_AUTHORITY = NONE

SCHEMA_MODIFICATION_AUTHORITY = NONE

MIGRATION_AUTHORITY = NONE

DOMAIN_MODIFICATION_AUTHORITY = NONE

HISTORICAL_LOCAL_STORAGE_TRUTH = PRESERVED

LIVE_POSTGRESQL_ACTOR_TRUTH = PRESERVED

FIRST_REAL_MAIN_ADMIN_ACTOR = PRESERVED

DATA_PRESERVATION = PROVEN

ROLLBACK_SAFETY = PROVEN

REGRESSION_BASELINE = 31 PASS / 0 FAIL

UNAUTHORIZED_EXPANSION = NO

FAIL = 0

0 FAIL ™ 🧬
