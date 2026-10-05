# ACTOR LIFECYCLE SEMANTICS AUTHORITY DECISION V1

## 1. PURPOSE

This document establishes the canonical domain semantics for Actor
lifecycle behavior before any authority may be granted to implement a
canonical rebuild source.

The current forensic baseline established:

ACTOR_LIFECYCLE_ALIGNMENT = PARTIAL

DOMAIN_UNDERSPECIFICATION = PROVEN

SEMANTIC_GAP = PROVEN

This document resolves the domain meaning of lifecycle_state.

This document does NOT implement schema, SQL, migrations, authentication,
authorization, API, UI, or live database changes.

---

## 2. PRESERVED ACTOR MODEL

The product has ONE independent Actor concept.

APPROVED_ROLES = DOCTOR + NURSE

Doctor:

- Main Admin
- Clinical Authority
- System Owner
- Initial Actor

Nurse:

- Operational Workflow Participant
- Created under Doctor authority
- Operates under Doctor delegation

Actor identity remains distinct from:

- username
- persistence key
- PostgreSQL runtime role
- authority context

---

## 3. LIFECYCLE SEMANTIC QUESTION

The unresolved question is:

Is lifecycle_state:

A. an Actor-wide lifecycle invariant applying equally to Doctor and Nurse,

OR

B. a Nurse-specific lifecycle concept represented physically in the broader
   Actor structure?

This decision resolves the semantic meaning before physical rebuild
authority is considered.

---

## 4. CANONICAL DOMAIN DECISION

The canonical Actor lifecycle model is:

LIFECYCLE_MODEL = ACTOR_WIDE

The lifecycle state belongs to the independent Actor concept, not to the
Nurse role alone.

Therefore:

LIFECYCLE_STATE = ACTIVE | DEACTIVATED

The same lifecycle vocabulary applies to both approved Actor roles:

DOCTOR
NURSE

The physical representation may therefore remain shared by the Actor
model without implying that lifecycle is Nurse-specific.

---

## 5. ACTIVE STATE

ACTIVE means the Actor remains an enabled participant in the product
according to the authority and operational rules applicable to that
Actor's role.

ACTIVE does NOT mean:

- authenticated
- currently logged in
- currently assigned work
- currently delegated
- currently treating a patient

Lifecycle state is distinct from authentication state, session state,
delegation state, and workflow state.

---

## 6. DEACTIVATED STATE

DEACTIVATED means the Actor remains an existing Actor whose active
participation is disabled.

Deactivation:

- does not delete the Actor,
- does not replace the Actor,
- does not change the Actor identity,
- does not erase historical associations,
- does not erase historical responsibility,
- does not transfer ownership automatically.

Therefore:

DEACTIVATION_PRESERVES_ACTOR_IDENTITY = YES

DEACTIVATION_PRESERVES_HISTORY = YES

DESTRUCTIVE_ACTOR_DELETION = PROHIBITED

---

## 7. DOCTOR LIFECYCLE SEMANTICS

Doctor is subject to the same Actor-wide lifecycle vocabulary.

Therefore:

DOCTOR_LIFECYCLE_MODEL = ACTOR_WIDE

DOCTOR_ACTIVE = VALID

DOCTOR_DEACTIVATED = VALID_STATE

However, the existence of a DEACTIVATED Doctor state does NOT by itself
authorize:

- Doctor deactivation implementation,
- automatic ownership transfer,
- automatic Main Admin replacement,
- automatic Clinical Authority transfer,
- automatic Nurse promotion,
- automatic reactivation,
- authentication behavior.

Those behaviors require separate authority decisions.

---

## 8. NURSE LIFECYCLE SEMANTICS

Nurse follows the same Actor-wide lifecycle model.

Therefore:

NURSE_ACTIVE = VALID

NURSE_DEACTIVATED = VALID_STATE

Deactivation preserves:

- Nurse Actor identity,
- historical associations,
- historical responsibility.

Nurse deletion remains prohibited.

Automatic reactivation remains prohibited.

Nurse self-creation remains prohibited.

Creation of a Nurse Actor does not transfer Doctor authority.

---

## 9. LIFECYCLE VS AUTHORITY

Lifecycle state does not determine product authority.

Therefore:

LIFECYCLE_STATE != ROLE

LIFECYCLE_STATE != AUTHORITY

LIFECYCLE_STATE != AUTHENTICATION

LIFECYCLE_STATE != SESSION

LIFECYCLE_STATE != DELEGATION

A DEACTIVATED Actor does not automatically transfer that Actor's
authority to another Actor.

Any authority transfer requires a separate explicit authority decision.

---

## 10. INITIAL MAIN ADMIN PROTECTION

The first real Main Admin Actor remains:

MAIN_ADMIN = Dr_Roby

USERNAME = DR/MK_ROBY

ROLE = DOCTOR

LIFECYCLE = ACTIVE

PERSISTENCE_KEY =
01a10d74-d2cd-7354-a5ec-228ba8988efb

This existing live Actor is preserved.

This decision does not modify that Actor.

No authority transfer is created.

---

## 11. CANONICAL PHYSICAL ALIGNMENT

The approved domain semantics are compatible with the existing physical
Actor vocabulary:

ACTOR_TABLE = public.actors

ACTOR_PERSISTENCE_KEY = actor_id

ACTOR_PERSISTENCE_TYPE = PostgreSQL UUID

ACTOR_PERSISTENCE_GENERATION = PostgreSQL 18 native uuidv7()

ACTOR_ROLE = DOCTOR | NURSE

LIFECYCLE_STORAGE = lifecycle_state

LIFECYCLE_VALUES = ACTIVE | DEACTIVATED

This section establishes semantic alignment only.

It does NOT authorize creation or modification of the physical schema.

---

## 12. REBUILD AUTHORITY DEPENDENCY

With lifecycle semantics resolved, a future canonical rebuild authority
may reference a closed domain lifecycle contract.

However, this document does NOT grant rebuild implementation authority.

Therefore:

CANONICAL_REBUILD_IMPLEMENTATION_AUTHORITY = NONE

SCHEMA_IMPLEMENTATION_AUTHORITY = NONE

MIGRATION_AUTHORITY = NONE

DATABASE_MODIFICATION_AUTHORITY = NONE

DOMAIN_IMPLEMENTATION_AUTHORITY = NONE

AUTHENTICATION_IMPLEMENTATION = NOT_AUTHORIZED

AUTHORIZATION_IMPLEMENTATION = NOT_AUTHORIZED

API_IMPLEMENTATION = NOT_AUTHORIZED

UI_IMPLEMENTATION = NOT_AUTHORIZED

---

## 13. REQUIRED FUTURE REBUILD PROOF

Any future canonical rebuild implementation must prove:

1. public.actors reconstruction from a clean PostgreSQL database.
2. actor_id UUID primary key.
3. PostgreSQL uuidv7() generation.
4. DOCTOR / NURSE role constraint.
5. ACTIVE / DEACTIVATED lifecycle constraint.
6. Actor-wide lifecycle semantics.
7. Preservation of existing live data.
8. Regression preservation.
9. Exact source-to-live reconciliation.
10. No undocumented prerequisite database state.

No implementation may be declared canonical without these proofs.

---

## 14. FINAL DOMAIN AUTHORITY DECISION

ACTOR_LIFECYCLE_SEMANTICS = CLOSED + PROVEN

LIFECYCLE_MODEL = ACTOR_WIDE

LIFECYCLE_STATE = ACTIVE | DEACTIVATED

DOCTOR_LIFECYCLE = ACTOR_WIDE

NURSE_LIFECYCLE = ACTOR_WIDE

DEACTIVATION_PRESERVES_ACTOR_IDENTITY = YES

DEACTIVATION_PRESERVES_HISTORY = YES

DESTRUCTIVE_ACTOR_DELETION = PROHIBITED

AUTOMATIC_AUTHORITY_TRANSFER = NO

AUTOMATIC_REACTIVATION = NO

NURSE_SELF_CREATION = NO

AUTHORITY_TRANSFER = SEPARATE_DECISION_REQUIRED

CANONICAL_REBUILD_IMPLEMENTATION_AUTHORITY = NONE

SCHEMA_IMPLEMENTATION_AUTHORITY = NONE

MIGRATION_AUTHORITY = NONE

DATABASE_MODIFICATION_AUTHORITY = NONE

DOMAIN_IMPLEMENTATION_AUTHORITY = NONE

LIVE_DATABASE_MODIFICATION = NO

FIRST_REAL_MAIN_ADMIN_ACTOR = PRESERVED

DATA_PRESERVATION = PROVEN

ROLLBACK_SAFETY = PROVEN

REGRESSION_BASELINE = 31 PASS / 0 FAIL

UNAUTHORIZED_EXPANSION = NO

FAIL = 0

0 FAIL ™ 🧬
