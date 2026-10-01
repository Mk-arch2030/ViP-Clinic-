# SNAPSHOT — A06 FIRST DATE OF BIRTH

## Snapshot Identity

- Snapshot ID: A06-FIRST-DOB-20260927
- Date: 2026-09-27
- Project: Dr.Roby Clinic
- Milestone: Patient Date of Birth / Temporal Age Reconciliation
- Status: CLOSED + PROVEN

## Historical Marker

## Symbolic Factory Signature

🎂 **First Birthday — 1/2/1990**

This date is recorded symbolically as the birth date of the
factory owner and as the first Date of Birth fingerprint associated
with the A06 architectural milestone.

It is a symbolic factory signature only.
It is NOT patient data and does NOT represent a real patient record.


This snapshot records the architectural milestone at which
Date of Birth became the authoritative persistent Patient fact
and Age became a derived temporal value.

The first Date of Birth used in the A06 repository test proof was:

- Date of Birth: 1990-02-01
- Semantic meaning: 1 February 1990
- Context: Dummy Unit-Test fixture only
- Database insertion: NONE

This date corresponds to the birth date of the factory owner,
recorded here as a symbolic architectural fingerprint and not
as real patient data.

## A06 Authority Transition

- DOB = AUTHORITATIVE PATIENT FACT
- AGE = DERIVED TEMPORAL VALUE
- AGE_IS_AUTHORITATIVE_STORED_PATIENT_FACT = NO
- AGE_DERIVATION_SOURCE = DOB
- AGE_AT_REGISTRATION = DERIVED
- AGE_AT_ENCOUNTER = DERIVED
- CURRENT_AGE = DERIVED
- CPN = STABLE
- PATIENT_IDENTITY = UNCHANGED

## Persistence State

- LEGACY_STATIC_AGE_STORAGE = REMOVED
- DOB_PERSISTENCE = ESTABLISHED
- OLD_DUMMY_PATIENT_ROWS = REMOVED
- CPN_SEQUENCE = RESET
- PATIENT_ROWS_AFTER_RESET = 0
- DATABASE_MUTATION_DURING_SOURCE_REGRESSION = NONE

## Source Regression Proof

- REGISTER_NEW_PATIENT_TRANSACTION_TEST = PASS
- REGISTER_NEW_PATIENT_ROLLBACK_TEST = PASS
- RETRIEVE_EXISTING_PATIENT_SERVICE_TEST = PASS
- RETRIEVE_EXISTING_PATIENT_MISSING_RESULT_TEST = PASS
- PATIENT_REPOSITORY_CREATE_TEST = PASS
- PATIENT_REPOSITORY_RETRIEVE_TEST = PASS

### Final Regression Result

- TESTS = 6
- PASS = 6
- FAIL = 0
- CANCELLED = 0
- SKIPPED = 0
- TODO = 0
- GIT_DIFF_CHECK = PASS
- A06_SOURCE_REGRESSION = PASS

## Architectural Meaning

A06 establishes the temporal identity rule:

Patient identity remains stable.
Date of Birth remains stable.
Age is never the authoritative stored Patient fact.
Age is derived from Date of Birth against the applicable temporal reference.

Clinic opening, clinic closing, clinic-day closure, or session state
must not freeze or redefine Patient age.

Historical encounter age remains reproducible from Date of Birth
and the encounter temporal reference.

## Boundary

This snapshot does NOT authorize:

- Case implementation
- Visit implementation
- Encounter implementation
- Clinic Day implementation
- API expansion
- UI implementation
- Authentication implementation
- Authorization implementation
- Migration framework
- ORM implementation
- Background age materialization
- Any unrelated product expansion

## Gate

A06 = CLOSED + PROVEN

Next architectural work must proceed from the established gate
without reopening A06 unless new evidence requires reconciliation.

---

SNAPSHOT_END = A06-FIRST-DOB-20260927
FAIL = 0
