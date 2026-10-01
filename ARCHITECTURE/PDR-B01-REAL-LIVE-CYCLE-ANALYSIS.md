# PDR-B01 — REAL LIVE PATIENT CYCLE ANALYSIS

STATUS = ANALYSIS DRAFT
AUTHORITY = FACTORY
IMPLEMENTATION_AUTHORIZED = NO
DATABASE_SCHEMA_AUTHORIZED = NO
PERSISTENCE_IMPLEMENTATION_AUTHORIZED = NO

---

## 1. PURPOSE

Evaluate the two unresolved technical Patient-key models against the
real product Patient lifecycle already established by the Factory.

This analysis does not select a model.

The purpose is to determine whether either model conflicts with the
authoritative Patient lifecycle.

---

## 2. AUTHORITATIVE REAL PATIENT CYCLE

The Patient lifecycle is:

FIRST REGISTRATION
→ Patient identity established
→ Clinic Patient Number generated once
→ Clinic Patient Number recorded once with Patient identity
→ Patient becomes persistently retrievable

RETRIEVAL
→ by Name
→ or Clinic Patient Number
→ or Barcode
→ all reach the same existing Patient identity

FIRST VISIT
→ Visit belongs to existing Patient
→ Visit belongs to Case
→ Visit belongs to Clinic Day
→ Visit contains the clinical encounter information

PATIENT EXIT
→ current Visit ends
→ Patient identity remains
→ Case does not automatically complete

LATER RETURN
→ existing Patient is retrieved
→ existing Clinic Patient Number is reused
→ no new Patient identity is created
→ no new Patient number is generated merely because the Patient returned

LATER VISIT
→ new Visit
→ same Patient
→ same Patient identity
→ same Clinic Patient Number
→ potentially same continuing Case

CLINICAL HISTORY
→ accumulated from recorded Visits
→ previous Visits remain preserved

CASE COMPLETION
→ established by Doctor
→ does not redefine Patient identity
→ does not replace Patient number

CLINIC DAY CLOSURE
→ closes the Clinic Day according to product rules
→ does not erase Patient identity
→ does not create a new Patient identity

---

## 3. MODEL 1 — CPN AS TECHNICAL PATIENT KEY

### Lifecycle compatibility

The model can represent:

- one persistent Patient;
- one stable CPN;
- multiple Visits belonging to that Patient;
- multiple Clinic Days;
- continuing Cases;
- accumulated Clinical History.

### Required invariant

The CPN must remain stable for the Patient lifecycle because it is both
the product-level clinic reference and the persistence-level Patient key.

### Consequence

The product decision already establishes that CPN is generated once and
recorded once with the Patient identity.

Therefore Model 1 does not introduce a contradiction with the current
real Patient lifecycle.

### Remaining technical responsibility

The future Persistence Technical Contract would need to explicitly state
the technical-key semantics and the identifier representation.

No schema or SQL is authorized by this analysis.

---

## 4. MODEL 2 — SEPARATE TECHNICAL PATIENT KEY

### Lifecycle compatibility

The model can also represent:

- one persistent Patient;
- one stable CPN;
- multiple Visits;
- multiple Clinic Days;
- continuing Cases;
- accumulated Clinical History.

### Required invariant

The internal technical key must remain a persistence identity only.

It must not become a second Patient identity.

The CPN remains the product-level stable clinic reference.

### Consequence

The real Patient lifecycle can be preserved, but the Persistence
Technical Contract must explicitly distinguish:

Patient product identity
from
persistence technical identifier.

No schema or SQL is authorized by this analysis.

---

## 5. RETRIEVAL TEST

The following must all converge on exactly the same Patient:

Name
→ Patient

CPN
→ Patient

Barcode
→ Patient

Neither model inherently conflicts with this requirement.

The retrieval method is not the Patient identity.

---

## 6. RETURNING PATIENT TEST

A Patient returns after a previous Visit.

Expected product behavior:

- retrieve existing Patient;
- retain existing CPN;
- do not generate another Patient number;
- create/continue the appropriate Visit and Case according to the
  existing product contracts.

Model 1 can satisfy this.

Model 2 can satisfy this.

Therefore the returning-Patient behavior does not independently force
one model over the other.

---

## 7. VISIT ISOLATION TEST

A new Visit must not create a new Patient identity.

The CPN remains associated with the Patient.

The Visit is a separate product concept.

Model 1 can satisfy this.

Model 2 can satisfy this.

Therefore Visit isolation does not independently force one model over
the other.

---

## 8. CLINICAL HISTORY TEST

Clinical History accumulates through Visits.

Previous Visits remain preserved.

The Patient remains the same identity across the history.

Neither Patient-key model conflicts with this requirement.

The Patient key is an anchor for the Patient relationship; it does not
become the Visit identity.

---

## 9. CASE CONTINUATION TEST

A Case may continue across multiple Visits and Clinic Days.

The Patient remains unchanged.

The CPN remains unchanged.

Neither model inherently conflicts with Case continuation.

---

## 10. PRODUCT LIFECYCLE RESULT

The REAL LIVE PATIENT CYCLE does not, by itself, distinguish Model 1
from Model 2.

Both models can preserve the currently authoritative product lifecycle
provided their technical semantics are explicitly defined.

Therefore:

REAL_LIVE_CYCLE_COMPATIBILITY
=
MODEL_1 PASS
AND
MODEL_2 PASS

This result does not select either model.

---

## 11. WHAT THE REAL LIVE CYCLE HAS ACTUALLY CLOSED

The Factory has now established that the following are not valid reasons
to introduce a second Patient identity or a regenerated CPN:

- a later Visit;
- a later Clinic Day;
- a continuing Case;
- accumulated Clinical History;
- a new retrieval operation.

The Patient identity remains persistent.

The CPN remains the stable clinic reference.

---

## 12. REMAINING B01 QUESTION

The unresolved question is now narrower:

Does the Factory want the stable Clinic Patient Number itself to serve as
the persistence technical Patient key, or does the persistence layer need
a separate technical key while preserving CPN as the stable product
reference?

The real Patient lifecycle does not force the answer.

The answer remains a deliberate Factory technical decision.

---

## 13. SCOPE GUARD

This document does not authorize:

- SQL;
- database tables;
- database columns;
- migrations;
- ORM;
- repositories;
- API;
- UI;
- authentication;
- authorization;
- runtime changes.

DATABASE_SCHEMA remains NOT_DEFINED.

PERSISTENCE_IMPLEMENTATION_AUTHORIZED remains NO.

END OF PDR-B01 REAL LIVE CYCLE ANALYSIS
