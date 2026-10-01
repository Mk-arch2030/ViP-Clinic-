# Dr.Roby Clinic — CONTRACT-04 Patient Information Controlled Amendment A05

STATUS = CONTROLLED AMENDMENT
AMENDMENT = A05
SCOPE = PATIENT BASIC / PERSONAL DATA
IMPLEMENTATION_AUTHORIZED = NO

---

## 1. PURPOSE

This controlled amendment updates the approved Patient Basic / Personal
Data field set under CONTRACT-04.

This amendment is limited to Patient information representation.

It does not authorize source-code implementation, persistence schema
implementation, API, UI, authentication, authorization, workflow runtime,
or deployment changes.

---

## 2. APPROVED PATIENT BASIC / PERSONAL DATA

The approved Patient Basic / Personal Data field set is:

- Name = APPROVED
- Age = APPROVED
- Profession = APPROVED WHEN NECESSARY
- Phone Number = REQUIRED
- Gender = REQUIRED

The exact technical representation of these fields remains subject to
the separately authorized implementation gates.

---

## 3. GENDER DEFINITION

Gender is a required Patient Basic / Personal Data field.

Approved Gender values are exactly:

- Male
- Female

No additional Gender values are introduced by this amendment.

---

## 4. PHONE NUMBER

Phone Number is a required Patient Basic / Personal Data field.

This amendment establishes required presence only.

Phone-number format, normalization, validation rules, uniqueness,
multiple-number behavior, privacy behavior, and technical storage
representation remain DEFERRED pending deliberate technical decisions.

---

## 5. IDENTITY BOUNDARY

Phone Number and Gender are Patient information fields.

They do NOT become Patient identity mechanisms.

They do NOT replace or redefine:

- Clinic Patient Number (CPN)
- Patient technical persistence identifier

Name, Phone Number, and Gender do not independently redefine Patient
identity.

CPN remains the stable Product-level Patient identity reference.

---

## 6. RETRIEVAL BOUNDARY

This amendment does not authorize Phone Number or Gender as new retrieval
methods.

The currently approved retrieval methods remain those already established
by CONTRACT-04:

- Patient Name
- Clinic Patient Number
- Barcode

Any future retrieval use of Phone Number requires a separate deliberate
Product decision.

---

## 7. PERSISTENCE BOUNDARY

This amendment establishes Product-level Patient information only.

It does not select:

- SQL columns
- SQL data types
- constraints
- indexes
- ORM representation
- migration behavior
- repository behavior
- API representation
- UI representation

Persistence reconciliation must be completed before any schema
implementation authorization.

---

## 8. IMPLEMENTATION BOUNDARY

The following remain NOT AUTHORIZED by A05:

- source-code mutation
- Patient domain implementation mutation
- persistence schema implementation
- SQL implementation
- migration implementation
- ORM implementation
- repository implementation
- API implementation
- UI implementation
- authentication implementation
- authorization implementation
- workflow runtime implementation
- deployment implementation

---

## 9. SAFETY INVARIANTS

PATIENT_IDENTITY_REDEFINED = NO
NEW_PATIENT_IDENTITY = NO
NEW_RETRIEVAL_METHOD = NO
NEW_ACTOR = NO
NEW_AUTHORITY = NO
NEW_CLINICAL_CAPABILITY = NO
PERSISTENCE_IMPLEMENTATION = NO
SOURCE_CODE_IMPLEMENTATION = NO
UNAUTHORIZED_EXPANSION = NO

---

## 10. REQUIRED RECONCILIATION

A05 requires controlled reconciliation against:

- CONTRACT-04 — Patient Identity / Clinical History
- APPLICATION-CAPABILITY-CONTRACT-V1
- PERSISTENCE-TECHNICAL-CONTRACT-V1
- PATIENT-INFORMATION-DOMAIN-REPRESENTATION
- PATIENT-DOMAIN-IMPLEMENTATION-RECONCILIATION
- PATIENT-INFORMATION-IMPLEMENTATION-DECISION
- CONTRACT-04 Patient Information Closure Reconciliation
- CONTRACT-04 Patient Information Closure Decision
- Persistence Schema Definition V1
- Persistence Physical Structural Definition V1

No implementation gate may proceed until the amendment and its affected
representations are reconciled and proven.

---

## 11. CURRENT DECISION

A05 = PROPOSED CONTROLLED CONTRACT AMENDMENT
PHONE_NUMBER = REQUIRED
GENDER = REQUIRED
GENDER_VALUES = MALE / FEMALE

IMPLEMENTATION_AUTHORIZED = NO
SCHEMA_IMPLEMENTATION_AUTHORIZED = NO
FAIL = 0

NEXT_GATE =
A05 CONTRACT RECONCILIATION
