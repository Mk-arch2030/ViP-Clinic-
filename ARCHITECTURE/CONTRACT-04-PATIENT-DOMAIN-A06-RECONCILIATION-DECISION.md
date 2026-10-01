# Dr.Roby Clinic — Patient Domain A06 Reconciliation Decision

STATUS = RECONCILIATION DECISION
SCOPE = PATIENT DOMAIN
SOURCE_AUTHORITY = CONTRACT-04 A06
IMPLEMENTATION_AUTHORIZED = NO

## 1. PURPOSE

This decision reconciles the existing Patient Domain boundary with the
authoritative A06 Date of Birth and Temporal Age semantics.

This decision does not authorize source-code implementation.

## 2. PATIENT IDENTITY

PATIENT_IDENTITY = STABLE
CPN = STABLE_PRODUCT_REFERENCE
PATIENT_IDENTITY_REDEFINED = NO

The Patient remains one stable domain identity.

CPN remains the stable Product-level Patient reference.

Date of Birth and Age do not become Patient identity mechanisms.

## 3. PATIENT DATE OF BIRTH

DATE_OF_BIRTH = APPROVED_DOMAIN_PATIENT_FACT

Date of Birth belongs to the Patient domain as a stable demographic fact.

Date of Birth MUST remain associated with the same Patient identity.

Date of Birth does not become:

- Patient identity;
- CPN;
- retrieval identity;
- Visit identity;
- Case identity;
- Clinic Day identity.

## 4. AGE

AGE = DERIVED_TEMPORAL_VALUE

The Patient Domain MUST NOT treat a static Age value as the authoritative
source of Patient age after A06 reconciliation.

Age is derived from:

DATE_OF_BIRTH + RELEVANT_TEMPORAL_REFERENCE

## 5. TEMPORAL AGE SEMANTICS

AGE_AT_REGISTRATION = DERIVED

AGE_AT_ENCOUNTER = DERIVED

CURRENT_AGE = DERIVED

Age at registration is derived from Date of Birth and the applicable
registration temporal reference.

Age at Encounter is derived from Date of Birth and the applicable
Encounter temporal reference.

Current Age is derived from Date of Birth and the current applicable
real-world date.

Clinic Day opening, Clinic Day closure, or operational session state
MUST NOT become the source of Patient age.

## 6. HISTORICAL INTEGRITY

A historical Encounter's age semantics MUST remain determinable from the
Patient Date of Birth and that Encounter's applicable temporal reference.

Current Age changing over time MUST NOT rewrite the temporal meaning of a
historical Encounter.

Patient identity and CPN remain unchanged.

## 7. RETRIEVAL

RETRIEVAL_METHODS_REMAIN_UNCHANGED = YES

Approved retrieval methods remain:

- Patient Name
- Clinic Patient Number
- Barcode

Date of Birth and Age do not become retrieval identities.

## 8. PAST HISTORY

PAST_HISTORY = PATIENT_LEVEL
PAST_HISTORY_IS_VISIT = NO

A06 does not alter the existing Past History boundary.

## 9. CLINICAL HISTORY

CLINICAL_HISTORY = ACCUMULATED_FROM_VISITS

A06 does not redefine Clinical History.

## 10. DOMAIN IMPLEMENTATION RECONCILIATION

The current implementation contains a static:

age

field.

Following this reconciliation, the authoritative semantic model is:

dateOfBirth = persistent Patient fact

age = derived temporal value

The existing static Age representation MUST NOT remain the authoritative
source of Patient age after the authorized implementation transition.

Any implementation transition MUST preserve:

- Patient identity;
- CPN;
- existing retrieval methods;
- Past History boundary;
- Clinical History boundary;
- existing authorized Patient capability scope.

## 11. PERSISTENCE BOUNDARY

This reconciliation does not select:

- SQL column names;
- SQL data types;
- database schema;
- migrations;
- repository implementation;
- indexes;
- constraints;
- age caching;
- age materialization;
- registration timestamp persistence.

Persistence remains subject to its own technical authorization gate.

## 12. API / UI BOUNDARY

This reconciliation does not authorize API or UI implementation.

The intended Product display semantics are:

CPN + Patient Name + Date of Birth + Current Derived Age + approved
Patient Basic / Personal Data.

Actual API and UI implementation remains separately authorized.

## 13. AUTHORITY AND SAFETY

NEW_ACTOR = NO

NEW_AUTHORITY = NO

NEW_CLINICAL_CAPABILITY = NO

NEW_PATIENT_IDENTITY = NO

NEW_RETRIEVAL_METHOD = NO

PATIENT_IDENTITY_REDEFINED = NO

CPN_REDEFINED = NO

PAST_HISTORY_REDEFINED = NO

CLINICAL_HISTORY_REDEFINED = NO

PRODUCT_SCOPE_EXPANSION = NO

CONTRACT_MUTATION = NO

SOURCE_CODE_IMPLEMENTATION = NO

PERSISTENCE_IMPLEMENTATION = NO

SQL_IMPLEMENTATION = NO

API_IMPLEMENTATION = NO

UI_IMPLEMENTATION = NO

UNAUTHORIZED_EXPANSION = NO

FAIL = 0

## 14. CLOSURE

This decision reconciles the Patient Domain semantic boundary with A06.

A06 remains the authoritative source for Date of Birth and temporal Age
semantics.

This decision does not authorize implementation.

The next implementation step requires a separate authorized Domain
implementation gate and proof.

PATIENT_DOMAIN_A06_RECONCILIATION = CLOSED + PROVEN

NEXT_GATE = DOMAIN_IMPLEMENTATION_RECONCILIATION_AUTHORIZATION
