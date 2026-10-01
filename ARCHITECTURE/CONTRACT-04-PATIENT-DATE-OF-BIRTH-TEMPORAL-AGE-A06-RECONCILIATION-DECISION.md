# Dr.Roby Clinic — CONTRACT-04 Patient Date of Birth & Temporal Age Semantics A06 Reconciliation Decision

STATUS = RECONCILIATION DECISION
AMENDMENT = A06
SCOPE = PATIENT BASIC / PERSONAL DATA / TEMPORAL AGE SEMANTICS

IMPLEMENTATION_AUTHORIZED = NO
SCHEMA_IMPLEMENTATION_AUTHORIZED = NO


## 1. PURPOSE

This decision records the controlled reconciliation of Patient Date of Birth
and temporal Age semantics against the existing Patient identity, CPN,
registration, retrieval, and domain boundaries.

This decision does not authorize source-code, persistence-schema, SQL,
repository, API, UI, authentication, authorization, or workflow implementation.


## 2. APPROVED PATIENT FACT — DATE OF BIRTH

Date of Birth (DOB) is APPROVED as a persistent Patient Basic / Personal Data fact.

DOB represents the Patient's stable date-of-birth fact.

DOB does not redefine Patient identity.

DOB does not become a retrieval identity.

DOB does not become a CPN.


## 3. AGE SEMANTICS

Age is APPROVED as a DERIVED TEMPORAL VALUE.

Age MUST NOT be treated as an immutable permanent Patient fact.

Age is derived from:

DOB + relevant temporal reference date


## 4. AGE AT FIRST REGISTRATION

AGE_AT_REGISTRATION = DERIVED

At first Patient registration, the system may present the Patient's age
calculated from the recorded DOB against the applicable registration
reference date.

The registration event establishes the temporal reference for this
derived value.

This decision does not independently establish a new Product field for
registration timestamp beyond the existing first-registration event.


## 5. AGE AT CLINICAL ENCOUNTER

AGE_AT_ENCOUNTER = DERIVED

For a Clinical Encounter, the Patient's age is derived from the recorded
DOB against the Encounter's applicable date.

Historical Encounter age semantics MUST remain reproducible from the
Patient DOB and the Encounter temporal reference.

A later change in the current date MUST NOT alter the historical temporal
meaning of an earlier Encounter.


## 6. CURRENT AGE

CURRENT_AGE = DERIVED

Current Patient age is derived from the recorded DOB against the current
applicable real-world date.

Current age MUST update naturally as real time advances.

Clinic opening, Clinic closing, Clinic Day closure, or operational
session state MUST NOT freeze or redefine Patient age.


## 7. PATIENT IDENTITY RECONCILIATION

PATIENT_IDENTITY = UNCHANGED

CPN = STABLE

The Clinic Patient Number remains the stable Product-level Patient
reference.

Date of Birth does not become Patient identity.

Age does not become Patient identity.

Technical persistence identity remains distinct from CPN.


## 8. RETRIEVAL RECONCILIATION

NEW_RETRIEVAL_METHOD = NO

Approved retrieval methods remain:

- Patient Name
- Clinic Patient Number
- Barcode

DOB and Age do not become retrieval identities.


## 9. APPLICATION CAPABILITY RECONCILIATION

A06 introduces no:

- new Actor;
- new authority;
- new clinical capability;
- new Case state;
- new Visit state;
- new workflow;
- new Patient identity;
- new retrieval mechanism.

Existing Patient registration and retrieval capabilities remain the same
in scope, with the Patient Basic / Personal Data semantics reconciled to
include DOB and derived temporal Age.


## 10. DOMAIN SEMANTICS

The Patient remains one stable Patient domain identity.

The Patient retains:

- Stable Patient identity reference
- Stable CPN
- Date of Birth
- Basic / Personal Data

Age is represented semantically as a derived temporal value.

The Domain MUST NOT treat a stored static Age value as the authoritative
source of Patient age once DOB-based temporal semantics are adopted.


## 11. LONGITUDINAL INTEGRITY

The Patient's DOB remains associated with the stable Patient identity.

Current age may change as time advances.

Age at a historical Encounter is determined against that Encounter's
temporal reference.

Patient identity and CPN remain unchanged across all such temporal
changes.


## 12. DISPLAY RECONCILIATION

When existing Patient information is displayed, the Patient's CPN remains
the stable identifying reference and may be presented together with:

- Patient Name
- Date of Birth
- Current derived Age
- Profession
- Phone Number
- Gender

This section defines Product display semantics only.

It does not authorize UI implementation.


## 13. PERSISTENCE BOUNDARY

A06 does not select:

- SQL table structure;
- SQL column implementation;
- SQL data type;
- index;
- constraint;
- migration;
- ORM mapping;
- repository implementation;
- timestamp implementation;
- age caching strategy;
- age materialization strategy.

Persistence technical reconciliation remains subject to its own
authorized implementation gate.


## 14. IMPLEMENTATION BOUNDARY

The following remain NOT AUTHORIZED by A06:

- source-code mutation;
- Patient domain implementation mutation;
- persistence schema implementation;
- SQL implementation;
- migration implementation;
- ORM implementation;
- repository implementation;
- API implementation;
- UI implementation;
- authentication implementation;
- authorization implementation;
- workflow runtime implementation;
- deployment implementation.


## 15. SAFETY INVARIANTS

DOB = APPROVED PATIENT FACT

AGE = DERIVED TEMPORAL VALUE

AGE_AT_REGISTRATION = DERIVED

AGE_AT_ENCOUNTER = DERIVED

CURRENT_AGE = DERIVED

CPN = STABLE

PATIENT_IDENTITY = UNCHANGED

NEW_PATIENT_IDENTITY = NO

NEW_RETRIEVAL_METHOD = NO

NEW_ACTOR = NO

NEW_AUTHORITY = NO

NEW_CLINICAL_CAPABILITY = NO

PERSISTENCE_IMPLEMENTATION = NO

SOURCE_CODE_IMPLEMENTATION = NO

UNAUTHORIZED_EXPANSION = NO

FAIL = 0


## 16. DECISION CLOSURE

A06 establishes the authoritative Product / Domain semantic direction for
Patient Date of Birth and temporal Age.

A06 does not modify or erase the historical A05 decision.

Any implementation must proceed through the appropriate subsequent
Domain, Persistence, Application, API, and UI authorization gates.

A06 = CLOSED + PROVEN
