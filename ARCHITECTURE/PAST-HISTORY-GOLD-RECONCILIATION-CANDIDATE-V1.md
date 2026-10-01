# PAST HISTORY — GOLD RECONCILIATION CANDIDATE V1

STATUS = CANDIDATE RECONCILIATION DOCUMENT
IMPLEMENTATION = NOT PERFORMED
DATABASE_CHANGE = NONE
RUNTIME_CHANGE = NONE
FAIL = 0

## 1. PURPOSE

This document reconciles the currently established ViP Product, Persistence,
PostgreSQL, and API definitions for Past History.

It is a Candidate reconciliation artifact only.

It MUST NOT:
- implement SQL;
- create or alter database objects;
- implement repositories;
- implement API runtime behavior;
- implement authentication or authorization;
- implement UI behavior;
- resolve deferred technical decisions by invention.

## 2. PRODUCT-LEVEL CLOSED FACTS

Past History is an established Patient-level concept.

The established product boundary is:

- Past History is Patient-level.
- A Patient may have multiple Past History Items.
- Each Past History Item belongs to exactly one Patient.
- Past History is distinct from Clinical History.
- Past History is not a Visit.
- Allowed Past History mutation semantics are ADD and MODIFY.
- Doctor holds authority for Past History changes.
- The resulting current information remains preserved as Past History.
- Separate preservation of Past History amendment occurrence is not required
  by the current Persistence Contract.

STATUS = CLOSED

## 3. STRUCTURAL PERSISTENCE REPRESENTATION

The structural persistence boundary represents:

Patient 1 → many Past History Items

The structural definition preserves:

- Patient ownership;
- one-to-many cardinality;
- separation from Clinical History;
- ADD and MODIFY mutation semantics;
- Doctor authority.

The structural representation does NOT define:

- technical item identifier type;
- physical item identifier generation;
- physical table columns;
- physical storage mechanism;
- repository interface;
- runtime mutation mechanism.

STATUS = CLOSED FOR STRUCTURAL BOUNDARY
PHYSICAL DETAILS = DEFERRED

## 4. STRUCTURAL IMPLEMENTATION ARTIFACT

The ViP structural implementation artifact records Past History Item
within its bounded persistence scope.

This represents an architectural structural mapping only.

It does not constitute PostgreSQL materialization.

The artifact explicitly preserves the deferred state of:

- physical identifier type;
- physical identifier mechanism;
- physical storage mechanism;
- runtime implementation layers.

STATUS = PRESENT — BOUNDED STRUCTURAL REPRESENTATION

## 5. TECHNICAL ITEM IDENTITY

The API surface contains:

PATCH /patients/{patientId}/past-history/{itemId}

However, the current ViP architecture does not define:

- itemId datatype;
- itemId generation;
- itemId persistence source;
- itemId primary-key semantics;
- itemId foreign-key semantics.

Therefore `itemId` remains a technical placeholder at the API surface.

STATUS = DEFERRED

No technical identity may be invented under this reconciliation.

## 6. POSTGRESQL PHYSICAL REPRESENTATION

The PostgreSQL schema implementation definition explicitly preserves Past History
as a separate bounded technical gate.

The current PostgreSQL increment does not authorize:

- Past History table structure;
- Past History item columns;
- Past History storage representation;
- Past History physical persistence mechanism.

The name `past_history_items` appears in architectural naming and boundary
documents, but no physical Past History table is authorized or created by the
current PostgreSQL increment.

STATUS = DEFERRED

PHYSICAL TABLE = NOT IMPLEMENTED

## 7. REPOSITORY LAYER

No Past History repository implementation is established by the current ViP
implementation baseline.

No repository operation for:

- adding a Past History Item;
- modifying a Past History Item;
- retrieving a Past History Item

is established as runtime implementation.

STATUS = NOT IMPLEMENTED

## 8. API SURFACE

The established API surface defines:

POST /patients/{patientId}/past-history

PATCH /patients/{patientId}/past-history/{itemId}

These operations trace to the established Past History capability boundary.

The API surface definition does not itself establish runtime implementation.

STATUS = DEFINED

API RUNTIME = NOT IMPLEMENTED

## 9. RUNTIME AUTHORIZATION

The product rule establishes Doctor authority for Past History changes.

However, runtime authorization implementation is not established by the current
ViP Past History implementation boundary.

Therefore the following remain separate:

- Product Authority = CLOSED
- Runtime Authorization = NOT IMPLEMENTED

No Nurse Past History authority may be inferred from the current candidate.

STATUS = PRODUCT AUTHORITY CLOSED
RUNTIME AUTHORIZATION = NOT IMPLEMENTED

## 10. USER INTERFACE

No canonical runtime UI implementation for Past History Item persistence,
ADD, or MODIFY has been established by the current ViP Past History boundary.

STATUS = NOT IMPLEMENTED

## 11. RUNTIME PROOF

No runtime proof establishes end-to-end Past History persistence.

There is currently no proven chain of:

Patient
→ Past History Item
→ PostgreSQL persistence
→ Repository
→ API runtime
→ authorization
→ retrieval/update
→ persisted result.

STATUS = NOT PROVEN

## 12. CLINICAL HISTORY BOUNDARY

Past History MUST remain separate from Clinical History.

Clinical History remains derived from authoritative recorded Visits.

No separate mutable Clinical History source of truth is introduced by this
reconciliation.

STATUS = CLOSED

## 13. GOLD STATUS MATRIX

| Layer | Status |
|---|---|
| Product Concept | CLOSED |
| Patient-Level Scope | CLOSED |
| One-to-Many Cardinality | CLOSED |
| ADD Mutation | CLOSED |
| MODIFY Mutation | CLOSED |
| Doctor Authority | CLOSED |
| Past History / Clinical History Separation | CLOSED |
| Structural Representation | PRESENT |
| Technical Item Identity | DEFERRED |
| Physical PostgreSQL Representation | DEFERRED |
| PostgreSQL Table | NOT IMPLEMENTED |
| PostgreSQL Columns | DEFERRED |
| Repository | NOT IMPLEMENTED |
| API Surface | DEFINED |
| API Runtime | NOT IMPLEMENTED |
| Runtime Authorization | NOT IMPLEMENTED |
| UI | NOT IMPLEMENTED |
| Runtime Proof | NOT PROVEN |

## 14. PORTABILITY BOUNDARY

The following ViP concepts are safe to retain as Product Candidate direction:

- Patient-level Past History;
- one-to-many Past History Items;
- ADD and MODIFY semantics;
- Doctor authority;
- separation from Clinical History.

The following MUST NOT be ported as implementation facts without a new
authorized technical gate:

- Past History table;
- Past History columns;
- itemId implementation;
- SQL;
- migrations;
- repository implementation;
- API runtime implementation;
- runtime authorization;
- UI persistence behavior.

## 15. RECONCILIATION DECISION

Past History is PRODUCT-CLOSED and STRUCTURALLY DEFINED in ViP.

Past History is NOT PHYSICALLY MATERIALIZED and NOT RUNTIME IMPLEMENTED.

No deferred technical decision has been resolved by this document.

No implementation authorization is created by this document.

Any future physical or runtime implementation MUST pass through its own
technical definition, authorization, implementation, and proof gates.

## 16. FINAL GOLD STATE

PRODUCT = CLOSED
STRUCTURAL_MODEL = PRESENT
PHYSICAL_IDENTITY = DEFERRED
POSTGRESQL = DEFERRED
REPOSITORY = NOT IMPLEMENTED
API_SURFACE = DEFINED
API_RUNTIME = NOT IMPLEMENTED
RUNTIME_AUTHORIZATION = NOT IMPLEMENTED
UI = NOT IMPLEMENTED
RUNTIME_PROOF = NOT PROVEN

UNAUTHORIZED_EXPANSION = NO
SILENT_DEFERRED_DECISION = NO
DATABASE_CHANGE = NONE
RUNTIME_CHANGE = NONE
FAIL = 0
