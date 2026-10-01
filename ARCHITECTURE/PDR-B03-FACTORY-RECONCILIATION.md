# PDR-B03 FACTORY RECONCILIATION

## PDR-B03 — Past History Storage Structure

This reconciliation records the Factory Product Decisions for the
technical persistence decision concerning Past History.

These decisions establish Product / Domain behavior only.

They do NOT authorize database schema, persistence implementation,
API, UI, authorization implementation, audit infrastructure,
versioning, event sourcing, or deployment behavior.

---

## B03-Q1 — Past History Cardinality

The Factory has closed B03-Q1.

Past History is represented as MULTIPLE PATIENT-LEVEL ITEMS.

Past History is not a single undifferentiated patient-level record.

B03-Q1 = FACTORY PRODUCT DECISION CLOSED

---

## B03-Q2 — Past History Content and Mutation

The Factory has closed B03-Q2.

Past History contains medical/history information associated with the
Patient.

Past History information is recorded as patient-level history items.

A Past History item may be added or modified.

Any modification of Past History requires Doctor Authority.

B03-Q2 = FACTORY PRODUCT DECISION CLOSED

---

## B03-Q3 — Past History Mutation Authority and Preservation

The Factory has closed B03-Q3.

Past History mutation is limited to:

- ADD
- MODIFY

Doctor holds the authority to perform these Past History changes.

When Past History is modified, the resulting current Past History
remains preserved as Past History for the Patient.

The occurrence of the amendment itself is NOT established as a
separately preserved Product Fact.

This decision does not select any technical amendment mechanism,
versioning, audit log, event sourcing, schema, API, UI, or
authorization implementation.

B03-Q3 = FACTORY PRODUCT DECISION CLOSED

---

## B03 FACTORY BOUNDARY

Past History remains:

- Patient-level
- Distinct from Clinical History
- Not a Visit
- Independent of later Visit creation

The technical storage representation remains a technical persistence
concern to be defined separately from these Product Decisions.

---

## STATUS

PDR-B03 PRODUCT DECISIONS CLOSED

IMPLEMENTATION_AUTHORIZED = NO
DATABASE_SCHEMA_AUTHORIZED = NO
API_AUTHORIZED = NO
UI_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO
