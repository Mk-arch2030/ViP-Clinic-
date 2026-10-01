# API SURFACE DEFINITION V1

## 1. PURPOSE

This document defines the API surface identity for the Dr.Roby Clinic
application.

It translates the already-proven Product Manuscript, Application Capability
Contract, Authorization Technical Contract, and closed API Technical Contract
into a bounded API surface.

This document does not create new product capabilities.

---

## 2. AUTHORITY

The API surface is derived from:

- DR-ROBY-CLINIC-PRODUCT-MANUSCRIPT.md
- APPLICATION-CAPABILITY-CONTRACT-V1.md
- AUTHORIZATION-TECHNICAL-CONTRACT-V1.md
- CONTRACT-01-PATIENT-CASE-VISIT.md
- CONTRACT-05-VISIT-CLINICAL-ENCOUNTER-WORKFLOW.md
- CONTRACT-03-ACTOR-AUTHORITY.md
- CONTRACT-07-CLINIC-SETTINGS-DAY-CLOSURE-PROTECTION.md
- CONTRACT-08-CASE-WORKFLOW.md
- API-TECHNICAL-CONTRACT-V1.md

No route below creates authority, ownership, clinical capability, or
operational capability not already established by those authorities.

---

## 3. API SURFACE PRINCIPLES

The API surface preserves:

Patient
  → Case
    → Visit
      → Clinical Encounter
        → Visit Exit

and:

Clinic Day
  → Cases / Visits recorded during that Clinic Day

The following distinctions MUST remain preserved:

- Patient Identity ≠ Case
- Case ≠ Visit
- Visit ≠ Clinic Day
- Past History ≠ Clinical History
- Visit Exit ≠ Case Completion
- Case Completion ≠ Clinic Day Closure
- Investigation ≠ Diagnosis
- Clinical Authority ≠ Operational Delegation

Clinical History is derived from preserved Visits and is not an independently
persisted source of truth.

---

## 4. RESOURCE SURFACE

### 4.1 Patient

| Operation | Method | Route |
|---|---|---|
| Register New Patient | POST | `/patients` |
| Retrieve Existing Patient | GET | `/patients/{patientId}` |
| Retrieve Existing Patient History | GET | `/patients/{patientId}/history` |
| Add Past History Item | POST | `/patients/{patientId}/past-history` |
| Modify Past History Item | PATCH | `/patients/{patientId}/past-history/{itemId}` |
| Retrieve Clinical History / Visit History | GET | `/patients/{patientId}/clinical-history` |

### 4.2 Case

| Operation | Method | Route |
|---|---|---|
| Establish / Continue Case | POST | `/patients/{patientId}/cases` |
| Complete Case | POST | `/cases/{caseId}/completion` |

`POST /patients/{patientId}/cases` represents the established application
operation to establish or continue the Patient's Case journey.

An existing open Case MUST NOT be duplicated merely because a later Visit
occurs.

Case completion remains Doctor-authorized.

### 4.3 Visit

| Operation | Method | Route |
|---|---|---|
| Create Visit | POST | `/cases/{caseId}/visits` |
| Record Arrival | POST | `/visits/{visitId}/arrival` |
| Record Clinical Information | POST | `/visits/{visitId}/clinical-record` |
| Record Exit | POST | `/visits/{visitId}/exit` |

A Visit belongs to exactly one Case and occurs within one Clinic Day.

A later follow-up return creates a new Visit.

`POST /visits/{visitId}/clinical-record` represents the Doctor Encounter
clinical-information operation.

Clinical Authority remains with the Doctor.

Operational Nurse participation does not transfer Clinical Authority.

### 4.4 Clinic Day

| Operation | Method | Route |
|---|---|---|
| Review Clinic Day Daily Data | GET | `/clinic-days/{clinicDayId}/daily-data` |
| Close Clinic Day | POST | `/clinic-days/{clinicDayId}/closure` |

Clinic Day closure remains explicitly Doctor-authorized.

Clinic Day closure MUST NOT automatically complete an open Case.

Midnight MUST NOT be interpreted by the API surface as automatic Clinic Day
closure.

### 4.5 Nurse Delegation

| Operation | Method | Route |
|---|---|---|
| Read Current Nurse Delegation | GET | `/clinic/nurse-delegation` |
| Change Nurse Delegation Scope | PATCH | `/clinic/nurse-delegation` |

The Doctor controls Nurse delegation scope.

The Nurse MUST NOT modify the Nurse's own delegation scope.

FULL and LIMITED operational delegation remain authorization concepts already
defined by the Authorization Technical Contract.

This surface does not create a new Nurse permission.

### 4.6 Doctor Notification

| Operation | Method | Route |
|---|---|---|
| Record / Execute Doctor Notification | POST | `/doctor-notifications` |

Doctor Notification is an operational interaction requesting Doctor attention.

It MUST NOT create:

- a new Case;
- a new Visit;
- a new authority;
- Case Completion;
- Clinic Day Closure;
- a Clinical Decision.

---

## 5. OPERATION RECONCILIATION

The API surface covers the complete reconciled operation inventory.

### Directly supported operations

1. Register New Patient
2. Retrieve Existing Patient
3. Retrieve Existing Patient History
4. Add Past History Item
5. Modify Past History Item
6. Establish / Continue Case
7. Complete Case
8. Create Visit
9. Record Arrival
10. Record Exit
11. Retrieve Clinical History / Visit History
12. Review Clinic Day Daily Data
13. Close Clinic Day
14. Record / Execute Doctor Notification

### API-surface review items now defined

15. Record Clinical Information
16. Read Current Nurse Delegation
17. Change Nurse Delegation Scope

No additional operation is introduced.

UNAUTHORIZED_OPERATIONS = 0

---

## 6. ACTOR / AUTHORITY BOUNDARY

The API surface MUST preserve the established actor model.

Doctor:

- Clinic Owner
- Main Admin
- System Owner
- Clinical Authority
- Case Completion authority
- Clinic Day Closure authority
- Nurse delegation-scope authority

Nurse:

- operational workflow participant;
- only within Doctor-approved delegation;
- no Clinical Authority;
- no System Ownership;
- no Case Completion authority;
- no Clinic Day Closure authority;
- no self-expansion of delegation.

The presence of a Nurse MUST NOT change the Doctor's authority.

---

## 7. CLINICAL BOUNDARY

Clinical information remains Visit-scoped.

The surface MUST preserve:

- Current Complaint
- Investigation
- Diagnosis
- Treatment
- Follow-up

as defined by the existing clinical contracts.

The API surface MUST NOT flatten clinical information into Patient-level
mutable clinical truth.

Previous Visits MUST remain historically meaningful.

Clinical History is derived from preserved Visits.

---

## 8. ROUTE NAMING BOUNDARY

The routes in this document are surface identities only.

This document does NOT define:

- request payload schemas;
- response envelopes;
- error schemas;
- HTTP status-code mapping;
- authentication transport;
- session/token mechanism;
- authorization middleware;
- idempotency;
- concurrency;
- transaction boundaries;
- pagination;
- filtering;
- sorting;
- versioning;
- rate limiting;
- caching;
- file/attachment transport;
- deployment/network behavior;
- database schema;
- SQL;
- migrations;
- ORM;
- repositories;
- UI implementation.

Those decisions remain governed by their own technical contracts and
authorization gates.

---

## 9. IMPLEMENTATION BOUNDARY

This document defines API surface identity.

It does not itself authorize implementation.

Route, Controller, and Service implementation remain governed by the existing
API Implementation Authorization Decision.

No Database, Authentication, Authorization, UI, or Deployment implementation
authorization is created by this document.

---

## 10. ACCEPTANCE CRITERIA

The API Surface Definition is acceptable only when:

1. Every route traces to an established capability or authorized operational
   boundary.
2. No new product capability is introduced.
3. Patient, Case, Visit, and Clinic Day remain distinct.
4. Past History remains distinct from Clinical History.
5. Visit Exit remains distinct from Case Completion.
6. Case Completion remains Doctor-authorized.
7. Clinic Day Closure remains Doctor-authorized.
8. Clinical Authority remains with Doctor.
9. Nurse delegation remains operational only.
10. Nurse self-expansion remains prohibited.
11. Doctor Notification remains operational only.
12. Clinical information remains Visit-scoped.
13. Clinical History remains derived from preserved Visits.
14. No technical decision outside API surface identity is invented.
15. Unauthorized expansion = NO.

---

## 11. STATUS

API_SURFACE_DEFINITION_V1 = DEFINITION DRAFT

API_ROUTE_SURFACE_DEFINED = YES

DIRECTLY_SUPPORTED_OPERATIONS = 14

API_SURFACE_REVIEW_ITEMS_DEFINED = 3

UNAUTHORIZED_OPERATIONS = 0

UNAUTHORIZED_EXPANSION = NO

IMPLEMENTATION_EXECUTION = NOT PERFORMED

SQL_EXECUTION = NOT PERFORMED

DATABASE_IMPLEMENTATION = NOT AUTHORIZED BY THIS DOCUMENT

AUTHENTICATION_IMPLEMENTATION = NOT AUTHORIZED BY THIS DOCUMENT

AUTHORIZATION_IMPLEMENTATION = NOT AUTHORIZED BY THIS DOCUMENT

UI_IMPLEMENTATION = NOT AUTHORIZED BY THIS DOCUMENT

DEPLOYMENT_IMPLEMENTATION = NOT AUTHORIZED BY THIS DOCUMENT

ROUTE_CLOSURE = PENDING PROOF

END OF API SURFACE DEFINITION V1
