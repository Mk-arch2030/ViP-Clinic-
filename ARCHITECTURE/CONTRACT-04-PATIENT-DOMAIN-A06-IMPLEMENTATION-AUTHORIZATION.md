# Dr.Roby Clinic — CONTRACT-04 Patient Domain A06 Implementation Authorization

STATUS = IMPLEMENTATION AUTHORIZATION
SCOPE = DOMAIN_ONLY
SOURCE_AUTHORITY = A06
RECONCILIATION_AUTHORITY = PATIENT_DOMAIN_A06_RECONCILIATION

DOMAIN_IMPLEMENTATION_AUTHORIZED = YES

## 1. AUTHORIZED PURPOSE

Authorize the bounded implementation of the reconciled Patient Domain
semantics established by A06.

The implementation is limited to Patient Domain representation and
behavior required to establish Date of Birth and derived temporal Age
semantics.

## 2. AUTHORIZED DOMAIN CHANGES

AUTHORIZED:

- Add Date of Birth to the Patient Domain representation.
- Establish Date of Birth as a stable Patient demographic fact.
- Replace static Age authority with derived temporal Age semantics.
- Support derivation of Current Age from Date of Birth and the applicable
  current real-world date.
- Preserve stable Patient identity.
- Preserve stable CPN.
- Preserve existing approved Patient fields.
- Preserve existing retrieval-method boundaries.
- Preserve Past History as Patient-level.
- Preserve Clinical History as accumulated from Visits.

## 3. AGE AUTHORITY

DATE_OF_BIRTH = AUTHORITATIVE_PATIENT_FACT

AGE = DERIVED_TEMPORAL_VALUE

AGE_AT_REGISTRATION = DERIVED

AGE_AT_ENCOUNTER = DERIVED

CURRENT_AGE = DERIVED

A static stored Age value MUST NOT remain the authoritative source of
Patient age.

## 4. IDENTITY INVARIANTS

PATIENT_IDENTITY = STABLE

CPN = STABLE_PRODUCT_REFERENCE

PATIENT_IDENTITY_REDEFINED = NO

NEW_PATIENT_IDENTITY = NO

CPN_REDEFINED = NO

Date of Birth and Age MUST NOT become identity mechanisms.

## 5. RETRIEVAL INVARIANTS

RETRIEVAL_METHODS_UNCHANGED = YES

Approved retrieval methods remain:

- Patient Name
- Clinic Patient Number
- Barcode

Date of Birth and Age MUST NOT become retrieval methods or identities.

## 6. DELEGATION / AUTHORITY SAFETY

NEW_ACTOR = NO

NEW_AUTHORITY = NO

NEW_CLINICAL_CAPABILITY = NO

AUTHORITY_TRANSFER = NO

The implementation MUST NOT introduce authentication, authorization,
workflow, clinical decision authority, or actor changes.

## 7. PAST HISTORY SAFETY

PAST_HISTORY = PATIENT_LEVEL

PAST_HISTORY_IS_VISIT = NO

The implementation MUST NOT redefine Past History.

## 8. CLINICAL HISTORY SAFETY

CLINICAL_HISTORY = ACCUMULATED_FROM_VISITS

The implementation MUST NOT redefine Clinical History.

## 9. EXPLICITLY NOT AUTHORIZED

The following remain outside this authorization:

- SQL implementation
- database schema changes
- migrations
- ORM
- repository changes
- persistence implementation
- API implementation
- UI implementation
- authentication
- authorization
- workflow runtime
- Case implementation
- Visit implementation
- Encounter implementation
- Clinic Day implementation
- Pharmacotherapy implementation
- Clinical History persistence implementation
- Past History persistence implementation
- deployment changes

## 10. IMPLEMENTATION SAFETY

The implementation MUST NOT:

- change CPN semantics;
- change Patient identity;
- add retrieval mechanisms;
- create a new Patient object type;
- introduce a new Actor;
- introduce a new authority;
- introduce a new clinical capability;
- mutate A05;
- mutate A06;
- mutate the Patient Domain reconciliation decision;
- resolve unrelated deferred persistence decisions.

## 11. PROOF REQUIREMENTS

After implementation:

- Patient Domain tests MUST pass.
- Existing Patient registration tests MUST pass.
- Existing Patient retrieval tests MUST pass.
- Existing repository tests MUST pass.
- Existing API/controller tests MUST pass where the unchanged domain
  contract is exercised.
- No SQL execution is authorized by this decision.
- No database mutation is authorized by this decision.
- No server restart is required by this decision.

FAIL = 0

## 12. CLOSURE

DOMAIN_IMPLEMENTATION_AUTHORIZED = YES

AUTHORIZATION_SCOPE = PATIENT_DOMAIN_A06_ONLY

PERSISTENCE_IMPLEMENTATION_AUTHORIZED = NO

SQL_IMPLEMENTATION_AUTHORIZED = NO

API_IMPLEMENTATION_AUTHORIZED = NO

UI_IMPLEMENTATION_AUTHORIZED = NO

UNAUTHORIZED_SCOPE_EXPANSION = NO

FAIL = 0

NEXT_GATE = PATIENT_DOMAIN_A06_IMPLEMENTATION
