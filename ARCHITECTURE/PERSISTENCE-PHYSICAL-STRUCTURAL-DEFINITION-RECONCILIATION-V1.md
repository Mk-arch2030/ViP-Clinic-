# Dr.Roby Clinic — Persistence Physical Structural Definition Reconciliation V1

DOCUMENT = PERSISTENCE PHYSICAL STRUCTURAL DEFINITION RECONCILIATION
VERSION = V1
STATUS = CLOSED + PROVEN

SOURCE_DEFINITION = ARCHITECTURE/PERSISTENCE-PHYSICAL-STRUCTURAL-DEFINITION-V1.md

IMPLEMENTATION_EXECUTION = NOT PERFORMED
SQL_EXECUTION = NOT PERFORMED
BACKEND_EXECUTION = NOT PERFORMED
FRONTEND_EXECUTION = NOT PERFORMED
FAIL = 0

---

## 1. PURPOSE

This document records the controlled reconciliation of the candidate
Persistence Physical Structural Definition against its governing
authoritative persistence artifacts.

The purpose is to verify that the candidate physical structural definition:

- preserves the closed product/domain meaning;
- preserves the closed persistence schema boundary;
- preserves the proven persistence technical contract;
- remains inside the bounded database implementation authorization;
- preserves the bounded implementation plan;
- preserves all explicit deferred decisions;
- introduces no unauthorized implementation layer;
- introduces no new product capability;
- introduces no new actor;
- transfers no authority;
- mutates no closed contract;
- performs no SQL, backend, frontend, authentication, authorization,
  migration, ORM, repository, service, API, or deployment execution.

This reconciliation is a definition-control activity only.

---

## 2. AUTHORITATIVE INPUTS

The reconciliation SHALL be performed against the following artifacts:

1. ARCHITECTURE/PERSISTENCE-SCHEMA-DEFINITION-V1.md
2. ARCHITECTURE/PERSISTENCE-TECHNICAL-CONTRACT-V1.md
3. ARCHITECTURE/PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-DECISION-V1.md
4. ARCHITECTURE/PERSISTENCE-SCHEMA-IMPLEMENTATION-PLAN-V1.md
5. ARCHITECTURE/PERSISTENCE-PHYSICAL-STRUCTURAL-DEFINITION-AND-AUTHORIZATION-REVIEW-V1.md
6. ARCHITECTURE/PERSISTENCE-PHYSICAL-STRUCTURAL-DEFINITION-RECONCILIATION-DECISION-V1.md
7. ARCHITECTURE/PERSISTENCE-PHYSICAL-STRUCTURAL-DEFINITION-V1.md

Where a later artifact records a closed reconciliation decision, that
decision SHALL be respected without reopening the underlying closed
business meaning unless new contradictory evidence exists.

---

## 3. RECONCILIATION PRINCIPLE

The candidate Physical Structural Definition SHALL be accepted only to the
extent that it faithfully represents already-established persistence
meaning.

Physical structure SHALL NOT be used to silently resolve a technical
decision explicitly marked DEFERRED by an authoritative source.

No physical representation may create a new business capability merely
because the representation is technically convenient.

---

## 4. CORE STRUCTURAL COVERAGE

The candidate definition MUST account for the following established
persistence concepts:

- Patient
- Case
- Visit
- Clinic Day
- Past History Item
- Actor
- Current Complaint
- Investigation
- Diagnosis
- Treatment
- Follow-up
- Follow-up Task as an operational extension of Follow-up
- Clinical Attachments as an established capability boundary

RECONCILIATION REQUIREMENT:

Every listed concept MUST be structurally accounted for without creating
an unauthorized independent business domain.

---

## 5. IDENTITY RECONCILIATION

The candidate definition MUST preserve:

- technical Patient persistence identity;
- stable CPN;
- CPN continuity across returning visits;
- Patient identity independent of Visit;
- uniqueness of CPN among active identities;
- the rule that a Visit MUST NOT create a new Patient identity.

The candidate definition MUST NOT select:

- UUID;
- numeric ID;
- another identifier representation;

unless separately authorized by the applicable technical decision gate.

RESULT:

IDENTITY_SEMANTICS = MUST PRESERVE
TECHNICAL_IDENTIFIER_TYPE = DEFERRED

---

## 6. RELATIONSHIP RECONCILIATION

The candidate definition MUST preserve the established relationship chain:

Patient
→ Case
→ Visit
→ Clinic Day

Required meaning:

- one Case belongs to exactly one Patient;
- one Patient may have many Cases;
- one Visit belongs to exactly one Case;
- one Case may have many Visits;
- one Visit belongs to exactly one Clinic Day;
- one Clinic Day may contain many Visits;
- a Case may span multiple Clinic Days;
- a Case may span multiple Visits;
- a Patient Exit ends the current Visit, not the Case.

No alternate ownership model SHALL be introduced.

RESULT:

PATIENT_CASE_RELATIONSHIP = PRESERVE
CASE_VISIT_RELATIONSHIP = PRESERVE
VISIT_CLINIC_DAY_RELATIONSHIP = PRESERVE
CASE_CROSS_DAY_CONTINUITY = PRESERVE

---

## 7. CASE RECONCILIATION

The candidate definition MUST preserve the current Case state model:

1. Arrived — Awaiting Registration
2. Awaiting Doctor
3. With Doctor
4. Exited — Follow-up Pending
5. Completed

The candidate definition MUST preserve:

- current Case state;
- direct Case completion;
- Completion Status;
- Completed By Doctor;
- Completed At;
- Doctor-only clinical completion authority;
- distinction between Case completion and Visit Exit;
- distinction between Case completion and Clinic Day closure.

No Case state-history table or generic transition-history mechanism SHALL
be introduced.

RESULT:

CASE_STATE_MODEL = PRESERVE
CASE_COMPLETION_MODEL = PRESERVE
CASE_STATE_HISTORY = DEFERRED / NOT SELECTED

---

## 8. VISIT RECONCILIATION

The candidate definition MUST preserve:

- exactly one Case per Visit;
- exactly one Clinic Day per Visit;
- Visit Type;
- current Visit Protection State;
- Visit Clinical Content;
- Arrival Patient Condition.

Visit Type SHALL remain:

Visit & Consultation

Arrival Patient Condition SHALL remain exactly:

- Normal
- Moderately Unwell
- Severely Unwell

Arrival Patient Condition SHALL remain distinct from:

- vital signs;
- diagnosis;
- treatment;
- clinical decision;
- Past History.

A later Visit MUST NOT overwrite an earlier Visit.

RESULT:

VISIT_BOUNDARY = PRESERVE
VISIT_TYPE = PRESERVE
ARRIVAL_CONDITION = PRESERVE
CROSS_VISIT_OVERWRITE = PROHIBITED

---

## 9. VISIT PROTECTION RECONCILIATION

The candidate definition MUST preserve the Visit-level protection model:

- OPEN
- PROTECTED

Protection SHALL remain a Visit-level concern.

No independent protection state SHALL be created for each clinical content
item.

Protected clinical content amendment SHALL require Doctor authorization.

The candidate definition SHALL NOT introduce an audit/event-sourcing
implementation to represent protection history.

RESULT:

VISIT_PROTECTION = PRESERVE
CONTENT_LEVEL_PROTECTION = NOT SELECTED
GENERIC_AUDIT_EVENT_SOURCING = DEFERRED

---

## 10. CLINIC DAY RECONCILIATION

The candidate definition MUST preserve:

- Working Date as Clinic Day product identity;
- calendar-date semantics;
- exactly one Clinic Day per Working Date;
- uniqueness of Working Date;
- association of Cases and Visits with the applicable Clinic Day.

Clinic Day closure SHALL remain distinct from:

- Case completion;
- Visit Exit;
- deletion of daily clinical information.

Closure SHALL NOT erase open Case or Visit data.

No unrelated scheduling/calendar capability SHALL be introduced.

RESULT:

CLINIC_DAY_IDENTITY = WORKING_DATE
CLINIC_DAY_UNIQUENESS = PRESERVE
CLINIC_DAY_CLOSURE_DISTINCTION = PRESERVE

---

## 11. PAST HISTORY RECONCILIATION

The candidate definition MUST preserve Past History as:

- Patient-level;
- separate from Clinical History;
- composed of multiple history items;
- capable of ADD/MODIFY;
- under Doctor authority.

Past History MUST NOT become a Visit.

Past History MUST NOT be merged into Clinical History.

Clinical History MUST remain derived from preserved Visits.

RESULT:

PAST_HISTORY_LEVEL = PATIENT
PAST_HISTORY_SEPARATE_FROM_CLINICAL_HISTORY = YES
CLINICAL_HISTORY_SOURCE_OF_TRUTH = VISITS

---

## 12. ACTOR RECONCILIATION

The candidate definition MUST preserve one Actor concept with:

- Actor Identity;
- Actor Role / Authority Context.

Supported roles:

- Doctor
- Nurse

The candidate definition MUST preserve:

- Doctor creates Nurse accounts;
- Nurse does not receive clinical completion authority;
- Nurse does not receive Clinic Day closure authority;
- account creation does not transfer Main Admin, clinical, or system ownership;
- no public self-registration model.

Delegated permission implementation remains outside this physical schema
definition unless separately authorized.

Authentication and session/token representation remain deferred.

RESULT:

ACTOR_MODEL = PRESERVE
DOCTOR_AUTHORITY = PRESERVE
NURSE_BOUNDARY = PRESERVE
AUTHENTICATION = DEFERRED
AUTHORIZATION_RUNTIME = DEFERRED

---

## 13. CLINICAL CONTENT RECONCILIATION

The candidate definition MUST preserve the established cardinalities:

- Current Complaint = exactly 1 per Visit
- Investigation = 0..N per Visit
- Diagnosis = exactly 1 per Visit
- Treatment = N per Visit
- Follow-up = exactly 1 per Visit

Diagnosis MUST support the established preliminary/final distinction.

The candidate definition MUST NOT silently choose between:

- one combined clinical-content table;
- separate clinical-content tables;
- JSON/document storage;
- text-column composition;
- ORM-specific representation;

unless separately authorized.

RESULT:

CLINICAL_CONTENT_CARDINALITY = PRESERVE
CLINICAL_CONTENT_PHYSICAL_REPRESENTATION = DEFERRED

---

## 14. CLINICAL CONTENT AMENDMENT RECONCILIATION

The candidate definition MUST preserve:

- Doctor authorization for amendments;
- preservation requirement for amendment occurrence;
- current value remains the current Visit value;
- amendment MUST NOT overwrite a different Visit's clinical content.

The exact physical amendment mechanism remains deferred.

The candidate definition SHALL NOT introduce:

- amendment table;
- generic audit log;
- event sourcing;
- generic state history;

as an independently selected implementation mechanism.

RESULT:

AMENDMENT_AUTHORITY = DOCTOR
AMENDMENT_OCCURRENCE_PRESERVATION = REQUIRED
AMENDMENT_MECHANISM = DEFERRED

---

## 15. CLINICAL HISTORY RECONCILIATION

Clinical History SHALL remain derived from preserved Visits.

The candidate definition MUST preserve:

- Visit boundaries;
- chronology;
- Patient relationship;
- Case relationship;
- Clinic Day relationship;
- clinical content contained in each Visit.

No separate mutable Clinical History source of truth SHALL be introduced.

RESULT:

CLINICAL_HISTORY_SOURCE = DERIVED_FROM_VISITS
SEPARATE_MUTABLE_SOURCE = PROHIBITED

---

## 16. FOLLOW-UP TASK RECONCILIATION

The candidate definition MUST permit Follow-up Task as an operational
extension of Follow-up.

The following remain deferred:

- lifecycle;
- scheduling;
- reminders;
- calendar behavior;
- appointment semantics.

No appointment or scheduling capability SHALL be created through the
physical definition.

RESULT:

FOLLOW_UP_TASK_BOUNDARY = PRESERVE
FOLLOW_UP_TASK_LIFECYCLE = DEFERRED

---

## 17. CLINICAL ATTACHMENT RECONCILIATION

The candidate definition MUST preserve Clinical Attachments as an
established capability boundary associated with appropriate clinical
context.

Permitted conceptual examples include:

- X-ray / radiology material;
- laboratory result images;
- reports/documents;
- other clinical materials selected by the Doctor.

The following remain deferred:

- storage provider;
- binary storage mechanism;
- metadata representation;
- file size policy;
- attachment API;
- attachment UI;
- attachment authentication/authorization runtime.

No LIMS, RIS, PACS, or external clinical platform is introduced.

RESULT:

CLINICAL_ATTACHMENT_BOUNDARY = PRESERVE
ATTACHMENT_STORAGE = DEFERRED
ATTACHMENT_RUNTIME = DEFERRED

---

## 18. STRUCTURAL INTEGRITY RECONCILIATION

The candidate definition MUST preserve the following integrity requirements:

- Patient identity uniqueness;
- CPN uniqueness among active identities;
- Case → Patient integrity;
- Visit → Case integrity;
- Visit → Clinic Day integrity;
- one Clinic Day per Working Date;
- valid Visit Type;
- valid Visit Protection;
- valid Case State;
- coherent Case completion;
- required Clinical Content cardinalities;
- separation of Past History and Clinical History;
- preserved Visits;
- derivability of Clinical History;
- amendment occurrence preservation requirement;
- no cross-Visit overwrite.

No integrity requirement may be weakened or removed.

---

## 19. EXPLICIT DEFERRED DECISIONS

The reconciliation SHALL confirm that the candidate definition does NOT
silently resolve:

- technical identifier type;
- final physical table naming where still deferred;
- final physical column naming where still deferred;
- SQL syntax;
- SQL data types;
- migration syntax;
- ORM representation;
- repository interfaces;
- service implementation;
- API implementation;
- UI implementation;
- authentication implementation;
- authorization runtime;
- Clinical Content physical representation;
- amendment mechanism;
- Clinical Attachment storage;
- Follow-up Task lifecycle;
- Delete / Trash / Retention mechanics;
- physical destruction;
- Patient Merge;
- Audit Log;
- Event Sourcing;
- generic State History;
- database triggers;
- concurrency;
- idempotency;
- caching;
- deployment/runtime.

Any deferred item discovered to have been silently resolved SHALL produce:

FAIL = 1

and the reconciliation SHALL NOT close.

---

## 20. SAFETY INVARIANTS

The following MUST remain:

NEW_PRODUCT_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
CONTRACT_MUTATION = NO
RANDOM_REFACTORING = NO
UNAUTHORIZED_EXPANSION = NO

Any violation SHALL prevent reconciliation closure.

---

## 21. IMPLEMENTATION BOUNDARY

This reconciliation does NOT authorize:

- PostgreSQL startup;
- database creation;
- schema execution;
- SQL execution;
- migrations;
- ORM setup;
- repository code;
- service code;
- API routes;
- frontend implementation;
- authentication runtime;
- authorization runtime;
- deployment.

The existing bounded database implementation authorization remains
subordinate to the established definition and does not authorize deferred
technical decisions.

---

## 22. REQUIRED RECONCILIATION RESULT

The final reconciliation result SHALL use exactly one of:

RECONCILIATION = PASS

or

RECONCILIATION = FAIL

PASS is permitted only when:

- all required structural boundaries are represented;
- all required relationships and cardinalities are preserved;
- all known invariants are preserved;
- all deferred decisions remain deferred;
- all safety invariants remain intact;
- no unauthorized implementation occurred;
- SQL execution remains NOT PERFORMED;
- Backend execution remains NOT PERFORMED;
- Frontend execution remains NOT PERFORMED;
- FAIL = 0.

---

## 23. PROOF REQUIREMENTS

A successful reconciliation SHALL subsequently prove:

- source coverage;
- structural boundary coverage;
- relationship integrity;
- cardinality integrity;
- identity continuity;
- authority preservation;
- deferred-decision preservation;
- safety-invariant preservation;
- implementation boundary preservation;
- SQL execution absence;
- Backend execution absence;
- Frontend execution absence;
- FAIL = 0.

The proof SHALL be recorded separately from the implementation itself.

---

## 24. CURRENT STATUS

PHYSICAL_STRUCTURAL_DEFINITION = DRAFT
RECONCILIATION = PASS
IMPLEMENTATION_EXECUTION = NOT PERFORMED
SQL_EXECUTION = NOT PERFORMED
BACKEND_EXECUTION = NOT PERFORMED
FRONTEND_EXECUTION = NOT PERFORMED
FAIL = 0

This document is the controlled reconciliation instrument for the
candidate Persistence Physical Structural Definition.

It does NOT by itself close the Physical Structural Definition and does NOT
authorize implementation.
