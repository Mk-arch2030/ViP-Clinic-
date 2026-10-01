# DR. ROBY CLINIC — DOMAIN / PERSISTENCE BOUNDARY

## 1. DOCUMENT IDENTITY

DOCUMENT = DOMAIN / PERSISTENCE BOUNDARY
VERSION = V1
PRODUCT = Dr_Roby_Clinic
PHASE = TECHNICAL CONTRACT DEFINITION
STATUS = DEFINITION DRAFT
AUTHORITY = PRODUCT MANUSCRIPT + CLOSED CONTRACTS C01-C08
PRECEDENCE = BELOW MANUSCRIPT AND CLOSED PRODUCT CONTRACTS

This document defines the boundary between the approved product domain
and the future technical persistence representation.

It does not redefine the Product or the closed Contracts.

It does not authorize database schema implementation.

---

## 2. AUTHORITATIVE BASIS

The technical boundary is derived from:

- Product Manuscript;
- CONTRACT-01 — Patient / Case / Visit;
- CONTRACT-02 — Clinic Day;
- CONTRACT-03 — Actor & Authority;
- CONTRACT-04 — Patient Identity & Clinical History;
- CONTRACT-05 — Visit / Clinical Encounter / Workflow;
- CONTRACT-06 — Clinical Decision & Treatment;
- CONTRACT-07 — Clinic Settings / Day Closure / Protection;
- CONTRACT-08 — Case Workflow;
- BUILD AUTHORIZATION / IMPLEMENTATION DEFINITION.

No technical persistence structure may contradict these authorities.

---

## 3. PURPOSE

The purpose of this boundary is to establish the domain concepts and
relationships that persistence must preserve before any database schema is
defined.

Persistence must preserve domain meaning.

Persistence representation must not redefine:

- Patient identity;
- Case identity;
- Visit identity;
- Clinic Day identity;
- Clinical History;
- Past History;
- Visit Type;
- Doctor Clinical Authority;
- Nurse operational delegation;
- Case completion;
- Clinic Day closure.

---

## 4. PRIMARY DOMAIN CONCEPTS

The persistence boundary must represent the following approved product
concepts without changing their meaning.

### 4.1 Patient

Patient is the persistent clinic identity.

The Patient has:

- stable Patient identity;
- system-generated Clinic Patient Number;
- approved retrieval methods through Name, Clinic Patient Number, and
  Barcode;
- Patient information;
- Past History;
- accumulated Clinical History through recorded Visits.

Retrieval methods are not separate Patient identities.

### 4.2 Case

Case represents one patient's continuing operational and clinical journey.

A Case:

- belongs to exactly one Patient;
- may remain open across multiple Clinic Days;
- may contain multiple Visits;
- may reach completion only through the Doctor's clinical completion
  decision.

A Case is distinct from a Visit.

### 4.3 Visit

Visit represents one organized clinical encounter.

A Visit:

- belongs to exactly one Case;
- occurs within exactly one Clinic Day;
- follows the product-level Arrival → Doctor → Exit flow;
- contributes to Clinical History;
- remains historically meaningful after Exit;
- does not by itself complete the Case.

A later follow-up encounter is a new Visit and must not overwrite a previous
Visit.

### 4.4 Clinic Day

Clinic Day represents the clinic's working-date context.

A Clinic Day:

- contains Cases and Visits recorded during that working context;
- may contain multiple Cases;
- may contain multiple Visits;
- may contain Cases in different workflow states;
- may continue to have an open Case after closure;
- is explicitly closed by the Doctor / Main Admin;
- must preserve daily data.

Clinic Day closure does not establish Case completion.

---

## 5. CLINICAL INFORMATION BOUNDARY

The following approved product information belongs to the clinical journey
and must remain distinguishable according to the closed Contracts:

- Past History;
- Clinical History;
- Current Complaint;
- Investigation and/or Diagnosis;
- Treatment;
- Follow-up information;
- Case completion decision;
- Visit Type.

### 5.1 Past History

Past History is patient information describing relevant history from before
the patient's recorded clinic Visit history.

Past History is not a Visit.

### 5.2 Clinical History

Clinical History is the accumulated history created by recorded Visits.

Previous Visits remain historically meaningful.

A later Visit must not overwrite an earlier Visit.

### 5.3 Visit Type

The product-level Visit Type capability defined by CONTRACT-08 includes:

`Visit & Consultation`

The persistence boundary must preserve the selected Visit Type and its
relationship to the recorded Visit.

No consultation pricing, fees, payments, balances, receipts, or accounting
representation is authorized.

### 5.4 Clinical Decision Information

The persistence boundary must preserve the meaning of approved clinical
information associated with the Visit, including where applicable:

- Current Complaint;
- Investigation and/or Diagnosis;
- Treatment;
- Follow-up.

The exact technical fields, data types, edit mechanisms, and storage
structures are not defined by this document.

---

## 6. REQUIRED RELATIONSHIP INVARIANTS

Persistence must preserve these product-level relationships:

1. One Patient may have Cases.
2. One Case belongs to exactly one Patient.
3. One Case may contain multiple Visits.
4. One Visit belongs to exactly one Case.
5. One Visit occurs within exactly one Clinic Day.
6. One Case may continue across multiple Clinic Days through its Visits.
7. A later follow-up Visit remains associated with the continuing Case when
   that Case remains open.
8. Previous Visits remain preserved.
9. Clinical History accumulates from recorded Visits.
10. Past History remains distinct from Clinical History.
11. Patient identity remains stable across returning Visits.
12. Patient retrieval methods do not create duplicate Patient identities.

---

## 7. WORKFLOW PERSISTENCE BOUNDARY

The product-level Case Workflow contains these five defined states:

1. Arrived — Awaiting Registration
2. Awaiting Doctor
3. With Doctor
4. Exited — Follow-up Pending
5. Completed

Persistence must be capable of preserving the approved workflow meaning.

The following distinctions must remain intact:

- Visit Exit ≠ Case Completion;
- Case Completion ≠ Clinic Day Closure;
- Case Completion is established by the Doctor.

This document does not define the technical state-machine implementation,
transition guards, concurrency model, event model, or transaction model.

---

## 8. ACTOR / AUTHORITY PERSISTENCE BOUNDARY

The persistence design must preserve the product authority model:

### Doctor

Doctor remains:

- Main Admin;
- Clinical Authority;
- clinic system owner;
- authority for Case completion;
- authority for Clinic Day closure;
- authority for clinical decisions.

### Nurse

Nurse remains:

- Operational Workflow Participant;
- participant through delegation by the Doctor.

Delegation must not be represented as transfer of:

- Clinical Authority;
- Main Admin authority;
- System Ownership.

This document does not define authentication, authorization, roles,
permissions, sessions, credentials, or identity-provider implementation.

---

## 9. CLINIC DAY CLOSURE / PROTECTION BOUNDARY

Persistence must preserve:

- Clinic Day working-date identity;
- daily Case and Visit history;
- explicit Doctor closure;
- preservation of open Cases after Clinic Day closure;
- the product distinction between preservation and higher protection.

CONTRACT-07 defines the product-level protection choices:

- IMMEDIATE;
- 3 DAYS.

The exact technical locking, immutability, audit, edit-control, and
protection implementation remains undefined.

---

## 10. SETTINGS BOUNDARY

Clinic Settings and Options remain under Doctor / Main Admin authority.

The complete Settings / Options list is not defined by the closed Contracts.

Therefore this boundary does not invent a Settings schema or persistence
model.

Any future Settings capability requires deliberate definition and the
appropriate technical contract.

---

## 11. PERSISTENCE RESPONSIBILITIES

Future persistence implementation must preserve:

- stable Patient identity;
- Clinic Patient Number uniqueness and stability;
- Patient → Case relationship;
- Case → Visit relationship;
- Visit → Clinic Day relationship;
- historical Visit preservation;
- Clinical History accumulation;
- Past History distinction;
- Visit Type preservation;
- Case workflow state meaning;
- Clinic Day closure meaning;
- Doctor authority boundaries;
- Nurse delegation boundaries.

These are persistence responsibilities, not yet database tables or columns.

---

## 12. EXPLICIT NON-DEFINITION

This document does NOT define:

- database tables;
- database columns;
- SQL;
- indexes;
- foreign-key implementation;
- constraints syntax;
- migrations;
- ORM models;
- repository implementation;
- transaction implementation;
- database engine behavior;
- API routes;
- API payloads;
- UI screens;
- UI fields;
- authentication;
- authorization implementation;
- permissions;
- sessions;
- audit implementation;
- deployment.

The exact database schema requires a separate deliberate technical
contract.

---

## 13. IMPLEMENTATION AUTHORIZATION

DOMAIN_PERSISTENCE_BOUNDARY = DEFINITION DRAFT
DATABASE_SCHEMA_AUTHORIZED = NO
PERSISTENCE_IMPLEMENTATION_AUTHORIZED = NO
API_AUTHORIZED = NO
UI_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO

This document defines a technical boundary only.

It does not authorize implementation.

---

## 14. PROOF REQUIREMENT

This document must be reconciled against:

- Product Manuscript;
- CONTRACT-01 through CONTRACT-08;
- BUILD AUTHORIZATION / IMPLEMENTATION DEFINITION.

Proof must establish:

- no new product capability was introduced;
- no authority was transferred;
- no approved relationship was contradicted;
- no database schema was prematurely defined;
- no API/UI/authorization implementation was introduced.

A failed proof stops progression.

---

## 15. NEXT GATE

NEXT GATE = DOMAIN / PERSISTENCE BOUNDARY PROOF

After this boundary is proven, the next step is to determine whether a
separate Persistence / Schema Technical Contract may be defined.

No database schema implementation is authorized by this document.

END OF DOMAIN / PERSISTENCE BOUNDARY
