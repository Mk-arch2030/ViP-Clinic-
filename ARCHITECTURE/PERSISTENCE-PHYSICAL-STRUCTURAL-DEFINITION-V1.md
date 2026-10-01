# Dr.Roby Clinic — Persistence Physical Structural Definition V1

DOCUMENT = PERSISTENCE PHYSICAL STRUCTURAL DEFINITION
VERSION = V1
STATUS = CLOSED + PROVEN
IMPLEMENTATION_EXECUTION = NOT PERFORMED
SQL_EXECUTION = NOT PERFORMED
FAIL = 0

## 1. PURPOSE

This document defines the bounded physical structural representation required
by the closed Persistence Schema Definition and its governing contracts.

It defines structural persistence boundaries, relationships, cardinalities,
identity continuity, and required structural constraints without silently
resolving any technical decision explicitly marked DEFERRED.

This document does NOT execute or authorize:

- SQL
- migrations
- ORM implementation
- repository implementation
- service implementation
- API implementation
- UI implementation
- authentication implementation
- authorization implementation
- deployment implementation

This document is a physical structural definition, not a runtime
implementation specification.

---

## 2. AUTHORITATIVE INPUTS

This definition is subordinate to and MUST conform to:

- PERSISTENCE-SCHEMA-DEFINITION-V1.md
- PERSISTENCE-TECHNICAL-CONTRACT-V1.md
- PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-DECISION-V1.md
- PERSISTENCE-SCHEMA-IMPLEMENTATION-PLAN-V1.md
- PERSISTENCE-PHYSICAL-STRUCTURAL-DEFINITION-AND-AUTHORIZATION-REVIEW-V1.md
- PERSISTENCE-PHYSICAL-STRUCTURAL-DEFINITION-RECONCILIATION-DECISION-V1.md

The closed product contracts and domain decisions remain authoritative over
this document.

No structural definition in this document may change product meaning,
authority, cardinality, workflow semantics, or an established invariant.

---

## 3. DEFINITION PRINCIPLE

The physical structure MUST represent the established product concepts and
relationships while preserving all explicitly deferred decisions.

This document therefore distinguishes between:

1. Structural facts that are sufficiently defined now.
2. Structural boundaries that MUST exist but whose internal physical
   representation remains deferred.
3. Technical implementation decisions that remain outside this gate.

No deferred decision may be inferred from convenience, framework preference,
database preference, or implementation habit.

---

## 4. PHYSICAL STRUCTURAL BOUNDARY

The persistence structure MUST provide bounded representation for:

- Patient
- Case
- Visit
- Clinic Day
- Past History Item
- Actor
- Visit Clinical Content
- Follow-up Task as an operational extension of Follow-up
- Clinical Attachments

The following product relationship remains authoritative:

Patient
→ Case
→ Visit
→ Clinic Day

Clinical History is NOT an independent persistence source of truth.

Clinical History MUST remain derivable from preserved Visits.

Past History remains a Patient-level concept and MUST remain separate from
Clinical History.

---

## 5. PATIENT STRUCTURE

Patient represents the persistent clinic Patient identity.

The physical structure MUST provide representation for:

- technical persistence identity;
- stable Clinic Patient Number (CPN).

The technical persistence identity and CPN are distinct concepts.

CPN MUST:

- be established when Patient identity is first created;
- remain stable for that Patient;
- remain independent of Visit identity;
- be unique among active Patient identities.

A returning Patient MUST resolve to the existing Patient identity and CPN.

A Visit MUST NOT create a new Patient identity or CPN.

The structure MUST preserve Patient identity continuity across returning
Visits and Cases.

### Patient Basic / Personal Data

The physical structure MUST provide representation for:
- Phone Number — REQUIRED
- Gender — REQUIRED

Approved Gender values are exactly:
- Male
- Female

Phone Number and Gender are Patient information fields only. They MUST NOT become Patient identity mechanisms or retrieval methods.
CPN remains the stable Product-level Patient identity reference.
The technical persistence identity remains distinct from CPN.
Phone-number format, normalization, validation, uniqueness, multiple-phone behavior, and privacy handling remain DEFERRED.

### Deferred

The following remain deferred:

- technical identifier type;
- final SQL representation;
- final SQL data type;
- final physical identifier naming convention.

This document MUST NOT select UUID, numeric, or another technical identifier
strategy.

---

## 6. CASE STRUCTURE

Case represents one clinical journey belonging to exactly one Patient.

Structural relationship:

Patient 1 → many Cases

Each Case MUST have exactly one originating Patient.

The physical structure MUST preserve:

- current Case Workflow State;
- Case Completion Status;
- Completed By;
- Completed At.

Approved Case states are exactly:

1. Arrived — Awaiting Registration
2. Awaiting Doctor
3. With Doctor
4. Exited — Follow-up Pending
5. Completed

Case State is CURRENT STATE ONLY.

No Case State History is established.

No State Transition History is established.

Case Completion is represented directly on Case.

Case Completion MUST remain distinct from:

- Visit Exit;
- Clinic Day Closure.

Patient Exit ends the current Visit and MUST NOT automatically complete
the Case.

A Case MAY span multiple Clinic Days and multiple Visits.

---

## 7. VISIT STRUCTURE

Visit represents one organized clinical encounter.

Structural relationship:

Case 1 → many Visits

Each Visit MUST belong to:

- exactly one Case;
- exactly one Clinic Day.

The physical structure MUST preserve:

- Case relationship;
- Clinic Day relationship;
- Visit Type;
- current Visit Protection State;
- Visit Clinical Content boundary;
- Arrival Patient Condition.

### Visit Type

Visit Type is a direct Visit value.

Approved Visit Type:

`Visit & Consultation`

No separate Visit Type entity is established.

Visit Type has no financial meaning.

### Arrival Patient Condition

Arrival Patient Condition is a Visit-level concept.

Approved values are exactly:

- Normal
- Moderately Unwell
- Severely Unwell

The structure MUST preserve Arrival Patient Condition as distinct from:

- Vital Signs;
- Diagnosis;
- Treatment;
- Clinical Decision;
- Patient-level Past History.

This is the established A01 boundary.

---

## 8. VISIT PROTECTION STRUCTURE

Protection is represented at Visit level.

Allowed states are exactly:

- OPEN
- PROTECTED

No independent protection state is established for each Clinical Content
area.

The physical structure MUST preserve the current Visit Protection State.

Clinic Day closure establishes the applicable protection requirement for the
Visit according to the authorized technical and product rules.

Protected Visit amendments require Doctor Authorization.

Protection MUST NOT delete or replace previously recorded Visit data.

This structure MUST NOT introduce:

- generic Audit Log;
- Event Sourcing;
- generic State History.

The exact technical protection mechanism remains subject to its authorized
technical contract.

---

## 9. CLINIC DAY STRUCTURE

Clinic Day is identified at Product level by Working Date.

Structural relationship:

Working Date 1 → exactly 1 Clinic Day

The physical structure MUST preserve:

- Working Date;
- Clinic Day relationship to its Cases and Visits;
- Clinic Day closure state or representation where already authorized by
  the applicable technical contract.

Working Date MUST be unique across Clinic Day records.

Working Date is a calendar-date concept.

Clinic Day MUST NOT:

- complete an open Case;
- create Case Completion;
- erase daily Case data;
- erase daily Visit data.

Clinic Day does not receive an independent Product identity.

Any internal technical identifier required by eventual implementation remains
persistence-only and MUST NOT become a new Product identity.

---

## 10. PAST HISTORY ITEM STRUCTURE

Past History is a Patient-level concept.

Structural relationship:

Patient 1 → many Past History Items

Each Past History Item MUST belong to its Patient.

Past History MUST remain separate from Clinical History.

Past History is NOT a Visit.

Allowed Past History mutation semantics are:

- ADD
- MODIFY

Doctor holds authority for Past History changes.

The resulting current Past History remains preserved as Past History.

Separate preservation of Past History amendment occurrence is NOT required by
the current Persistence Contract.

This structure MUST NOT convert Past History into Visit Clinical History.

---

## 11. ACTOR STRUCTURE

The persistence boundary contains one technical Actor concept.

Structural representation MUST preserve:

- Actor Identity;
- Actor Role / Authority Context.

Approved Product Actor roles are:

- Doctor
- Nurse

Doctor creates Nurse Accounts.

Nurse does not self-register through public registration.

Creating a Nurse Account MUST NOT transfer:

- Clinical Authority;
- Main Admin authority;
- System Ownership.

Detailed Nurse delegated permissions remain outside this persistence
structural definition unless separately defined and authorized.

This document does NOT define:

- password representation;
- session representation;
- token representation;
- authentication implementation;
- authorization implementation.

---

## 12. VISIT CLINICAL CONTENT STRUCTURAL BOUNDARY

Visit Clinical Content is structurally owned by and associated with the
authoritative Visit.

The structure MUST preserve the following concepts and cardinalities:

- Current Complaint = exactly one value per Visit
- Investigation = zero or many entries per Visit
- Diagnosis = exactly one value per Visit
- Treatment = many entries per Visit
- Follow-up = exactly one value per Visit

Investigation and Diagnosis MUST remain separate concepts.

Diagnosis MUST preserve its approved distinction between preliminary and
final according to Doctor clinical decision.

No Clinical Content belonging to one Visit may overwrite Clinical Content
belonging to another Visit.

The structural boundary MUST preserve Visit ownership and Visit history.

### Deferred Physical Representation

This document deliberately does NOT select:

- one combined physical Clinical Content structure;
- separate physical structures for every Clinical Content area;
- JSON/document representation;
- text-column composition;
- ORM-specific representation.

The physical representation mechanism for Clinical Content remains DEFERRED
and requires its own deliberate decision and authorization before execution.

---

## 13. CLINICAL CONTENT AMENDMENT STRUCTURE

Clinical Content amendment requires Doctor Authorization.

The occurrence of an authorized amendment is a Product Fact and MUST
eventually be preserved.

The physical structure defined here MUST preserve the requirement that the
amendment occurrence can be represented once its dedicated technical
mechanism is deliberately selected.

This document does NOT select:

- Amendment structure;
- Amendment history structure;
- generic Audit Log;
- Event Sourcing;
- generic State History.

The current Clinical Content value remains the current value for the Visit.

A later Visit MUST NOT overwrite Clinical Content belonging to an earlier
Visit.

The amendment preservation mechanism remains DEFERRED.

---

## 14. CLINICAL HISTORY STRUCTURE

Clinical History is derived from preserved Visits.

Visits remain the authoritative clinical source.

No independently maintained Clinical History source of truth is established.

The persistence structure MUST preserve the information required to derive
Clinical History from Visits, including:

- Visit boundaries;
- Visit chronology;
- originating Patient;
- originating Case;
- originating Clinic Day;
- Visit Clinical Content.

No mutable latest-value Clinical History record is established.

---

## 15. FOLLOW-UP TASK STRUCTURAL BOUNDARY

Follow-up remains a Visit Clinical Content area.

The persistence structure MUST permit a Follow-up Task as an operational
extension of Follow-up.

This structural boundary does NOT establish:

- appointment management;
- scheduling;
- reminder infrastructure;
- calendar infrastructure.

The exact Follow-up Task lifecycle remains DEFERRED pending its dedicated
Application Contract.

No lifecycle behavior may be invented by this document.

---

## 16. CLINICAL ATTACHMENT STRUCTURAL BOUNDARY

Clinical Attachments are an established Product Capability.

The persistence structure MUST permit clinical supporting materials to be
associated with the appropriate clinical context.

Examples include:

- X-ray / radiology images;
- laboratory result images;
- clinical reports/documents;
- other clinical materials selected by the Doctor.

This document defines the structural capability boundary only.

The following remain DEFERRED:

- physical storage mechanism;
- storage provider;
- binary representation;
- file metadata matrix;
- file size limits;
- attachment API;
- attachment UI;
- attachment authorization implementation.

No LIMS, RIS, or PACS behavior is introduced.

---

## 17. STRUCTURAL RELATIONSHIP MAP

The authoritative structural relationship map is:

Patient
→ one-to-many Cases
→ each Case belongs to exactly one Patient

Case
→ one-to-many Visits
→ each Visit belongs to exactly one Case

Clinic Day
→ one-to-many Visits
→ each Visit belongs to exactly one Clinic Day

Patient
→ one-to-many Past History Items
→ each Past History Item belongs to exactly one Patient

Visit
→ owns / contains the authoritative Visit Clinical Content boundary

Actor
→ represents the technical Doctor/Nurse actor concept

Follow-up Task
→ operational extension of Visit Follow-up

Clinical Attachments
→ associated with the appropriate established clinical context

Clinical History
→ derived from preserved Visits
→ NOT an independent source of truth

---

## 18. REQUIRED STRUCTURAL INTEGRITY

The physical structure MUST preserve or otherwise guarantee:

1. Patient identity uniqueness.
2. CPN uniqueness among active Patient identities.
3. Every Case references exactly one Patient.
4. Every Visit references exactly one Case.
5. Every Visit references exactly one Clinic Day.
6. One Clinic Day exists for each Working Date.
7. Visit Type remains valid and preserved.
8. Visit Protection State remains valid and preserved.
9. Case Current State remains valid and preserved.
10. Case Completion representation remains coherent.
11. Clinical Content cardinalities remain valid.
12. Clinical Content concepts remain separated.
13. Previous Visits remain preserved.
14. Clinical History remains derivable from Visits.
15. Past History remains separate from Clinical History.
16. Authorized Clinical Content amendment occurrence remains representable
    once its dedicated preservation mechanism is defined.
17. No Clinical Content from one Visit may overwrite another Visit's content.
18. Case Completion remains Doctor-authorized.
19. Clinic Day Closure remains explicit and Doctor-authorized.
20. Patient Exit remains distinct from Case Completion.

---

## 19. EXPLICIT NON-DECISIONS

This document intentionally does NOT decide:

- technical identifier type;
- final SQL schema syntax;
- final SQL data types;
- migration syntax;
- ORM representation;
- repository representation;
- service implementation;
- API representation;
- UI representation;
- authentication implementation;
- authorization implementation;
- deployment implementation;
- Clinical Content physical representation;
- Clinical Content amendment preservation mechanism;
- Clinical Attachment storage mechanism;
- Follow-up Task lifecycle;
- Delete mechanism;
- Trash mechanism;
- Retention mechanism;
- Soft Delete;
- Hard Delete;
- Purge;
- Physical Destruction;
- Patient Merge;
- generic Audit Log;
- Event Sourcing;
- generic State History;
- database triggers;
- concurrency mechanism;
- idempotency mechanism;
- caching;
- runtime behavior.

Any deferred item requiring a technical decision MUST return to its own
definition and authorization gate.

---

## 20. SAFETY INVARIANTS

The following remain mandatory:

NEW_PRODUCT_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
CONTRACT_MUTATION = NO
RANDOM_REFACTORING = NO
UNAUTHORIZED_EXPANSION = NO

This definition MUST NOT:

- reinterpret a closed product decision;
- weaken an established invariant;
- introduce a new actor;
- introduce a new product capability;
- transfer authority;
- silently resolve a deferred decision;
- authorize an implementation layer not explicitly authorized.

---

## 21. IMPLEMENTATION BOUNDARY

The existing bounded database-schema authorization remains subordinate to
this structural definition and MUST NOT be interpreted as authorization for
any unauthorized technical layer.

The following remain explicitly unauthorized:

SQL_IMPLEMENTATION_AUTHORIZED = NO
MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
ORM_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_AUTHORIZED = NO
UI_IMPLEMENTATION_AUTHORIZED = NO
AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO
DEPLOYMENT_IMPLEMENTATION_AUTHORIZED = NO

No physical database execution is performed by this document.

No Backend implementation is authorized by this document.

No Frontend implementation is authorized by this document.

---

## 22. RECONCILIATION REQUIREMENTS

Before this definition can be closed, it MUST be reconciled against:

- Persistence Schema Definition;
- Persistence Technical Contract;
- bounded Persistence Implementation Authorization;
- bounded Structural Implementation Plan;
- Physical Structural Definition Review;
- established domain and authority invariants.

The reconciliation MUST verify:

1. Complete structural coverage.
2. Relationship preservation.
3. Cardinality preservation.
4. Identity continuity.
5. A01 preservation.
6. Case / Visit distinction.
7. Visit / Clinic Day relationship.
8. Past History / Clinical History separation.
9. Doctor/Nurse authority preservation.
10. No deferred decision was silently resolved.
11. No unauthorized implementation layer was introduced.
12. No new Product capability or Actor was introduced.

---

## 23. PROOF REQUIREMENTS

Before this definition is treated as CLOSED + PROVEN:

- the document MUST pass controlled reconciliation;
- all identified structural boundaries MUST be accounted for;
- all deferred decisions MUST remain explicitly deferred;
- no implementation execution may have occurred;
- SQL execution MUST remain NOT PERFORMED;
- unauthorized layers MUST remain NOT PERFORMED;
- FAIL MUST equal 0.

Implementation proof, when eventually authorized and executed, MUST be
recorded separately from this definition.

---

## 24. CURRENT STATUS

PHYSICAL_STRUCTURAL_DEFINITION = CLOSED + PROVEN
RECONCILIATION = PASS
IMPLEMENTATION_EXECUTION = NOT PERFORMED
SQL_EXECUTION = NOT PERFORMED
BACKEND_EXECUTION = NOT PERFORMED
FRONTEND_EXECUTION = NOT PERFORMED
FAIL = 0

This document is now the candidate Physical Structural Definition for the
next controlled reconciliation gate.
