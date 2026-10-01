# DR. ROBY CLINIC — PERSISTENCE TECHNICAL CONTRACT V1

DOCUMENT = PERSISTENCE TECHNICAL CONTRACT
VERSION = V1
PHASE = TECHNICAL CONTRACT DEFINITION
STATUS = DEFINITION DRAFT

AUTHORITY =
PRODUCT MANUSCRIPT
+ CLOSED CONTRACTS C01-C08
+ PROVEN DOMAIN / PERSISTENCE BOUNDARY
+ PERSISTENCE DECISION REGISTER V1

---

## 1. PURPOSE

This document defines the technical persistence contract required before
database schema implementation.

It translates already-closed Product and Factory persistence decisions into
technical persistence rules without introducing new Product capabilities.

This document does NOT implement SQL, tables, migrations, ORM models,
repositories, API routes, UI behavior, authentication, authorization
implementation, deployment, or runtime behavior.

---

## 2. TECHNICAL IDENTITY RULES

### 2.1 Technical Persistence Identifier

TECHNICAL IDENTIFIER STATUS:

- A separate technical Patient key is required.
- The technical identifier type and representation remain DEFERRED.
- UUID vs numeric technical identifiers is not selected by this contract.
- No technical identifier mechanism is invented by this contract.
### 2.2 Patient Identity

- Patient has one technical persistence identifier.
- Patient also has one stable Clinic Patient Number (CPN).
- Technical Patient key and CPN are different concepts.
- CPN remains the stable Product-level clinic reference.
- CPN is created once when Patient identity is first established.
- Returning to the clinic retrieves the same Patient identity and CPN.
- A Visit never creates a new Patient or CPN.
- CPN is never a Visit identifier.
- CPN must be unique among active Patient identities.

---

## 3. CORE PERSISTENCE RELATIONSHIPS

The authoritative relationship chain is:

Patient
  -> Case
      -> Visit
          -> Clinic Day

Required persistence invariants:

1. One Patient may have many Cases.
2. Every Case belongs to exactly one Patient.
3. One Case may contain many Visits.
4. Every Visit belongs to exactly one Case.
5. Every Visit occurs within exactly one Clinic Day.
6. One Case may continue across multiple Clinic Days through its Visits.
7. Later follow-up Visit remains associated with the continuing Case when
   the Case remains open.
8. Previous Visits remain preserved.
9. Clinical History is derived from Visits.
10. Past History remains distinct from Clinical History.
11. Patient identity remains stable across returning Visits.

---

## 4. CLINIC DAY PERSISTENCE

FACTORY TECHNICAL DECISION:

- Working Date is the technical identity of Clinic Day at Product level.
- There is exactly one Clinic Day for each Working Date.
- Working Date is unique across Clinic Day records.
- A Clinic Day contains Cases and Visits occurring on that Working Date.
- Clinic Day closure does not complete an open Case.
- Clinic Day closure does not create Case Completion.
- Daily Case/Visit data remains preserved after closure.

Technical representation:

- Working Date is persisted as a calendar-date value.
- Clinic Day does not receive an independent Product identity.
- Any internal technical identifier remains persistence-only if required by
  implementation.

---

## 5. VISIT PERSISTENCE

Every Visit must persist:

- relationship to exactly one Case;
- relationship to exactly one Clinic Day;
- approved Visit Type;
- current Visit protection state;
- Visit clinical content according to this contract.

Approved Visit Type:

`Visit & Consultation`

Visit Type is a direct value on Visit.

No separate Visit Type entity/reference is established.

Visit Type is not a billing, payment, charge, invoice, accounting, or
financial entity.

---

## 6. VISIT CLINICAL CONTENT REPRESENTATION

PERSISTENCE CONTRACT REQUIREMENT:

The persistence representation of Clinical Content remains technically
undefined.

The persistence contract preserves the Product distinction between:

- Current Complaint
- Investigation
- Diagnosis
- Treatment
- Follow-up

Investigation and Diagnosis remain separate concepts.

Cardinality:

- Current Complaint = exactly one value per Visit.
- Investigation = zero or many entries per Visit.
- Diagnosis = exactly one value per Visit.
- Treatment = many entries per Visit.
- Follow-up = exactly one value per Visit.

Diagnosis may be preliminary or final according to the Doctor's clinical
decision.

The eventual persistence representation must preserve the above
cardinalities and content-area separation.
## 7. CLINICAL CONTENT AMENDMENT

PERSISTENCE CONTRACT REQUIREMENT:

- Clinical Content already recorded within a Visit may be amended only
  with Doctor Authorization.
- Amendment occurrence is a Product Fact and MUST be preserved.
- Amendment preservation is scoped to Clinical Content amendment
  occurrence.
- The technical mechanism for preserving amendment occurrence remains
  undefined in V1.
- No dedicated amendment record/table/mechanism is selected by this
  contract.
- The eventual mechanism must preserve the required Product Fact without
  becoming an unauthorized generic Audit Log or Event Sourcing system.

The current Visit Clinical Content remains the current clinical value.

No amendment between different Visits is permitted to overwrite the
earlier Visit's Clinical Content.

Within the same Visit, replacement/amendment of Clinical Content is
permitted subject to Doctor Authorization.
## 8. VISIT NO-OVERWRITE RULE

The persistence layer MUST preserve:

- Previous Visit Clinical Content.
- Later Visit Clinical Content.
- The relationship of each content record to its originating Visit.

A later Visit MUST NOT overwrite Clinical Content belonging to an earlier
Visit.

Clinical History is therefore derived from preserved Visits rather than from
a mutable single latest-value record.

---

## 9. CLINICAL HISTORY

FACTORY TECHNICAL DECISION:

- Clinical History is derived from recorded Visits at read time.
- Visits are the authoritative clinical source.
- No separately maintained Clinical History source of truth is created.
- The derived Clinical History must preserve Visit boundaries and chronology.
- Clinical History must not overwrite or replace individual Visits.

---

## 10. PAST HISTORY

FACTORY TECHNICAL DECISION:

- Past History is Patient-level.
- Past History is distinct from Clinical History.
- Past History is not a Visit.
- Past History consists of multiple Patient-level history items.
- A Past History item may be added or modified.
- Past History mutation is limited to ADD and MODIFY.
- Doctor holds authority for Past History changes.
- The resulting current Past History remains preserved as Past History.
- The amendment occurrence itself is not required to be preserved as a
  separate Product Fact by this contract.

---

## 11. CASE WORKFLOW STATE

FACTORY TECHNICAL DECISION:

- Case stores CURRENT STATE ONLY.
- No Case State History / State Transition History is established.

The five approved Case states remain:

1. Arrived — Awaiting Registration
2. Awaiting Doctor
3. With Doctor
4. Exited — Follow-up Pending
5. Completed

Case State is operational workflow position.

Case State is distinct from Clinical History.

---

## 12. CASE COMPLETION

Case Completion is represented directly on Case.

Required Product facts:

- Completion Status.
- Completed By = Doctor.
- Completed At = Working Date / Date-Time.

No dedicated Completion Record / Fact is established.

Case Completion remains distinct from:

- Visit Exit.
- Clinic Day Closure.

---

## 13. VISIT PROTECTION

FACTORY TECHNICAL DECISION:

Protection is represented at Visit level.

Allowed Visit Protection States:

- OPEN
- PROTECTED

Clinic Day closure establishes the applicable protection requirement for the
Visit.

A protected Visit requires Doctor Authorization for amendments subject to the
protection rules.

Protection does not delete or replace recorded Visit data.

No separate protection state is created independently for each Clinical
Content area.

No Audit Log, Event Sourcing, or State History is established by this
mechanism.

---

## 14. ACTOR PERSISTENCE

FACTORY TECHNICAL DECISION:

The persistence boundary contains one technical Actor concept with:

- Actor Identity
- Actor Role / Authority Context

Approved Product Actor roles:

- Doctor
- Nurse

Operational relationship:

Doctor creates Nurse Account.

The system supports:

- Doctor only
- Doctor + Nurse

Nurse does not self-register through public registration.

Creating a Nurse Account does not transfer:

- Clinical Authority;
- Main Admin authority;
- System Ownership.

Detailed Nurse delegated permissions remain outside this contract and require
the later authorized Authorization/Application Contract.

---

## 15. FOLLOW-UP

Follow-up remains a Visit Clinical Content area.

A Follow-up may establish a Follow-up Task.

Persistence must therefore permit the Follow-up Task to be represented as an
operational extension of Follow-up.

This contract does NOT establish:

- Appointment management;
- Scheduling;
- Reminder infrastructure;
- Calendar infrastructure.

Exact Follow-up Task lifecycle is outside the current Persistence Contract
until its dedicated Application Contract is authorized.

---

## 16. CLINICAL ATTACHMENTS

Clinical Attachments are an established Product Capability.

Examples include:

- X-ray / radiology images;
- laboratory result images;
- clinical reports/documents;
- other clinical materials selected by the Doctor.

Clinical Attachments remain supporting clinical materials.

This V1 Persistence Contract does NOT define:

- physical file storage architecture;
- object-storage provider;
- attachment binary storage mechanism;
- final supported file-format matrix;
- file-size limits;
- attachment API;
- attachment UI;
- attachment authorization implementation.

Therefore Clinical Attachment persistence architecture remains explicitly
DEFERRED and must not be invented during core schema implementation.

---

## 17. TRASH / DELETE / RETENTION

FACTORY TECHNICAL DECISION:

No arbitrary deletion behavior is authorized.

Existing Product boundaries remain:

- Patient Trash
- Visit Trash

The exact technical mechanism remains DEFERRED until a dedicated
Delete/Retention Technical Contract is closed.

The following are NOT selected by this V1 contract:

- Soft Delete;
- Hard Delete;
- Trash Storage mechanism;
- Purge mechanism;
- Physical Destruction mechanism;
- retention execution mechanism.

No implementation may invent one of these mechanisms.

---

## 18. PROTECTION RETENTION

Visit Trash Product rules remain authoritative:

- Visit Trash is distinct from Patient Trash.
- Doctor may configure Visit Trash retention through Product Settings.
- Minimum retention = 14 Clinic Days.
- Maximum retention = 30 Clinic Days.
- Automatic movement to Trash is an intended Product capability.

Exact trigger, counting, storage, purge, and destruction mechanics remain
DEFERRED.

---

## 19. TRANSACTIONAL INTEGRITY

Persistence operations that establish or mutate relationships must preserve
the domain invariants atomically.

At minimum:

- Patient identity creation and CPN establishment must not partially succeed.
- Case creation must not exist without its Patient relationship.
- Visit creation must not exist without its Case and Clinic Day relationships.
- Clinic Day uniqueness must not permit two persistent Clinic Days for one
  Working Date.
- Case Completion must not partially persist.
- Authorized Clinical Content amendment and the required preservation of its
  amendment occurrence must be atomic once the amendment mechanism is separately defined.

Exact transaction implementation remains an implementation concern.

---

## 20. TECHNICAL INVARIANTS REQUIRED BEFORE SCHEMA IMPLEMENTATION

The eventual schema MUST enforce or reliably preserve:

1. Patient technical identity uniqueness.
2. CPN uniqueness and stability.
3. Patient -> Case relationship.
4. Case -> Visit relationship.
5. Visit -> Clinic Day relationship.
6. One Clinic Day per Working Date.
7. Visit Type preservation.
8. Visit Protection State preservation.
9. Case Current State preservation.
10. Case Completion representation.
11. Clinical Content cardinality.
12. Clinical Content separation.
13. Previous Visit preservation.
14. Clinical History derivation from Visits.
15. Past History separation from Clinical History.
16. Doctor-authorized Clinical Content amendment occurrence preservation.
17. No cross-Visit Clinical Content overwrite.

---

## 21. EXPLICITLY DEFERRED FROM V1

The following remain outside this Persistence Technical Contract:

- SQL schema syntax;
- migrations;
- ORM;
- repository implementation;
- API;
- UI;
- authentication implementation;
- authorization implementation;
- generic Audit Log;
- Event Sourcing;
- generic State History;
- database triggers;
- attachment storage architecture;
- attachment API/UI;
- detailed Follow-up Task lifecycle;
- Delete/Retention technical mechanism;
- Soft Delete;
- Hard Delete;
- Purge;
- Physical Destruction;
- Patient Merge;
- multi-branch identity;
- multi-tenant identity;
- external identity providers;
- billing/payment persistence;
- appointment/scheduling persistence;
- pharmacy persistence;
- laboratory persistence;
- insurance persistence;
- reporting warehouse/analytics.

---

## 22. IMPLEMENTATION AUTHORIZATION STATUS

PERSISTENCE_TECHNICAL_CONTRACT_DEFINED = YES

DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = NO
SQL_IMPLEMENTATION_AUTHORIZED = NO
MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
ORM_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_AUTHORIZED = NO
UI_IMPLEMENTATION_AUTHORIZED = NO
AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO

Next gate:

PERSISTENCE TECHNICAL CONTRACT PROOF

The contract must be proven against:
- Product Manuscript;
- Closed Contracts C01-C08;
- Proven Domain / Persistence Boundary;
- Persistence Decision Register V1.

Only after successful proof may DATABASE SCHEMA DEFINITION be considered as
the next technical gate.

---

STATUS = DEFINITION DRAFT

## CONTROLLED AMENDMENT — A01-A04

AMENDMENT_STATUS = CONTROLLED AMENDMENT
IMPLEMENTATION_AUTHORIZED = NO

A01 — ARRIVAL PATIENT CONDITION
Each Visit may persist one arrival patient condition:
Normal / Moderately Unwell / Severely Unwell.
This is Visit-level operational intake information and is distinct from
Vital Signs, Diagnosis, Treatment, Clinical Decision, and Past History.

A02 — NURSE CURRENT COMPLAINT INTAKE
Current Complaint remains exactly one per Visit. Nurse collection does not
create a new structural domain object or replace the Visit-level model.

A03 — NURSE INITIAL PAST HISTORY COLLECTION
Past History remains Patient-level and authoritative Doctor-controlled.
Nurse collection does not create a new structural domain object.

A04 — SEND TO DOCTOR
Send to Doctor creates no new persistence object, Case state, Visit state,
or completion/closure state.

CROSS_CONTRACT_INVARIANTS_PRESERVED = YES
CONTRACT_MUTATION = PERFORMED
IMPLEMENTATION = NOT AUTHORIZED
