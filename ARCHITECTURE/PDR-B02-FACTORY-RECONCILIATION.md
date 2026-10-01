# PDR-B02 — FACTORY RECONCILIATION

## 1. PURPOSE

This artifact reconciles two independent technical excavations:

- DeepSeek
- OX ALPHA

The excavations are evidence only.

They have no architecture authority.

This artifact does not authorize database schema or implementation.

---

## 2. AUTHORITATIVE BASELINE

The Factory-authoritative product facts for PDR-B02 are:

1. Visit clinical content includes:
   - Current Complaint
   - Investigation / Diagnosis
   - Treatment
   - Follow-up

2. Each recorded Visit contributes clinical information to the Patient's
   longitudinal Clinical History.

3. A later follow-up return creates a new Visit.

4. A later Visit must not overwrite a previous Visit.

5. Diagnosis modification requires an explicit Doctor command.

6. Treatment modification requires a stronger explicit Doctor command.

7. Investigation modification requires a stronger explicit Doctor command.

8. Doctor remains Clinical Authority.

No additional product requirement is accepted from either excavation
without an explicit Factory decision.

---

## 3. INDEPENDENT EXCAVATION AGREEMENT

DeepSeek and OX ALPHA independently agree on the following technical
observations:

- The four named clinical-content areas are established.
- The Visit is the historical encounter boundary.
- A later Visit is a new Visit and must not overwrite a previous Visit.
- Internal Visit amendment semantics are not fully defined.
- Cardinality of the four content areas is not established.
- Investigation and Diagnosis require semantic clarification because
  they are grouped in the content list but addressed separately in
  amendment rules.
- "Stronger Doctor command" is not yet technically defined.
- The facts do not by themselves mandate audit, versioning, or
  event sourcing.
- Follow-up must not be silently converted into scheduling.
- No clinical fields outside the authoritative facts may be invented.
- Persistence representation cannot responsibly be selected before
  the relevant product/domain questions are closed.
- Neither excavation selected a winning persistence model.

AGREEMENT STATUS = PASS

---

## 4. IMPORTANT DISTINCTION

The excavations identify two different boundaries:

A. CROSS-VISIT PRESERVATION

A later Visit must not overwrite a previous Visit.

B. WITHIN-VISIT AMENDMENT

Existing contracts permit explicit Doctor modification of:
- Diagnosis
- Treatment
- Investigation

The relationship between A and B is not yet fully defined.

The Factory must explicitly decide whether the no-overwrite rule applies:

- only to previous Visits as encounter records;
- to content within a Visit as well;
- or through another deliberately defined product rule.

No technical versioning or audit mechanism is inferred.

---

## 5. INVESTIGATION / DIAGNOSIS SEMANTIC GATE

The product content list uses:

Investigation / Diagnosis

The amendment rules separately reference:

- Diagnosis
- Investigation

This creates a domain-definition question.

Possible interpretations exist, but neither excavation is authorized
to choose one.

FACTORY DECISION REQUIRED:

- Are Investigation and Diagnosis one clinical content area with
  separate aspects?
- Or are they two distinct clinical content areas?

STATUS = PRODUCT DECISION OPEN

---

## 5F. FACTORY PRODUCT DECISION — DOCTOR CLINICAL AUTHORITY

The Factory has closed B02-Q5.

For Investigation and Treatment, Doctor Authority means more than technical edit permission.

The Doctor holds the final clinical decision authority regarding:

- what Investigation is clinically adopted or changed;
- what Treatment is clinically adopted, changed, stopped, or replaced.

Doctor Authorization therefore represents Clinical Authority, not merely a technical modification permission.

Operational Workflow participation does NOT transfer Clinical Authority.

This is a Product / Domain decision only.

It does NOT define:
- technical authorization implementation;
- roles or permission tables;
- API authorization;
- UI behavior;
- persistence representation;
- audit/versioning;
- workflow implementation.

B02-Q5 = FACTORY PRODUCT DECISION CLOSED

## 5E. FACTORY PRODUCT DECISION — CLINICAL ATTACHMENTS

The Factory has established Clinical Attachments as a Product Capability.

The Doctor may retain clinical materials considered important for the Patient's clinical memory, including, but not limited to:

- X-ray / radiology images.
- Laboratory result images.
- Clinical examination reports or documents.
- Other clinical material the Doctor chooses to retain.

Clinical Attachments are supporting clinical materials associated with the Patient / Visit context.

This capability does NOT turn the product into:
- a Laboratory Information Management System;
- a laboratory pipeline;
- a radiology system;
- a diagnostic interpretation system.

The product stores the clinical material selected by the Doctor for later clinical reference.

This is a Product / Domain decision only.

It does NOT define:
- file storage technology;
- database schema;
- attachment metadata schema;
- file naming;
- file size limits;
- supported file formats;
- upload/download API;
- UI;
- authorization implementation;
- retention/deletion technical semantics.

B02-Q5A = FACTORY PRODUCT DECISION CLOSED

## 5D. FACTORY PRODUCT DECISION — VISIT NO-OVERWRITE SCOPE

The Factory has closed B02-Q4.

The No-Overwrite rule applies to the relationship between different Visits.

Therefore:

- A Later Visit does NOT overwrite Clinical Content recorded in a Previous Visit.
- Within the SAME Visit, recorded Clinical Content MAY be amended and replaced by a new value.
- Any such amendment requires Doctor Authorization according to B02-Q3.

This is a Product / Domain decision only.

It does NOT define:
- database schema;
- persistence representation;
- versioning;
- audit history;
- event sourcing;
- amendment storage mechanism;
- API;
- UI;
- authorization implementation.

B02-Q4 = FACTORY PRODUCT DECISION CLOSED

## 5C. FACTORY PRODUCT DECISION — VISIT CLINICAL CONTENT AMENDMENT AUTHORITY

The Factory has closed B02-Q3.

The Doctor is the primary custodian of the clinical record and the medical manager of the Clinic.

Therefore:

- Any amendment to Clinical Content already recorded within a Visit requires Doctor Authorization.
- This is a Product / Domain authority decision.
- It does NOT define the technical amendment mechanism.
- It does NOT define whether a content area supports add, edit, or delete operations.
- Amendment occurrence preservation is now established by B02-Q6; technical preservation mechanics remain undefined.
- It does NOT select database schema, persistence representation, API, UI, or authorization implementation.

B02-Q3 = FACTORY PRODUCT DECISION CLOSED

## 5B. FACTORY PRODUCT DECISION — VISIT CLINICAL CONTENT CARDINALITY

The Factory has closed B02-Q2.

The cardinality decisions for Visit clinical-content areas are:

- Current Complaint = ONE value per Visit.
- Investigation = ZERO OR MANY entries per Visit.
- Diagnosis = ONE value per Visit.
- Treatment = MANY entries per Visit.
- Follow-up = ONE value per Visit.

Investigation and Diagnosis remain two distinct clinical-content areas.

Diagnosis may be preliminary or final according to the Doctor's clinical decision.

These are Product / Domain decisions only.

They do NOT select:
- database tables or columns;
- persistence representation;
- scalar vs structured storage;
- amendment representation;
- database schema;
- API;
- UI;
- authorization implementation.

B02-Q2 = FACTORY PRODUCT DECISION CLOSED

## 5A. FACTORY PRODUCT DECISION — INVESTIGATION AND DIAGNOSIS

The Factory has closed B02-Q1.

Investigation and Diagnosis are two distinct clinical-content areas
within the Visit.

They are not one combined persisted/product concept.

This decision establishes product/domain separation only.

It does NOT select:
- field structure;
- cardinality;
- persistence representation;
- amendment representation;
- database schema;
- API;
- UI;
- authorization implementation.

B02-Q1 = FACTORY PRODUCT DECISION CLOSED

## 6. CARDINALITY GATE

No authoritative cardinality has yet been established for:

- Current Complaint
- Investigation
- Diagnosis
- Treatment
- Follow-up

The Factory must determine the product-level cardinality before using
that decision to constrain persistence shape.

Important rule:

PRODUCT CARDINALITY != STORAGE SHAPE

A technical structure must not silently create a product rule.

STATUS = PRODUCT DECISION OPEN

---

## 7. FOLLOW-UP BOUNDARY

Follow-up is established as clinical content.

A later return creates a new Visit.

Nothing currently authorizes:

- appointment scheduling
- reminders
- calendar behavior
- booking
- automated follow-up actions

STATUS = CLINICAL CONTENT ONLY

---

## 8. AMENDMENT STRENGTH

The contracts establish:

- Diagnosis → explicit Doctor command.
- Treatment → stronger Doctor command.
- Investigation → stronger Doctor command.

What "stronger" means at product level is not yet defined.

Neither excavation is authorized to convert this distinction into:

- audit logging
- versioning
- event sourcing
- authorization implementation
- immutable records

STATUS = PRODUCT DECISION OPEN

---

## 9. AMENDMENT RECORDING

An unresolved question remains:

Must the system preserve the fact that an amendment occurred,
or is the requirement only that amendment be gated by the Doctor's
explicit command?

This is distinct from whether the content itself is retained.

STATUS = PRODUCT DECISION OPEN

---

## 10. MODEL SPACE — NOT A SELECTION

The excavations identify technically coherent model families:

- Flat scalar Visit content.
- Structured child records.
- Hybrid representation.
- Typed/content-block representation.
- Structured document/value representation.
- Versioned/superseding representation.
- Append-only representation.

No model is selected here.

Append-only/event-log approaches remain especially guarded because
they can introduce excluded event-sourcing behavior.

STATUS = MODEL SELECTION OPEN

---

## 11. FACTORY DECISION SET

Before selecting persistence representation, the following product
questions require explicit Factory ruling:

### B02-Q1
Are Investigation and Diagnosis one clinical content area or two?

### B02-Q2
What is the product cardinality for each clinical-content area
within one Visit?

### B02-Q3
Within an existing Visit, what exactly may be amended?

### B02-Q4
Does "Later Visit must not overwrite previous Visit" apply only
to previous Visit records, or also to content previously recorded
inside the same Visit?

### B02-Q5
What makes a Treatment/Investigation command "stronger" than the
explicit Diagnosis command?

### B02-Q6
Must an amendment itself be preserved as a product fact, or is
Doctor-authorized modification sufficient?

## 5G. FACTORY PRODUCT DECISION — AMENDMENT PRESERVATION & VISIT TRASH

The Factory has closed B02-Q6.

The occurrence of an Amendment is a Product Fact and MUST be preserved.

The Product establishes a dedicated Visit Trash boundary for retained
material belonging to a Visit. Visit Trash may feed into the Global Trash
surface.

Visit Trash is distinct from Patient Trash.

The Doctor may configure the Visit Trash retention period through Product
Settings.

The configurable retention range is bounded by:
- Minimum: 14 Clinic Days.
- Maximum: 30 Clinic Days.

The Doctor-selected retention period MUST remain within this range.

Automatic movement of retained Visit material to Trash is an intended
Product capability. The exact trigger semantics, counting rules, technical
storage representation, deletion/purge behavior, and final destruction
semantics remain undefined at this stage.

This decision does NOT establish Audit Log, Event Sourcing, Versioning,
technical amendment storage, database schema, API, UI, authorization
implementation, or any other technical mechanism.

## 5H. FACTORY PRODUCT DECISION — FOLLOW-UP OPERATIONAL EXTENSION

The Factory has closed B02-Q7.

Follow-up remains a Clinical Content area within the Visit.

Follow-up may establish a Follow-up Task within the Product.

The Follow-up Task is an operational extension of Follow-up.

This decision does NOT establish Scheduling, Appointment management, or Reminder capability.

The exact Follow-up Task lifecycle, persistence representation, authorization mechanics,
API, UI, and runtime behavior remain undefined at this stage.

B02-Q7 = FACTORY PRODUCT DECISION CLOSED

B02-Q6 = FACTORY PRODUCT DECISION CLOSED


### B02-Q7
Is Follow-up strictly clinical content with no system-acted-upon
scheduling behavior?

These are Factory questions.

They are not technical implementation questions yet.

---

## 12. TECHNICAL DECISION AFTER PRODUCT CLOSURE

Only after the required product decisions are closed should the
Factory select the persistence representation for B02.

The technical decision must then explicitly define:

- representation family;
- cardinality mapping;
- historical preservation behavior;
- amendment representation;
- persistence invariants.

No SQL/schema is authorized by this artifact.

---

## 13. DEFERRED

The following remain safely deferred:

- concrete field names;
- concrete datatypes;
- text length/encoding;
- indexes;
- physical ordering;
- ORM;
- migrations;
- repository implementation;
- API;
- UI;
- authentication;
- authorization implementation;
- runtime;
- history materialization strategy under PDR-I03;
- audit/event sourcing unless separately authorized.

---

## 14. SCOPE GUARD

No new product capability is introduced.

No billing.

No pharmacy.

No laboratory integration.

No scheduling.

No AI diagnosis or decision support.

No invented clinical fields.

No audit/event-sourcing requirement is inferred.

No implementation is authorized.

DATABASE_SCHEMA = NOT_DEFINED

PERSISTENCE_IMPLEMENTATION_AUTHORIZED = NO

PDR-B02 = BLOCKING TECHNICAL DECISION

NEXT ACTION = FACTORY PRODUCT DECISION CLOSURE

