# ACTOR CANONICAL REBUILD SOURCE IMPLEMENTATION AUTHORITY DECISION V1

## 1. PURPOSE

This document determines whether the factory may implement the canonical
repository-controlled rebuild source for the Actor persistence foundation.

The required prerequisites are now established:

ACTOR_CANONICAL_REBUILD_SOURCE = NOT_FOUND

CLEAN_ENVIRONMENT_REBUILD = IMPOSSIBLE

REPRODUCIBILITY_GAP = PROVEN

ACTOR_LIFECYCLE_SEMANTICS = CLOSED + PROVEN

LIFECYCLE_MODEL = ACTOR_WIDE

LIFECYCLE_STATE = ACTIVE | DEACTIVATED

The purpose of this decision is to establish bounded implementation
authority.

This document does NOT itself implement the rebuild source.

---

## 2. PRESERVED TRUTH

Historical Local Storage behavior remains preserved.

The current live PostgreSQL Actor foundation remains preserved.

The first real Main Admin Actor remains preserved:

MAIN_ADMIN = Dr_Roby

USERNAME = DR/MK_ROBY

ROLE = DOCTOR

LIFECYCLE = ACTIVE

The live persistence key remains preserved.

DATA_PRESERVATION = PROVEN

ROLLBACK_SAFETY = PROVEN

REGRESSION_BASELINE = 31 PASS / 0 FAIL

---

## 3. AUTHORITY BASIS

The canonical rebuild source is required because repository-wide forensic
discovery established that no executable source currently reconstructs
public.actors from a clean PostgreSQL database.

The domain lifecycle ambiguity has now been closed.

Therefore the factory may authorize implementation of a bounded,
repository-controlled canonical rebuild source.

---

## 4. AUTHORIZED IMPLEMENTATION SCOPE

The following scope is AUTHORIZED:

1. Create one repository-controlled canonical Actor rebuild source.
2. Place it under the repository's existing persistence/schema authority
   boundary.
3. Define public.actors reconstruction.
4. Define actor_id as PostgreSQL UUID primary key.
5. Define PostgreSQL 18 native uuidv7() as the actor_id default.
6. Define actor_role constrained to DOCTOR and NURSE.
7. Define lifecycle_state constrained to ACTIVE and DEACTIVATED.
8. Encode the closed Actor-wide lifecycle semantics.
9. Make the source executable from a clean PostgreSQL database.
10. Make the source deterministic and reproducible.
11. Keep the source version-controlled in Git.
12. Prove exact source-to-live structural reconciliation.

The implementation MUST NOT require undocumented pre-existing database
objects or manual SQL.

---

## 5. EXPLICITLY EXCLUDED SCOPE

This authority does NOT authorize:

- authentication implementation,
- password storage,
- credential storage,
- session storage,
- authorization runtime,
- login routes,
- login UI,
- API expansion,
- patient modifications,
- case modifications,
- visit modifications,
- nurse creation workflow,
- Doctor deactivation workflow,
- authority transfer,
- ownership transfer,
- automatic reactivation,
- Actor deletion,
- Actor replacement,
- live Actor migration,
- destructive database changes,
- deployment,
- real use,
- pilot use,
- production use.

---

## 6. DATA SAFETY BOUNDARY

The canonical rebuild implementation MUST NOT destroy or replace the
existing live Actor foundation.

The implementation must be tested against a clean reconstruction target
before any reconciliation against the existing live database.

Existing live data must remain preserved.

Therefore:

LIVE_DATA_DESTRUCTION = NOT_AUTHORIZED

LIVE_ACTOR_REPLACEMENT = NOT_AUTHORIZED

LIVE_ACTOR_DELETION = NOT_AUTHORIZED

DATA_MIGRATION = NOT_AUTHORIZED

---

## 7. REQUIRED IMPLEMENTATION PROOF

Implementation closure requires proof of all of the following:

1. Canonical source exists.
2. Canonical source is executable.
3. Clean PostgreSQL reconstruction succeeds.
4. public.actors is created.
5. actor_id is UUID.
6. actor_id is the primary key.
7. actor_id default is uuidv7().
8. DOCTOR / NURSE constraint is enforced.
9. ACTIVE / DEACTIVATED constraint is enforced.
10. Actor-wide lifecycle semantics are represented.
11. Rebuild does not depend on undocumented database state.
12. Rebuild is reproducible.
13. Existing live Actor data is preserved.
14. Existing patient data is preserved.
15. Regression remains 31 PASS / 0 FAIL or an explicitly authorized
    updated baseline.
16. Rollback safety is proven where applicable.
17. Exact source-to-live reconciliation is proven.

No implementation may be declared canonical without these proofs.

---

## 8. AUTHORITY BOUNDARY

This decision grants only:

ACTOR_CANONICAL_REBUILD_SOURCE_IMPLEMENTATION_AUTHORITY

within the bounded scope defined above.

It does NOT grant general persistence authority.

It does NOT reopen persistence closure.

It does NOT grant authentication or authorization authority.

It does NOT grant API authority beyond previously authorized scope.

It does NOT grant UI authority.

It does NOT grant deployment authority.

It does NOT grant real-use authority.

---

## 9. FINAL AUTHORITY DECISION

ACTOR_CANONICAL_REBUILD_SOURCE_IMPLEMENTATION_AUTHORIZED = YES

AUTHORIZED_SCOPE = BOUNDED_ACTOR_CANONICAL_REBUILD_SOURCE_ONLY

CANONICAL_TARGET = public.actors

LIFECYCLE_MODEL = ACTOR_WIDE

LIFECYCLE_STATE = ACTIVE | DEACTIVATED

LIVE_DATA_DESTRUCTION = NOT_AUTHORIZED

LIVE_ACTOR_REPLACEMENT = NOT_AUTHORIZED

LIVE_ACTOR_DELETION = NOT_AUTHORIZED

DATA_MIGRATION = NOT_AUTHORIZED

AUTHENTICATION_IMPLEMENTATION = NOT_AUTHORIZED

AUTHORIZATION_IMPLEMENTATION = NOT_AUTHORIZED

API_EXPANSION = NOT_AUTHORIZED

UI_IMPLEMENTATION = NOT_AUTHORIZED

DEPLOYMENT = NOT_AUTHORIZED

REAL_USE = NOT_AUTHORIZED

REAL_PILOT = NOT_AUTHORIZED

PRODUCTION_USE = NOT_AUTHORIZED

DATA_PRESERVATION = REQUIRED

ROLLBACK_SAFETY = REQUIRED

REGRESSION_PROOF = REQUIRED

SOURCE_TO_LIVE_RECONCILIATION = REQUIRED

UNAUTHORIZED_EXPANSION = NO

FAIL = 0

0 FAIL ™ 🧬
