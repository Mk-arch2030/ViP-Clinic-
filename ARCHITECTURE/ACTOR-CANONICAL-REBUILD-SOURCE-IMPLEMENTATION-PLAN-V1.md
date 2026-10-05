# ACTOR CANONICAL REBUILD SOURCE IMPLEMENTATION PLAN V1

## 1. PURPOSE

This plan defines the bounded implementation sequence for creating the
canonical repository-controlled rebuild source for the Actor persistence
foundation.

Implementation authority has already been granted by:

ACTOR_CANONICAL_REBUILD_SOURCE_IMPLEMENTATION_AUTHORIZED = YES

AUTHORIZED_SCOPE = BOUNDED_ACTOR_CANONICAL_REBUILD_SOURCE_ONLY

This plan does NOT execute implementation.

---

## 2. CANONICAL TARGET

CANONICAL_TARGET = public.actors

The canonical source must reconstruct the Actor physical foundation from a
clean PostgreSQL database without undocumented pre-existing database state.

---

## 3. APPROVED PHYSICAL CONTRACT

ACTOR_PERSISTENCE_KEY = actor_id

ACTOR_PERSISTENCE_TYPE = PostgreSQL UUID

ACTOR_PERSISTENCE_GENERATION = PostgreSQL 18 native uuidv7()

ACTOR_ROLE_VALUES = DOCTOR | NURSE

LIFECYCLE_COLUMN = lifecycle_state

LIFECYCLE_VALUES = ACTIVE | DEACTIVATED

LIFECYCLE_MODEL = ACTOR_WIDE

PRIMARY_KEY = actor_id

---

## 4. CANONICAL SOURCE LOCATION

The canonical rebuild source MUST be repository-controlled and must reside
within the existing persistence/schema authority boundary.

The implementation must first reconcile the existing repository structure
before choosing or modifying the canonical source file.

No new migration framework, database toolchain, or alternate persistence
architecture may be introduced without separate authority.

---

## 5. IMPLEMENTATION SEQUENCE

### STEP 1 — Repository Structure Reconciliation

Inspect the existing persistence/schema authority boundary.

Identify the canonical existing schema initialization source.

Do not modify it during discovery.

### STEP 2 — Clean Reconstruction Target

Create or use an isolated clean PostgreSQL reconstruction target.

The clean target must not contain undocumented pre-existing Actor objects.

Existing live database data must not be used as the reconstruction source.

### STEP 3 — Canonical Actor Definition

Implement the approved public.actors definition in the canonical
repository-controlled source.

The definition must include:

- actor_id UUID primary key,
- PostgreSQL uuidv7() default,
- DOCTOR / NURSE role constraint,
- ACTIVE / DEACTIVATED lifecycle constraint.

### STEP 4 — Clean Reconstruction Proof

Execute the canonical source against the clean reconstruction target.

Prove:

- public.actors exists,
- actor_id is UUID,
- actor_id is primary key,
- actor_id default is uuidv7(),
- role constraint exists,
- lifecycle constraint exists.

### STEP 5 — Constraint Behavioral Proof

Prove rejection of:

- invalid actor role,
- invalid lifecycle state.

Prove acceptance of:

- DOCTOR + ACTIVE,
- DOCTOR + DEACTIVATED,
- NURSE + ACTIVE,
- NURSE + DEACTIVATED.

### STEP 6 — Rebuild Reproducibility Proof

Destroy the isolated reconstruction target and rebuild it again from the
same canonical source.

The second reconstruction must produce the same approved physical
structure.

### STEP 7 — Existing Live Database Reconciliation

Compare the canonical source-derived structure against the existing live
public.actors structure.

This is structural reconciliation only.

Do not replace, delete, migrate, or rewrite existing live Actor data.

### STEP 8 — Data Preservation Proof

Prove that the existing live Main Admin Actor remains preserved.

Prove that existing patient data remains preserved.

No live data modification is authorized by this plan.

### STEP 9 — Regression Proof

Run the established regression baseline.

Required baseline:

31 PASS / 0 FAIL

Any baseline change requires explicit authority before closure.

### STEP 10 — Rollback Safety

Where implementation modifies an isolated reconstruction target, prove
rollback or safe destruction of that isolated target.

Do not perform destructive rollback against the existing live database.

### STEP 11 — Final Source-to-Live Closure

Produce a dedicated implementation live-proof artifact containing:

- canonical source identity,
- clean reconstruction proof,
- physical structure proof,
- constraint proof,
- reproducibility proof,
- source-to-live reconciliation,
- data preservation,
- rollback safety,
- regression result,
- exact final authority status.

---

## 6. SAFETY BOUNDARY

The implementation MUST NOT:

- delete the existing live Actor,
- replace the existing live Actor,
- migrate Actor data,
- recreate the live Actor table destructively,
- modify patient data,
- create authentication storage,
- create credential storage,
- create session storage,
- create authorization storage,
- add login routes,
- expand API authority,
- modify UI,
- deploy,
- authorize real use.

---

## 7. EXPECTED FINAL STATE

If all required proofs pass:

ACTOR_CANONICAL_REBUILD_SOURCE = PROVEN

CLEAN_ENVIRONMENT_REBUILD = PROVEN

REPRODUCIBILITY_GAP = CLOSED

SOURCE_TO_LIVE_RECONCILIATION = PROVEN

LIFECYCLE_SEMANTICS = CLOSED + PROVEN

DATA_PRESERVATION = PROVEN

ROLLBACK_SAFETY = PROVEN

REGRESSION = PROVEN

UNAUTHORIZED_EXPANSION = NO

If any required proof fails, implementation closure MUST NOT be declared.

---

## 8. CURRENT IMPLEMENTATION STATUS

IMPLEMENTATION_AUTHORITY = GRANTED

IMPLEMENTATION_EXECUTION = NOT_PERFORMED

DATABASE_MODIFICATION_BY_THIS_PLAN = NO

LIVE_DATA_MODIFICATION = NO

DATA_MIGRATION = NO

AUTHENTICATION_IMPLEMENTATION = NOT_AUTHORIZED

AUTHORIZATION_IMPLEMENTATION = NOT_AUTHORIZED

API_EXPANSION = NOT_AUTHORIZED

UI_IMPLEMENTATION = NOT_AUTHORIZED

DEPLOYMENT = NOT_AUTHORIZED

REAL_USE = NOT_AUTHORIZED

PRODUCTION_USE = NOT_AUTHORIZED

FAIL = 0

0 FAIL ™ 🧬
