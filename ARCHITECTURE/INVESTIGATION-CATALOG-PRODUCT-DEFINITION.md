# INVESTIGATION CATALOG — PRODUCT DEFINITION

VERSION = V1
PHASE = PRODUCT CONTRACT DEFINITION
STATUS = DEFINITION DRAFT

## 1. PURPOSE

This definition establishes the product-level Investigation Catalog used
within the Doctor's clinical Visit journey.

It provides the Doctor with predefined Investigation options so that a
required Investigation can be selected and recorded without requiring
manual free-text entry for the investigation name.

This definition does not redefine CONTRACT-06.
It materializes the existing Investigation concept already included in
the approved clinical journey.

## 2. CATALOG CATEGORIES

The Investigation Catalog contains exactly two product categories:

1. Laboratory Investigations
2. Radiology / Imaging Investigations

The Doctor may choose an Investigation from either category according to
the clinical decision for the current Visit.

## 3. VISIT BEHAVIOR

When the Doctor determines that an Investigation is required:

Doctor
→ selects Laboratory Investigation OR Radiology / Imaging Investigation
→ records the selected Investigation for the current Visit
→ continues the Visit clinical journey.

The selected Investigation belongs to the current Visit's clinical
information.

## 4. DOCTOR AUTHORITY

The Doctor remains the Clinical Authority for determining whether an
Investigation is required and which Investigation is selected.

The Catalog does not create a new clinical authority or transfer any
clinical decision authority to the Nurse.

## 5. CATALOG BOUNDARY

The Investigation Catalog represents selectable Investigation options.

It does not itself represent:

- laboratory execution;
- specimen collection or tracking;
- laboratory workflow;
- laboratory results;
- radiology execution;
- imaging results;
- PACS;
- external laboratory integration;
- external radiology integration;
- diagnosis automation;
- AI diagnosis;
- AI clinical decision support.

## 6. PRODUCT SCOPE

The Catalog exists to support the existing clinical journey:

Current Complaint
→ Investigation and/or Diagnosis
→ Treatment
→ Follow-up when required
→ Case Completion when clinically established.

The Catalog does not introduce a new Visit lifecycle.

## 7. OPERATING MODES

The existing operating modes remain valid:

- Doctor-only operation;
- Doctor + Nurse operation.

Any operational recording performed by a Nurse remains subject to the
existing Doctor delegation and authority boundaries.

Selection of a clinical Investigation remains within Doctor clinical
authority.

## 8. OUT-OF-SCOPE

This definition does not authorize:

- LIMS functionality;
- laboratory information management;
- specimen pipeline;
- laboratory result management;
- radiology information system functionality;
- PACS;
- pharmacy functionality;
- billing or accounting;
- AI diagnosis;
- AI clinical decision support;
- multi-clinic or multi-branch operation;
- multi-tenant operation.

## 9. IMPLEMENTATION NON-AUTHORIZATION

This definition does not authorize:

- database schema;
- database migrations;
- SQL;
- repository implementation;
- API routes;
- API contracts;
- UI implementation;
- authentication implementation;
- authorization implementation;
- workflow state-machine implementation;
- deployment implementation.

Those require their respective later technical contracts and gates.

## 10. ACCEPTANCE TARGET

The Investigation Catalog is accepted at the product-definition level only
when:

- the catalog contains Laboratory Investigations and Radiology / Imaging
  Investigations;
- the Doctor can conceptually select an Investigation from either
  category for the current Visit;
- the selected Investigation remains part of the Visit's clinical
  information;
- Doctor clinical authority is preserved;
- the product does not expand into LIMS, laboratory execution, radiology
  execution, results management, pharmacy, hospital, or other excluded
  systems.

PRODUCT_DEFINITION_AUTHORIZED = YES
DATABASE_SCHEMA_AUTHORIZED = NO
PERSISTENCE_IMPLEMENTATION_AUTHORIZED = NO
API_AUTHORIZED = NO
UI_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO
