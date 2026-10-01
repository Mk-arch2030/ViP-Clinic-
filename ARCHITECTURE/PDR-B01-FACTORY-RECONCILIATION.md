# PDR-B01 — FACTORY RECONCILIATION
## Technical Patient Key

STATUS = FACTORY RECONCILIATION DRAFT
AUTHORITY = FACTORY
IMPLEMENTATION_AUTHORIZED = NO
DATABASE_SCHEMA_AUTHORIZED = NO
PERSISTENCE_IMPLEMENTATION_AUTHORIZED = NO

---

## 1. PURPOSE

This document reconciles the complete authoritative product and
architecture knowledge currently available for PDR-B01.

It separates:

1. decisions already established by the Product Manuscript and closed
   contracts;
2. technical questions still open;
3. decisions that require explicit Factory closure;
4. decisions that may remain inside the Persistence Technical Contract.

This document does not authorize implementation.

It does not select a technical Patient key model.

---

## 2. AUTHORITY ORDER

The reconciliation authority order is:

MANUSCRIPT
→ CLOSED CONTRACTS C01–C08
→ PROVEN DOMAIN / PERSISTENCE BOUNDARY
→ COMMITTED PERSISTENCE DECISION REGISTER
→ FACTORY RECONCILIATION
→ EXTERNAL EXCAVATOR ANALYSIS AS EVIDENCE ONLY

OX ALPHA and DeepSeek provide excavation, alternatives, consequences,
and contradiction detection.

They do not possess architectural decision authority.

---

## 3. AUTHORITATIVE PRODUCT FACTS ALREADY CLOSED

### 3.1 Patient Identity

Patient is the clinic's persistent patient identity.

This is already established.

### 3.2 Clinic Patient Number

On first registration, the system generates a Clinic Patient Number.

The Clinic Patient Number is the stable clinic reference for Patient
identity.

The Clinic Patient Number remains the stable clinic identity reference.

This is already established.

### 3.3 Retrieval Methods

The Patient must be retrievable through:

- Name
- Clinic Patient Number
- Barcode

These are alternative retrieval methods to reach the same existing
Patient identity.

Retrieval methods do not create separate Patient identities.

This is already established.

### 3.4 Patient / Visit Separation

The Clinic Patient Number is not a Visit identifier.

This is already established.

### 3.5 Patient Persistence

Patient identity persists beyond an individual Visit and Clinic Day.

This is already established by the Patient / Case / Visit model and the
persistence boundary.

---

## 4. AUTHORITATIVE TECHNICAL NON-DECISIONS

The authoritative artifacts do NOT currently define:

- whether CPN itself is the technical primary key;
- whether a separate technical Patient identifier exists;
- technical identifier type;
- CPN datatype;
- CPN format;
- CPN generation mechanism;
- CPN regeneration or reissue policy;
- explicit CPN immutability rule;
- explicit technical uniqueness constraint;
- Patient deletion / retention implementation;
- exact persistence representation of Barcode;
- exact persistence representation of Name retrieval.

These remain undefined unless deliberately closed by the Factory or
subsequent technical contract.

---

## 5. EXTERNAL EXCAVATION RECONCILIATION

### 5.1 OX ALPHA

OX identified two compatible technical models:

MODEL 1:
CPN as technical primary key.

MODEL 2:
Separate technical primary key with CPN retained as stable product-level
reference.

OX did not establish either model as an authoritative Factory decision.

OX also identified unresolved questions around CPN immutability,
datatype/format, generation, reissue, uniqueness, barcode, name
retrieval, and lifecycle.

These are excavation findings only.

### 5.2 DeepSeek

DeepSeek independently confirmed that both models can preserve the
currently supplied contract, provided their semantics are explicitly
defined.

DeepSeek also identified that the word "stable" does not, by itself,
explicitly establish an immutable technical key rule.

DeepSeek did not select or rank either model.

This analysis is accepted as independent verification evidence only.

---

## 6. FACTORY RECONCILIATION — CURRENT POSITION

### CLOSED PRODUCT KNOWLEDGE

The Factory currently knows and accepts:

- Patient is the persistent clinic identity.
- CPN is system-generated at first registration.
- CPN is the stable clinic reference.
- Name, CPN, and Barcode are retrieval methods.
- Retrieval methods converge on the same Patient.
- Retrieval methods are not separate identities.
- CPN is not a Visit identifier.

### STILL OPEN AT FACTORY LEVEL

The following question remains open:

WHAT IS THE RELATIONSHIP BETWEEN THE PRODUCT-LEVEL CPN AND THE
PERSISTENCE-LEVEL TECHNICAL PATIENT KEY?

Two technically coherent models have been identified:

A. CPN itself is the technical primary key.

B. A separate technical primary key exists, while CPN remains the stable
   product-level clinic reference.

No model is selected by this document.

---

## 7. FACTORY PRODUCT DECISION — CPN GENERATION AND LIFECYCLE

The Factory explicitly establishes the following product-level rule:

- The Clinic Patient Number is generated once for the Patient's first
  registration.
- The generated Clinic Patient Number is recorded once with that
  Patient identity.
- The Clinic Patient Number is not regenerated as a new Patient number
  for later Visits.
- A returning Patient remains the same Patient identity.
- Later Visits remain associated with the existing Patient identity and
  its existing Clinic Patient Number.
- Retrieval through Name, Clinic Patient Number, or Barcode must reach
  that same existing Patient identity.
- The Clinic Patient Number remains the stable clinic reference for that
  Patient throughout the Patient lifecycle unless a future explicit
  product contract deliberately changes this rule.
- The Clinic Patient Number is not a Visit identifier.

This is a Factory product/identity decision.

It does NOT by itself select whether the Clinic Patient Number is also
the persistence technical primary key.

## 7. IMPORTANT SEMANTIC QUESTION

The Factory must distinguish:

"stable clinic reference"

from

"immutable persistence key"

The current authoritative product wording establishes the first.

It does not explicitly establish the second.

Therefore this reconciliation does not silently convert "stable" into
"immutable".

If the Factory intends CPN to be immutable for the complete Patient
lifecycle, that must be deliberately established before relying on that
property as a technical persistence assumption.

---

## 7A. FACTORY PRODUCT DECISION — COMPLETE PATIENT DATA REMOVAL

The product shall provide the Doctor with a dedicated Patient Trash
action 🗑️ for removing the Patient's complete recorded data.

This capability concerns complete Patient data removal only.

It is NOT a Patient data-editing capability.

It does NOT authorize modification of individual Patient fields,
Clinical History entries, Visits, Cases, Clinic Days, CPN values, or
other individual records.

The Doctor deliberately initiates the complete Patient data removal
operation through the dedicated Trash capability.

The technical semantics of complete removal remain undefined and are
not inferred here.

This decision does not define:

- physical deletion versus another technical deletion mechanism
- retention or recovery behavior
- dependency handling
- referential deletion behavior
- CPN reuse or non-reuse
- database implementation
- transaction behavior
- authorization implementation
- API contract
- UI implementation details
- audit behavior

Those matters require deliberate technical definition and proof.

COMPLETE PATIENT DATA REMOVAL = PRODUCT DECISION CLOSED

## 7B. FACTORY TECHNICAL DECISION — PDR-B01

The Factory explicitly selects:

PATIENT
→ SEPARATE TECHNICAL PATIENT KEY
+
CPN = STABLE CLINIC REFERENCE

The technical Patient key is a persistence identity only.
It is not a second product Patient identity.

The CPN remains the stable clinic reference, generated once and
recorded once with the Patient identity.

Returning Visits retain the same Patient identity and CPN.

The CPN is not a Visit identifier.

Technical identifier type, datatype, format, schema, table, column,
migration, ORM, repository, API, UI, authentication, authorization,
and runtime implementation remain outside this decision.

PDR-B01 = FACTORY TECHNICAL DECISION CLOSED

## 8. FACTORY DECISION POINT

PDR-B01 cannot be considered CLOSED until the Factory deliberately
establishes the technical relationship between:

Patient identity
→ Clinic Patient Number
→ persistence technical key.

The Factory decision must determine whether:

- CPN itself is the persistence technical key;

OR

- persistence uses a separate technical key while CPN remains the
  stable clinic reference.

If the second model is selected, the internal technical key must not
become a second product identity.

---

## 9. WHAT MUST NOT HAPPEN

The following are prohibited at this gate:

- choosing a model because an excavator called it preferable;
- treating an external recommendation as architecture;
- writing SQL;
- defining database tables;
- defining columns;
- defining migrations;
- defining ORM models;
- implementing repositories;
- implementing APIs;
- implementing UI;
- implementing authentication;
- implementing authorization;
- changing closed contracts to fit a technical preference.

---

## 10. CURRENT GATE STATE

PDR-B01 = OPEN

FACTORY RECONCILIATION = BUILT AS DRAFT

TECHNICAL PATIENT KEY = NOT SELECTED

CPN IMMUTABILITY SEMANTICS = PRODUCT STABILITY CLOSED; TECHNICAL KEY IMPLICATION OPEN

DATABASE_SCHEMA = NOT_DEFINED

PERSISTENCE_IMPLEMENTATION_AUTHORIZED = NO

API_AUTHORIZED = NO

UI_AUTHORIZED = NO

AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO

---

## 11. NEXT FACTORY ACTION

The next action is an explicit Factory decision on the relationship
between CPN and the persistence technical Patient key.

Only after that decision is deliberately closed may the Persistence
Technical Contract encode the resulting technical rule.

END OF PDR-B01 FACTORY RECONCILIATION
