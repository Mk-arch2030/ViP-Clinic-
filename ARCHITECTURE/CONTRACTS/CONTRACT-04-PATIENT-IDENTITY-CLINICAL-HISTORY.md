# DR. ROBY CLINIC — CONTRACT-04
# PATIENT IDENTITY & CLINICAL HISTORY CONTRACT

## 1. PURPOSE

This Contract defines the product-level rules for Patient identity,
Patient information, Past History, and Clinical History.

It converts the approved Manuscript and Domain Specification into
mandatory product rules.

This Contract does not define database schema, migrations, API contracts,
UI contracts, authentication, authorization implementation, deployment,
or technical storage mechanisms.

---

## 2. PATIENT IDENTITY

A Patient is the clinic's persistent patient identity.

When a patient is registered for the first time, the system generates
a Clinic Patient Number.

The Clinic Patient Number is the stable clinic reference for the Patient
identity.

The Patient must be retrievable through the patient's name, Clinic
Patient Number, or barcode as current product-level retrieval methods.

The Doctor decides which available retrieval method to use.

These retrieval methods provide alternative ways to reach the same
existing Patient identity.

The Clinic Patient Number remains the stable clinic identity reference.

Name, Clinic Patient Number, and barcode are retrieval methods and do
not replace or redefine the Patient identity.

It is not a Visit identifier.

It is not a Case identifier.

It is not a Clinic Day identifier.

---

## 3. NEW PATIENT

A new patient enters the clinic system through registration.

The registration establishes:

- Patient identity.
- Clinic Patient Number.
- Basic / Personal Data.
- Past History.

Past History represents relevant history from before the patient's
history was accumulated through recorded clinic Visits.

Past History is distinct from a Visit.

Past History is not an old Visit.

---

## 4. RETURNING PATIENT

A returning patient must be reachable through any of the approved
current retrieval methods:

Patient Name
Clinic Patient Number
Barcode

The Doctor decides which retrieval method to use.

The product-level retrieval flow is:

Name / Clinic Patient Number / Barcode
        ↓
Search / Retrieve
        ↓
Existing Patient
        ↓
Existing History

All approved retrieval methods must lead to the same existing Patient
identity.

The Clinic Patient Number remains the stable clinic identity reference.

The product must not require the Doctor to remember a Clinic Patient
Number or barcode for routine patient retrieval.

A returning patient does not become a new Patient merely because a new
clinical encounter occurs.

The system must preserve the existing Patient identity and historical
record when the patient returns.

A returning patient does not become a new Patient merely because a new
clinical encounter occurs.

---

## 5. BASIC / PERSONAL DATA

Patient information includes Basic / Personal Data.

Examples of currently approved information include:

- Name.
- Age.
- Profession when necessary.

The exact complete field set is not defined by this Contract.

Additional patient-information fields require deliberate design decisions.

---

## 6. PAST HISTORY

Past History belongs to the Patient information established during
initial patient registration.

Past History describes relevant history from before the patient entered
the clinic's recorded Visit history.

Past History must remain distinguishable from Clinical History.

Past History must not be treated as a historical Visit.

---

## 7. CLINICAL HISTORY

Clinical History is the accumulated history created by recorded Visits.

The conceptual structure is:

Patient
   ↓
Clinical History
   ├── Visit 1
   ├── Visit 2
   ├── Visit 3
   └── Visit N

Each recorded Visit contributes to the Patient's Clinical History.

Previous Visits remain historically meaningful.

A later Visit does not overwrite an earlier Visit.

---

## 8. CASE AND CLINICAL HISTORY

A Visit belongs to a Case according to CONTRACT-01.

A Case belongs to exactly one Patient.

A Patient may have multiple Cases when clinically and operationally
appropriate.

Clinical History is the Patient-level accumulated history of recorded
Visits across the Patient's Cases.

The Patient remains the stable identity while Cases and Visits represent
the patient's clinical journeys and encounters.

---

## 9. FOLLOW-UP

When a patient returns for follow-up:

- The existing Patient identity is retrieved.
- The existing history remains preserved.
- The applicable existing Case may continue.
- The follow-up encounter is recorded as a new Visit.
- The new Visit belongs to the appropriate Clinic Day.

A follow-up Visit must not overwrite a previous Visit.

A follow-up return does not create a duplicate Patient identity.

---

## 10. HISTORY PRESERVATION

The product must preserve the distinction between:

- Patient identity.
- Basic / Personal Data.
- Past History.
- Clinical History.
- Case history.
- Individual Visits.

Historical Visits remain part of the Patient's accumulated Clinical History.

The product must not collapse the Patient's history into only the latest
Visit.

---

## 11. CLINICAL AUTHORITY BOUNDARY

Clinical History records the history of the patient's recorded care.

This Contract does not redefine clinical authority.

Doctor clinical authority remains governed by CONTRACT-03.

A Nurse may participate in delegated operational data recording according
to the authority boundaries already established by CONTRACT-03.

Recording information does not by itself transfer clinical authority.

---

## 11A. CLINICAL HISTORY AND AUTHORITY CLARIFICATION

Past History is distinct from Visits.

Clinical History accumulates from recorded Visits.

Prior Visit history is preserved and is not overwritten by later Visits.

A follow-up return creates a new Visit within the applicable existing
Case and a new Clinic Day.

Clinical authority remains with the Doctor.

This contract does not authorize implementation of any technical
mechanism.

## 11B. RETRIEVAL CONSISTENCY

The system generates a Clinic Patient Number at first registration.

Name, Clinic Patient Number, and Barcode are alternative retrieval
methods for the same existing Patient identity.

Using any approved retrieval method reaches the same Patient identity
and does not create a new Patient.

Retrieval methods are not identities.

The Clinic Patient Number remains the stable Patient identity reference.

## 12. IDENTITY AND RETRIEVAL BOUNDARY

The Clinic Patient Number is the stable Patient identity reference.

The approved current retrieval methods are:

- Patient Name
- Clinic Patient Number
- Barcode

The Doctor decides which approved retrieval method to use.

The Doctor must be able to reach an existing Patient through any of
these methods without changing or replacing the Patient identity.

Name, Clinic Patient Number, and barcode are retrieval methods, not
separate identities.

Barcode is therefore part of the current retrieval capability.

Any future additional convenience retrieval mechanism must preserve the
Patient's existing Clinic Patient Number identity and requires
deliberate design.

---

## 13. RELATIONSHIP TO CLINIC DAY, CASE, AND VISIT

The approved conceptual relationship is:

Clinic Day
    ↓
Case
    ↓
Patient
    ↓
Visit
    ↓
Clinical History

with the operational Visit flow:

Arrival → Doctor → Exit

The Patient identity persists beyond an individual Clinic Day.

A Case may persist beyond an individual Clinic Day.

A Visit is a recorded encounter within a Case and Clinic Day.

Closing a Clinic Day does not erase or complete the Patient's history.

---

## 14. NON-AUTHORIZATION

This Contract does not authorize:

- Database schema.
- Database migrations.
- API contracts.
- UI contracts.
- Authentication implementation.
- Authorization implementation.
- Technical identity mechanisms.
- Technical history-storage mechanisms.
- Barcode implementation.
- Search implementation.
- Deployment architecture.
- Any capability outside the approved product scope.

---

## 15. CONTRACT DEPENDENCIES

This Contract is derived from:

- Product Manuscript.
- Domain Specification.
- CONTRACT-01 — Patient / Case / Visit.
- CONTRACT-02 — Clinic Day.
- CONTRACT-03 — Actor & Authority.

The referenced contracts remain authoritative.

This Contract does not modify those contracts.

---

## 16. IMPLEMENTATION DISCIPLINE

The existence of this Contract does not authorize implementation.

Implementation remains blocked until the required contract and design gates
are deliberately completed.

Database schema, API, UI, authentication, authorization, workflow
implementation, and deployment require their own authorized gates.

---

## 17. CLOSURE CRITERIA

CONTRACT-04 may be considered PASS only after its required Patient
identity, Past History, Clinical History, returning-patient, and history
preservation rules are explicitly proven against the approved source
landmarks.

Until closure:

- Implementation remains unauthorized.
- Database schema remains unauthorized.
- API remains unauthorized.
- UI remains unauthorized.
- Authorization implementation remains unauthorized.

