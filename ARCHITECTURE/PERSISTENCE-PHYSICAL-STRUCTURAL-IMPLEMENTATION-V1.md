# Dr.Roby Clinic — Persistence Physical Structural Implementation V1

DOCUMENT = PERSISTENCE PHYSICAL STRUCTURAL IMPLEMENTATION V1
STATUS = IMPLEMENTED — BOUNDED STRUCTURAL REPRESENTATION
IMPLEMENTATION_AUTHORIZATION = CLOSED + BOUNDED
DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = YES
SQL_IMPLEMENTATION_AUTHORIZED = NO
SQL_EXECUTION = NOT PERFORMED
MIGRATION_IMPLEMENTATION = NOT PERFORMED
ORM_IMPLEMENTATION = NOT PERFORMED
REPOSITORY_IMPLEMENTATION = NOT PERFORMED
API_IMPLEMENTATION = NOT PERFORMED
UI_IMPLEMENTATION = NOT PERFORMED
AUTHN_IMPLEMENTATION = NOT PERFORMED
AUTHZ_IMPLEMENTATION = NOT PERFORMED
DEPLOYMENT_IMPLEMENTATION = NOT PERFORMED
FAIL = 0

## 1. PURPOSE

This artifact materializes the already-authorized persistence physical structural mapping
as a bounded implementation representation.

It does not select or execute SQL, migration syntax, ORM models, repository interfaces,
API schemas, runtime behavior, deployment behavior, or authentication/authorization
implementation.

## 2. AUTHORITATIVE SCOPE

The implementation representation covers only the already-closed persistence boundary:

- Patient
- Case
- Visit
- Clinic Day
- Past History Item
- Actor
- Visit Clinical Content
- Follow-up Task
- Clinical Attachments

Clinical History remains derived from authoritative Visits and is not introduced as a
separate source of truth.

## 3. IDENTITY REPRESENTATION

Patient identity preserves the stable Clinic Patient Number (CPN).

A technical persistence identity remains conceptually distinct from CPN.

The exact physical identifier type and implementation mechanism remain deferred.

## 4. STRUCTURAL RELATIONSHIPS

Patient anchors Cases.

Each Case belongs to exactly one Patient.

A Case may span multiple Clinic Days.

A Case may contain multiple Visits.

Each Visit belongs to exactly one Case.

Each Visit belongs to exactly one Clinic Day.

Previous Visits remain preserved.

Visit is an encounter boundary and is not collapsed into Case.

Clinic Day represents the working-date context.

Clinic Day closure is explicit and Doctor-authorized.

Clinic Day closure does not complete an open Case.

Patient Exit does not automatically complete a Case.

Case Completion remains Doctor-authorized.

## 5. PAST HISTORY AND CLINICAL HISTORY

Past History remains patient-level historical information.

Clinical History remains derived from authoritative recorded Visits.

No separate mutable Clinical History source of truth is introduced.

## 6. ACTOR REPRESENTATION

Actor is represented as one technical concept.

The representation preserves role and authority context.

Doctor and Nurse remain the established actors.

Nurse delegation does not transfer clinical authority or system ownership.

Authentication and authorization implementation remain outside this artifact.

## 7. VISIT CLINICAL CONTENT

Visit Clinical Content remains associated with its authoritative Visit.

The established content boundary is preserved:

- Current Complaint
- Investigation
- Diagnosis
- Treatment
- Follow-up

The physical storage mechanism remains deferred.

## 8. ARRIVAL PATIENT CONDITION

The established Visit-level Arrival Patient Condition boundary is preserved.

Allowed values remain exactly:

- Normal
- Moderately Unwell
- Severely Unwell

No additional value or state is introduced.

## 9. AMENDMENT AND NO-OVERWRITE BOUNDARY

Authorized amendments preserve the occurrence represented by the authoritative Visit.

Protected Visit information is not replaced by an uncontrolled latest-value mechanism.

Doctor authorization remains required where the established contract requires it.

The physical amendment/history mechanism remains deferred.

## 10. FOLLOW-UP TASK

Follow-up Task remains a persistence concept.

Its detailed lifecycle, state mechanism, and runtime behavior remain deferred.

## 11. CLINICAL ATTACHMENTS

Clinical Attachments remain within the established persistence boundary.

Storage mechanism, authorization mechanism, lifecycle, retention, and runtime behavior
remain deferred.

## 12. DEFERRED TECHNICAL DECISIONS

This artifact deliberately does not resolve:

- physical table names
- physical column names
- SQL types
- SQL syntax
- constraints syntax
- indexes
- migrations
- ORM models
- repository interfaces
- service implementation
- API schemas
- authentication implementation
- authorization implementation
- deployment/runtime behavior
- caching
- generic audit logging
- event sourcing
- generic state history
- Follow-up lifecycle implementation
- attachment storage implementation
- attachment authorization implementation
- patient merge implementation
- concurrency strategy
- locking strategy
- retry/idempotency strategy

## 13. IMPLEMENTATION SAFETY

NEW_PRODUCT_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
CONTRACT_MUTATION = NO
RANDOM_REFACTORING = NO
UNAUTHORIZED_SCOPE_EXPANSION = NO

## 14. IMPLEMENTATION RESULT

PERSISTENCE_PHYSICAL_STRUCTURAL_IMPLEMENTATION = PASS
STRUCTURAL_SCOPE = BOUNDED
CONTRACT_MUTATION = NO
DEFERRED_DECISIONS_RESOLVED = NO
SQL_EXECUTION = NOT PERFORMED
FAIL = 0

## 15. NEXT GATE

DATABASE SCHEMA IMPLEMENTATION PROOF AND RECONCILIATION
