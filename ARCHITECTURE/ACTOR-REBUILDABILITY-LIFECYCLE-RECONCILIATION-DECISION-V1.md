# ACTOR REBUILDABILITY & LIFECYCLE RECONCILIATION DECISION V1

## 1. PURPOSE

This document establishes the current reconciliation decision for the
Actor persistence foundation after the cross-layer forensic review.

The purpose is to preserve established product truth while distinguishing:

- historical product behavior,
- current live PostgreSQL evidence,
- repository rebuildability,
- Actor lifecycle semantics,
- implementation authority.

This document does NOT authorize implementation.

---

## 2. HISTORICAL PRODUCT TRUTH

The product has an established historical runtime lineage in which the
Actor and clinic behavior was exercised through the Local Storage runtime.

That historical runtime is preserved as product heritage and behavioral
evidence.

Historical Local Storage behavior is NOT invalidated by the later
PostgreSQL reconstruction.

The following distinction is mandatory:

HISTORICAL_LOCAL_STORAGE_RUNTIME = VALID_HERITAGE_EVIDENCE

CURRENT_POSTGRESQL_RUNTIME = CURRENT_PERSISTENCE_IMPLEMENTATION

REPOSITORY_REBUILDABILITY = SEPARATE REPRODUCIBILITY QUESTION

The existence of a reproducibility gap in the current repository does not
invalidate the historical Local Storage runtime or the live PostgreSQL
Actor evidence.

---

## 3. CURRENT FORENSIC FINDING — REBUILDABILITY

The forensic review established:

- Architecture documentation describes public.actors.
- Live PostgreSQL evidence proves public.actors existed and was used.
- The current repository executable schema source does not define
  CREATE TABLE public.actors.
- No complete canonical SQL, migration, or initializer has been proven
  to reconstruct the Actor persistence object from a clean PostgreSQL
  environment.

Therefore:

ACTOR_REBUILDABILITY = NOT_PROVEN

REPRODUCIBILITY_GAP = PROVEN

This is a repository/source reproducibility gap.

It is NOT evidence that the live Actor persistence foundation is invalid.

---

## 4. CURRENT FORENSIC FINDING — LIFECYCLE

The forensic review established:

### Nurse

The established semantic definition includes:

- ACTIVE
- DEACTIVATED
- deletion prohibited
- identity preserved after deactivation
- historical association preserved
- automatic reactivation prohibited

However, current live evidence proves constraint behavior and rollback,
but does not independently prove a real Nurse ACTIVE -> DEACTIVATED
transition together with preservation of identity and historical
association.

Therefore:

NURSE_LIFECYCLE_ALIGNMENT = PARTIAL

### Doctor

The current evidence establishes:

- Doctor is the Main Admin / Clinical Authority / System Owner.
- Live persistence contains a Doctor with lifecycle_state = ACTIVE.

However, the current domain and contract do not fully define:

- whether Doctor may become DEACTIVATED,
- conditions for Doctor deactivation,
- authority responsible for that transition,
- whether lifecycle_state is an Actor-wide invariant,
- or whether lifecycle_state is intentionally Nurse-specific.

Therefore:

DOCTOR_LIFECYCLE_SEMANTICS = UNDER_SPECIFIED

PRIMARY_SEMANTIC_CLASSIFICATION = DOMAIN_UNDERSPECIFICATION

---

## 5. CURRENT CROSS-LAYER STATUS

CONTRACT_TO_DOMAIN = PARTIAL

DOMAIN_TO_PHYSICAL_SCHEMA = PARTIAL

PHYSICAL_SCHEMA_TO_LIVE_EVIDENCE = PARTIAL

OVERALL_ACTOR_LIFECYCLE_ALIGNMENT = PARTIAL

ACTOR_REBUILDABILITY = NOT_PROVEN

REPRODUCIBILITY_GAP = PROVEN

SEMANTIC_GAP = PROVEN

---

## 6. WHAT IS ALREADY PROVEN AND MUST BE PRESERVED

The following established evidence remains valid:

ACTOR_PERSISTENCE_CLOSURE = CLOSED + PROVEN

ACTOR_PHYSICAL_PERSISTENCE = CLOSED + PROVEN

FIRST_REAL_MAIN_ADMIN_ACTOR = PRESERVED

FIRST_REAL_MAIN_ADMIN_ROLE = DOCTOR

FIRST_REAL_MAIN_ADMIN_LIFECYCLE = ACTIVE

DATA_PRESERVATION = PROVEN

ROLLBACK_SAFETY = PROVEN

PATIENT_DATA_PRESERVATION = PROVEN

REGRESSION_BASELINE = 31 PASS / 0 FAIL

No finding in this reconciliation invalidates those proofs.

---

## 7. AUTHORITY BOUNDARY

This document is a reconciliation decision only.

It does NOT authorize:

- modifying backend/persistence/schema.sql,
- creating a migration,
- creating an Actor initializer,
- changing domain/actor.js,
- changing lifecycle semantics in code,
- changing public.actors,
- migrating live data,
- changing the first real Main Admin,
- adding authentication,
- adding authorization,
- changing UI,
- deployment,
- real use,
- production use.

IMPLEMENTATION_AUTHORIZATION = NONE

DATABASE_MODIFICATION_AUTHORITY = NONE

DOMAIN_MODIFICATION_AUTHORITY = NONE

SCHEMA_MODIFICATION_AUTHORITY = NONE

MIGRATION_AUTHORITY = NONE

---

## 8. REQUIRED NEXT DECISIONS

Before implementation, the factory must separately decide:

1. Canonical executable rebuild source for public.actors.
2. Whether lifecycle_state is an Actor-wide invariant or Nurse-specific.
3. Doctor lifecycle semantics, if lifecycle_state is Actor-wide.
4. Evidence required to close Nurse lifecycle transition behavior.
5. Exact reconciliation required between Contract, Domain, Physical Schema,
   and Live Evidence.

No implementation may be inferred from these open questions.

---

## 9. FINAL DECISION

ACTOR_REBUILDABILITY = NOT_PROVEN

ACTOR_LIFECYCLE_ALIGNMENT = PARTIAL

ACTOR_CONTRACT_DOMAIN_ALIGNMENT = PARTIAL

ACTOR_DOMAIN_SCHEMA_ALIGNMENT = PARTIAL

ACTOR_LIVE_EVIDENCE_ALIGNMENT = PARTIAL

REPRODUCIBILITY_GAP = PROVEN

SEMANTIC_GAP = PROVEN

HISTORICAL_LOCAL_STORAGE_TRUTH = PRESERVED

LIVE_POSTGRESQL_ACTOR_TRUTH = PRESERVED

FIRST_REAL_MAIN_ADMIN = PRESERVED

DATA_PRESERVATION = PROVEN

ROLLBACK_SAFETY = PROVEN

IMPLEMENTATION_AUTHORIZATION = NONE

UNAUTHORIZED_EXPANSION = NO

FAIL = 0

0 FAIL ™ 🧬
