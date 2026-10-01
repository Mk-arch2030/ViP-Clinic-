# Dr.Roby Clinic — Persistence Schema Implementation Plan V1

DOCUMENT = PERSISTENCE SCHEMA IMPLEMENTATION PLAN
STATUS = BOUNDED PLAN — IMPLEMENTATION NOT EXECUTED

## 1. PURPOSE

This document defines the bounded structural implementation plan for the
closed Dr.Roby Clinic persistence schema.

It translates the already-closed persistence schema concepts, relationships,
invariants, and authorized boundaries into a controlled structural mapping
plan.

This document does NOT execute or authorize SQL, migrations, ORM models,
repositories, services, API routes, UI behavior, authentication,
authorization implementation, deployment, or runtime behavior.

## 2. AUTHORITY

This plan is subordinate to and MUST conform to:

- PERSISTENCE-TECHNICAL-CONTRACT-V1
- PERSISTENCE-SCHEMA-DEFINITION-V1
- PERSISTENCE-SCHEMA-A01-RECONCILIATION-DECISION
- PERSISTENCE-SCHEMA-A01-PROOF
- PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-DECISION-V1

No product decision may be reinterpreted, weakened, expanded, or replaced
by this plan.

## 3. CURRENT AUTHORIZATION BOUNDARY

DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = YES

The authorization is bounded.

The following remain unauthorized:

SQL_IMPLEMENTATION_AUTHORIZED = NO
MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
ORM_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_AUTHORIZED = NO
UI_IMPLEMENTATION_AUTHORIZED = NO
AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO
DEPLOYMENT_IMPLEMENTATION_AUTHORIZED = NO

Therefore this document defines the structural plan only.

## 4. IMPLEMENTATION PLANNING PRINCIPLE

The implementation plan MUST proceed from the closed persistence boundary
without silently resolving deferred technical decisions.

The mapping MUST distinguish:

1. Domain/persistence concept.
2. Required persisted identity.
3. Required relationships.
4. Required integrity/invariant preservation.
5. Technical decisions that remain deferred.

The plan MUST NOT invent final physical table names, column names, SQL types,
migration syntax, ORM models, repository interfaces, or runtime behavior
unless those decisions are separately authorized.

## 5. BOUNDED PERSISTENCE CONCEPT MAP

The closed persistence boundary contains the following concepts:

- Patient
- Case
- Visit
- Clinic Day
- Past History Item
- Actor
- Visit Clinical Content
- Clinical History (derived concept — not an independently persisted entity)
- Follow-up Task
- Clinical Attachments

The Visit Clinical Content boundary includes:

- Current Complaint
- Investigation
- Diagnosis
- Treatment
- Follow-up

A01 Visit-level arrival/intake information MUST remain represented within
the established Visit-level persistence boundary.

The established arrival-condition values are:

- Normal
- Moderately Unwell
- Severely Unwell

## 6. STRUCTURAL RELATIONSHIP MAPPING

The implementation plan MUST preserve the following structural relationships:

Patient
→ owns / anchors Cases

Case
→ belongs to one Patient
→ may span multiple Clinic Days
→ may contain multiple Visits

Visit
→ belongs to one Case
→ belongs to one Clinic Day
→ preserves its own chronological clinical encounter boundary

Clinic Day
→ provides the working-date context for Visits

Past History
→ remains Patient-level
→ remains distinct from Clinical History
→ remains Doctor-controlled

Clinical History
→ is derived at read time from authoritative recorded Visits
→ Visits remain the authoritative clinical source
→ NO separately maintained Clinical History source of truth is created
→ MUST preserve Visit boundaries and chronology
→ MUST NOT become a mutable latest-value replacement for Visit history

Actor
→ is one technical persistence concept
→ carries established role/authority context
→ does not itself redefine authorization behavior

Follow-up Task
→ is a persistence concept that the schema MUST permit
→ exact lifecycle remains deferred

Clinical Attachments
→ are supporting materials associated with the established clinical
  persistence boundary
→ exact authorization and supported-file technical decisions remain deferred

## 7. IDENTITY MAPPING BOUNDARY

Patient MUST preserve one stable Clinic Patient Number (CPN).

Patient identity MUST remain stable across returning Visits.

Technical identifier type and physical representation remain deferred.

The implementation plan MUST therefore distinguish:

- Product-level stable identity.
- Technical persistence identity.

No final SQL identifier strategy is selected by this document.

## 8. CASE / VISIT BOUNDARY

Case and Visit MUST remain separate persistence concepts.

Patient Exit ends the current Visit.

Patient Exit MUST NOT automatically complete the Case.

Case completion remains governed by the established Doctor clinical authority.

The structural mapping MUST preserve the ability for:

- one Case to span multiple Clinic Days;
- one Case to contain multiple Visits;
- each Visit to retain its Clinic Day relationship;
- an open Case to continue beyond the Clinic Day in which a prior Visit ended.

## 9. CLINIC DAY MAPPING

Clinic Day MUST provide an explicit operational working-date context.

Clinic Day Start establishes the active working-date context.

Clinic Day Start MUST NOT:

- create a Case;
- create a Visit;
- complete a Case;
- transfer authority;
- grant Nurse clinical authority.

Clinic Day closure remains an explicit Doctor-authorized operation.

Midnight MUST NOT be treated as automatic Clinic Day closure.

Clinic Day closure MUST NOT complete an open Case.

## 10. CLINICAL CONTENT MAPPING

Visit Clinical Content MUST remain associated with the authoritative Visit.

The structural mapping MUST preserve the established clinical content areas:

- Current Complaint
- Investigation
- Diagnosis
- Treatment
- Follow-up

The physical representation of Clinical Content remains deferred.

No decision is made here between:

- one combined physical representation;
- separate physical representations;
- text-column composition;
- ORM-specific representation.

## 11. CLINICAL CONTENT AMENDMENT MAPPING

Authorized Clinical Content amendments MUST preserve the occurrence of the
authorized amendment.

Doctor Authorization remains required for protected clinical amendments.

The structural plan MUST NOT introduce a generic Audit Log or Event Sourcing
system as an implicit solution.

The exact technical mechanism for amendment preservation remains deferred
unless separately authorized.

## 12. VISIT PROTECTION AND NO-OVERWRITE

Protected Visit amendments require Doctor Authorization according to the
closed persistence rules.

Visit history MUST NOT be silently overwritten.

The implementation plan MUST preserve historical Visit boundaries and
chronology.

The exact physical protection mechanism remains an implementation concern and
MUST NOT be invented here.

## 13. ACTOR MAPPING

The persistence boundary contains one technical Actor concept.

The Actor representation MUST preserve the established role/authority
context, including:

- Clinical Authority
- Main Admin authority
- Nurse operational participation under delegated authority

Detailed Nurse delegated permissions remain outside this schema plan.

Authentication implementation remains unauthorized.

Authorization implementation remains unauthorized.

## 14. FOLLOW-UP TASK MAPPING

The schema MUST permit representation of a Follow-up Task.

The exact Follow-up Task lifecycle remains deferred pending its dedicated
authorized application/technical definition.

This plan MUST NOT invent that lifecycle.

## 15. CLINICAL ATTACHMENT MAPPING

The schema MUST permit Clinical Attachments associated with the established
clinical persistence boundary.

The exact file-format matrix, storage mechanism, authorization mechanism,
and lifecycle remain deferred unless separately authorized.

## 16. DELETE / TRASH / RETENTION BOUNDARY

No arbitrary deletion behavior is introduced by this plan.

Existing Product boundaries for Visit protection, trash, delete, and retention
remain authoritative.

Exact technical mechanisms remain deferred where the closed persistence
contract marks them as deferred.

## 17. TRANSACTIONAL INTEGRITY BOUNDARY

The eventual persistence implementation MUST preserve the established
relationships and invariants atomically where required.

This plan does not select:

- transaction syntax;
- isolation configuration;
- locking strategy;
- retry strategy;
- idempotency implementation;
- concurrency implementation.

Those remain technical implementation decisions outside this bounded plan.

## 18. EXPLICITLY DEFERRED

The following MUST remain unresolved by this plan:

- final physical table structure;
- final physical column structure;
- SQL syntax;
- SQL data types;
- migration mechanism;
- ORM representation;
- repository implementation;
- service implementation;
- API request/response schemas;
- authentication implementation;
- authorization implementation;
- deployment;
- runtime behavior;
- caching;
- generic audit logging;
- event sourcing;
- generic state-history mechanisms;
- Follow-up Task lifecycle;
- attachment technical storage mechanism;
- attachment authorization mechanism;
- patient merge mechanism;
- other deferred decisions already established by the closed persistence
  contracts.

## 19. IMPLEMENTATION SAFETY

NEW_PRODUCT_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
CONTRACT_MUTATION = NO
RANDOM_REFACTORING = NO
UNAUTHORIZED_EXPANSION = NO

This plan MUST NOT be used to bypass a deferred decision or create a new
implementation layer without its own authorization.

## 20. PROOF REQUIREMENTS

Before this plan can be considered closed:

1. Complete concept coverage MUST be verified.
2. Required relationships MUST be reconciled.
3. Required invariants MUST be reconciled.
4. A01 coverage MUST remain intact.
5. Deferred decisions MUST remain deferred.
6. No unauthorized implementation layer MUST be introduced.
7. The final artifact MUST be proven and Git-closed as an exact artifact.

## 21. NEXT GATE

After successful reconciliation and proof of this bounded plan:

DATABASE SCHEMA PHYSICAL STRUCTURAL DEFINITION AND IMPLEMENTATION AUTHORIZATION REVIEW

No SQL, migration, ORM, repository, API, UI, authentication, authorization,
or deployment implementation is authorized by this plan alone.

## 22. STATUS

PERSISTENCE_SCHEMA_IMPLEMENTATION_PLAN = CLOSED
STRUCTURAL_MAPPING = BOUNDED
RECONCILIATION = PASS
IMPLEMENTATION_EXECUTION = NOT PERFORMED
SQL_EXECUTION = NOT PERFORMED
FAIL = 0
