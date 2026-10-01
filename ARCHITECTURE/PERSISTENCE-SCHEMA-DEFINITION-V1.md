# DR. ROBY CLINIC — PERSISTENCE SCHEMA TECHNICAL DEFINITION V1

DOCUMENT = PERSISTENCE SCHEMA TECHNICAL DEFINITION
VERSION = V1
PHASE = TECHNICAL CONTRACT DEFINITION
STATUS = CLOSED + PROVEN

AUTHORITY =
PERSISTENCE TECHNICAL CONTRACT V1
+ CLOSED APPLICATION CAPABILITY CONTRACT V1
+ CLOSED AUTHORIZATION TECHNICAL CONTRACT V1

---

## 1. PURPOSE

This document defines the technical database-schema boundary required to
represent the already-closed Persistence Technical Contract V1.

It does not introduce new Product capabilities.

It does not implement SQL, migrations, ORM models, repositories, services,
API routes, UI behavior, authentication, authorization implementation,
deployment, or runtime behavior.

This document defines WHAT the persistence schema must represent.

It does not yet define the final SQL syntax or implementation mechanism.

---

## 2. SCHEMA AUTHORITY

The schema MUST conform to the closed Persistence Technical Contract V1.

The schema MUST NOT reinterpret, weaken, or expand Product decisions.

The schema MUST preserve the following authoritative chain:

Patient
  -> Case
      -> Visit
          -> Clinic Day

The schema MUST preserve Patient identity across returning Visits.

The schema MUST preserve previous Visits and their originating relationships.

The schema MUST preserve the distinction between:

- Past History
- Clinical History
- Case Workflow State
- Visit Protection State
- Case Completion

---

## 3. REQUIRED PERSISTENCE CONCEPTS

The schema boundary MUST provide persistence representation for the following
established concepts:

1. Patient
2. Case
3. Visit
4. Clinic Day
5. Past History Item
6. Actor

The schema MUST also provide representation for the established Visit
Clinical Content areas:

- Current Complaint
- Investigation
- Diagnosis
- Treatment
- Follow-up

The schema boundary MUST permit representation of:

- Clinical Attachments
- Follow-up Task as an operational extension of Follow-up

The exact physical representation of these concepts remains subject to the
rules and deferred decisions defined later in this document.

---

## 4. PATIENT

Patient represents the persistent clinic Patient identity.

Patient MUST have:

- one technical persistence identifier;
- one stable Clinic Patient Number (CPN).

The technical Patient identifier and CPN are distinct concepts.

The technical identifier representation is DEFERRED.

UUID vs numeric technical identifiers is NOT selected.

CPN MUST:

- be established when Patient identity is first created;
- remain stable for that Patient;
- remain independent of Visit identity;
- be unique among active Patient identities.

A returning Patient MUST resolve to the existing Patient identity and existing
CPN.

A Visit MUST NOT create a new Patient or CPN.

---

## 5. CASE

Case represents a clinical journey belonging to one Patient.

Required relationship:

- one Case belongs to exactly one Patient;
- one Patient may have many Cases.

Case MUST preserve its current workflow state.

Case State is CURRENT STATE ONLY.

Approved Case states are exactly:

1. Arrived — Awaiting Registration
2. Awaiting Doctor
3. With Doctor
4. Exited — Follow-up Pending
5. Completed

No Case State History is established.

No State Transition History is established.

Case Completion is represented directly on Case.

Required completion facts:

- Completion Status
- Completed By = Doctor
- Completed At = Working Date / Date-Time

No dedicated Completion Record is established.

Case Completion is distinct from:

- Visit Exit
- Clinic Day Closure

---

## 6. VISIT

Visit represents one organized clinical encounter.

Every Visit MUST belong to:

- exactly one Case;
- exactly one Clinic Day.

One Case may contain many Visits.

A Case may continue across multiple Clinic Days through its Visits.

A later follow-up Visit MUST remain associated with the continuing Case when
the Case remains open.

Previous Visits MUST remain preserved.

Visit MUST persist:

- Case relationship;
- Clinic Day relationship;
- Visit Type;
- current Visit Protection State;
- Visit Clinical Content;
- Arrival Patient Condition.

Arrival Patient Condition:
- Visit-level arrival/intake information.
- Each Visit may persist one Arrival Patient Condition.
- Approved values:
  - Normal
  - Moderately Unwell
  - Severely Unwell
- This is distinct from Vital Signs, Diagnosis, Treatment,
  Clinical Decision, and Patient-level Past History.
- Physical persistence representation remains DEFERRED.

Approved Visit Type:

`Visit & Consultation`

Visit Type is a direct Visit value.

No separate Visit Type entity is established.

Visit Type has no financial meaning.

---

## 7. CLINIC DAY

Clinic Day is identified at Product level by Working Date.

There MUST be exactly one Clinic Day for each Working Date.

Working Date MUST be unique across Clinic Day records.

Working Date is persisted as a calendar-date value.

Clinic Day contains Cases and Visits occurring on that Working Date.

Clinic Day closure MUST NOT:

- complete an open Case;
- create Case Completion;
- erase daily Case data;
- erase daily Visit data.

Clinic Day does not receive an independent Product identity.

Any internal technical identifier remains persistence-only if required by the
eventual implementation.

---

## 8. VISIT PROTECTION

Protection is represented at Visit level.

Allowed states are exactly:

- OPEN
- PROTECTED

No separate protection state exists independently for each Clinical Content
area.

Clinic Day closure establishes the applicable protection requirement for the
Visit.

Protected Visit amendments require Doctor Authorization according to the
authorized rules.

Protection does not delete or replace recorded Visit data.

This schema definition does not introduce:

- Audit Log
- Event Sourcing
- generic State History

---

## 9. VISIT CLINICAL CONTENT

The schema MUST preserve the following Product concepts and cardinalities:

- Current Complaint = exactly one value per Visit
- Investigation = zero or many entries per Visit
- Diagnosis = exactly one value per Visit
- Treatment = many entries per Visit
- Follow-up = exactly one value per Visit

Investigation and Diagnosis MUST remain separate concepts.

Diagnosis MUST support its approved clinical distinction between preliminary
and final according to the Doctor's clinical decision.

The physical persistence representation of Clinical Content remains DEFERRED.

This document therefore does not select:

- one combined Clinical Content table;
- separate tables for every content area;
- JSON/document storage;
- text-column composition;
- any ORM-specific representation.

No such mechanism may be invented until deliberately selected.

---

## 10. CLINICAL CONTENT AMENDMENT

Clinical Content amendment requires Doctor Authorization.

The occurrence of an amendment is a Product Fact and MUST eventually be
preserved.

The technical mechanism for preserving that occurrence remains DEFERRED.

This definition does NOT select:

- Amendment table;
- Amendment history table;
- generic Audit Log;
- Event Sourcing;
- State History.

The current Clinical Content value remains the current value for the Visit.

A later Visit MUST NOT overwrite Clinical Content belonging to an earlier
Visit.

---

## 11. CLINICAL HISTORY

Clinical History is derived from preserved Visits.

Visits remain the authoritative clinical source.

No separately maintained Clinical History source of truth is established.

The persistence schema MUST preserve:

- Visit boundaries;
- Visit chronology;
- originating Patient;
- originating Case;
- originating Clinic Day;
- Visit Clinical Content.

Clinical History MUST therefore be derivable from Visits.

No mutable latest-value Clinical History record is established.

---

## 12. PAST HISTORY

Past History is Patient-level.

Past History is distinct from Clinical History.

Past History is not a Visit.

A Patient may have multiple Past History Items.

Past History mutation is limited to:

- ADD
- MODIFY

Doctor holds authority for Past History changes.

The resulting current Past History remains preserved as Past History.

Separate preservation of Past History amendment occurrence is NOT required by
the current Persistence Contract.

---

## 13. ACTOR

The persistence boundary contains one technical Actor concept.

Actor MUST preserve:

- Actor Identity
- Actor Role / Authority Context

Approved Product Actor roles are:

- Doctor
- Nurse

Doctor creates Nurse Account.

Nurse does not self-register through public registration.

Creating a Nurse Account MUST NOT transfer:

- Clinical Authority
- Main Admin authority
- System Ownership

Detailed Nurse delegated permissions remain outside this schema definition.

No authentication implementation is defined here.

No password/session/token representation is selected here.

---

## 14. FOLLOW-UP TASK

Follow-up remains a Visit Clinical Content area.

The persistence boundary MUST permit a Follow-up Task as an operational
extension of Follow-up.

This does NOT establish:

- appointment management;
- scheduling;
- reminder infrastructure;
- calendar infrastructure.

The exact Follow-up Task lifecycle remains DEFERRED pending its dedicated
Application Contract.

---

## 15. CLINICAL ATTACHMENTS

Clinical Attachments are an established Product Capability.

The schema boundary MUST permit clinical supporting materials associated with
the appropriate clinical context.

Examples include:

- X-ray / radiology images
- laboratory result images
- clinical reports/documents
- other clinical materials selected by the Doctor

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

## 16. REQUIRED RELATIONSHIP INTEGRITY

The eventual schema MUST enforce or otherwise guarantee:

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
16. Authorized Clinical Content amendment occurrence is preserved once its
    mechanism is deliberately defined.
17. No Clinical Content from one Visit may overwrite another Visit's content.

---

## 17. EXPLICITLY DEFERRED

The following MUST NOT be invented by this schema definition:

- technical identifier type;
- UUID vs numeric keys;
- final SQL schema syntax;
- migration mechanism;
- ORM;
- repository implementation;
- service implementation;
- API routes;
- request/response schemas;
- authentication implementation;
- authorization implementation;
- session/token mechanism;
- Clinical Content physical representation;
- amendment preservation mechanism;
- attachment storage mechanism;
- attachment API/UI;
- Follow-up Task lifecycle;
- Delete/Trash/Retention mechanism;
- Soft Delete;
- Hard Delete;
- Purge;
- Physical Destruction;
- Patient Merge;
- Audit Log;
- Event Sourcing;
- generic State History;
- database triggers;
- concurrency mechanism;
- idempotency mechanism;
- caching;
- deployment/runtime behavior.

---

## 18. IMPLEMENTATION STATUS

PERSISTENCE_SCHEMA_DEFINITION = CLOSED + PROVEN

DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = NO
SQL_IMPLEMENTATION_AUTHORIZED = NO
MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
ORM_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO

This document defines the schema boundary only.

No database implementation is authorized by this document alone.

---

## 19. NEXT GATE

Before database implementation, this definition MUST be:

1. Forensically reviewed against Persistence Technical Contract V1.
2. Checked for invented capabilities or technical decisions.
3. Checked for missing required persistence concepts/invariants.
4. Reconciled with the closed Application Capability and Authorization
   Technical Contracts.
5. Deliberately closed and proven.
6. Only then may a separate implementation authorization be considered.
