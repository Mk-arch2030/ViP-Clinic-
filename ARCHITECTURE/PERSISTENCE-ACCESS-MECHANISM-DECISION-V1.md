# DR. ROBY CLINIC — PERSISTENCE ACCESS MECHANISM DECISION V1

DOCUMENT = PERSISTENCE ACCESS MECHANISM DECISION
VERSION = V1
STATUS = DEFINITION DRAFT

## 1. PURPOSE

This document defines the concrete technical mechanism by which the
authorized Application Service layer may access the already-established
PostgreSQL persistence boundary.

This document does not implement persistence access.

## 2. ESTABLISHED BOUNDARY

APPLICATION SERVICE
        ↓
[ PERSISTENCE ACCESS MECHANISM — TO BE SELECTED ]
        ↓
POSTGRESQL AUTHORITATIVE PERSISTENCE

The Application Service MUST NOT bypass the persistence access mechanism
and MUST NOT perform direct database access.

## 3. ESTABLISHED AUTHORITIES

DATABASE TECHNOLOGY = PostgreSQL

POSTGRESQL = AUTHORITATIVE DURABLE PERSISTENCE LAYER

CPN AUTHORITY = PostgreSQL

CPN ALLOCATION MECHANISM = PostgreSQL Sequence

ORM = NOT REQUIRED / SEPARATE DECISION

## 4. CURRENT UNDEFINED DECISION

The concrete persistence access mechanism has not yet been selected.

The following mechanisms are therefore NOT assumed by this document:

- Repository
- Adapter
- Gateway
- Port
- ORM
- Direct database access from Application Service

No implementation may select one of these by convention or convenience.

## 5. REQUIRED DECISION

A bounded technical decision shall select exactly one concrete
persistence access mechanism for the first authorized PostgreSQL
persistence increment.

The selected mechanism MUST:

- preserve the Application / Persistence boundary;
- prevent direct database access from Application Services;
- support the authorized PostgreSQL Patient persistence increment;
- support the authorized transaction boundary;
- preserve PostgreSQL authority for CPN allocation;
- preserve the existing mock/test runtime;
- introduce no ORM unless separately authorized;
- introduce no new product capability;
- introduce no new actor or authority;
- resolve no unrelated deferred technical decision.

## 6. FIRST IMPLEMENTATION BOUNDARY

The selected mechanism shall initially support only the bounded
Patient persistence increment already authorized by the existing
PostgreSQL persistence implementation authorization.

No unrelated persistence implementation is authorized by this decision.

## 7. NON-AUTHORIZATION

This document does NOT authorize:

- SQL implementation
- migration implementation
- ORM implementation
- repository implementation
- adapter implementation
- gateway implementation
- API implementation
- UI implementation
- authentication implementation
- authorization implementation
- deployment implementation
- unrelated runtime refactoring

## 8. DECISION STATUS

PERSISTENCE_ACCESS_MECHANISM_SELECTED = NO

PERSISTENCE_ACCESS_MECHANISM_IMPLEMENTED = NO

REPOSITORY_SELECTED = NO

ADAPTER_SELECTED = NO

GATEWAY_SELECTED = NO

PORT_SELECTED = NO

ORM_SELECTED = NO

APPLICATION_INTEGRATION = NOT PERFORMED

SQL_EXECUTION = NOT PERFORMED

## 9. NEXT GATE

NEXT GATE = PERSISTENCE ACCESS MECHANISM REVIEW

The review shall select the concrete mechanism only after reconciliation
with the established domain, persistence, PostgreSQL, API, and authority
contracts.

END OF PERSISTENCE ACCESS MECHANISM DECISION V1

## 10. IMPLEMENTATION EVIDENCE RECONCILIATION

Current implementation excavation confirms:

- Application Service implementation exists for REGISTER NEW PATIENT.
- The current application service constructs the Patient domain object.
- No Repository implementation exists in the current application tree.
- No Adapter implementation exists in the current application tree.
- No Gateway implementation exists in the current application tree.
- No Port implementation exists in the current application tree.
- No ORM implementation exists.
- No direct PostgreSQL access exists inside the Application Service.
- PostgreSQL Pool configuration exists only as database connectivity infrastructure.
- No existing mock persistence adapter was found in the current application tree.

Therefore:

CURRENT_PERSISTENCE_ACCESS_MECHANISM = NOT_IMPLEMENTED

CURRENT_PERSISTENCE_ACCESS_MECHANISM_SELECTION = NOT_FOUND

## 11. REQUIRED MECHANISM RESPONSIBILITIES

Before selecting a concrete mechanism, the following responsibilities
must be explicitly reconciled:

1. Define the application-facing persistence access boundary.
2. Keep PostgreSQL-specific access outside the Application Service.
3. Allow the authorized Patient persistence increment to be implemented.
4. Allow the authorized Patient registration transaction to be represented
   without moving transaction ownership into the Application Service.
5. Preserve PostgreSQL authority for CPN allocation.
6. Prevent domain objects from depending on PostgreSQL infrastructure.
7. Preserve the existing application/domain boundary.
8. Preserve the existing testable application capability.
9. Avoid introducing an ORM.
10. Avoid introducing a generic persistence abstraction that exceeds the
    authorized Patient persistence increment.
11. Avoid resolving unrelated deferred persistence decisions.
12. Preserve a bounded path for future authorized persistence capabilities.

## 12. MECHANISM SELECTION CRITERIA

Any proposed mechanism must be evaluated against:

- Boundary preservation
- Dependency direction
- PostgreSQL isolation
- Transaction ownership
- CPN authority preservation
- Testability
- Mock/test runtime preservation
- Incremental Patient persistence support
- Minimality
- Future bounded extensibility
- No unauthorized abstraction
- No ORM dependency
- No scope expansion

No concrete mechanism is selected by this section.

## 13. CURRENT DECISION STATE

PERSISTENCE_ACCESS_MECHANISM_SELECTION = PENDING

PERSISTENCE_ACCESS_MECHANISM_IMPLEMENTATION = NOT PERFORMED

NEXT GATE = PERSISTENCE ACCESS MECHANISM CANDIDATE RECONCILIATION


## 14. CANDIDATE RECONCILIATION

Repository, Adapter, Gateway, Port/Adapter, and other persistence-access
patterns were searched across the current Architecture manuscript,
application/API/backend/domain implementation tree, and Git history.

RESULT:

- No previously closed persistence access mechanism was found.
- No existing backend Repository implementation was found.
- No existing backend Adapter implementation was found.
- No existing backend Gateway implementation was found.
- No existing backend Port implementation was found.
- PostgreSQL Pool configuration is infrastructure connectivity only.
- Frontend Mock Adapter references are not backend persistence access
  mechanisms.
- Therefore the concrete backend persistence access mechanism remains
  architecturally undefined.

### 14.1 CANDIDATES UNDER REVIEW

The bounded candidate set for this decision is:

1. Repository
2. Persistence Adapter
3. Persistence Gateway
4. Port + Adapter
5. Minimal bounded persistence access module

No candidate is selected by this section.

### 14.2 CANDIDATE DECISION REQUIREMENT

The selected mechanism must:

- expose a bounded application-facing persistence boundary;
- keep PostgreSQL-specific behavior outside Application Services;
- support the authorized Patient persistence increment;
- support the bounded Patient transaction;
- preserve PostgreSQL authority for CPN allocation;
- preserve dependency direction;
- preserve application/domain testability;
- avoid ORM adoption;
- avoid generic abstraction beyond the authorized increment;
- avoid resolving unrelated deferred persistence decisions;
- preserve a bounded path for future persistence capabilities.

### 14.3 CANDIDATE STATUS

REPOSITORY = UNDER REVIEW
PERSISTENCE_ADAPTER = UNDER REVIEW
PERSISTENCE_GATEWAY = UNDER REVIEW
PORT_ADAPTER = UNDER REVIEW
MINIMAL_PERSISTENCE_ACCESS_MODULE = UNDER REVIEW

MECHANISM_SELECTED = NO
IMPLEMENTATION_PERFORMED = NO

NEXT_GATE = BOUNDED PERSISTENCE ACCESS MECHANISM DECISION REVIEW


## 15. BOUNDED CANDIDATE DECISION MATRIX

| Criterion | Repository | Persistence Adapter | Persistence Gateway | Port + Adapter | Minimal Persistence Access Module |
|---|---|---|---|---|---|
| Separates PostgreSQL from Application Service | PASS | PASS | PASS | PASS | PASS |
| Supports authorized Patient persistence increment | PASS | PASS | PASS | PASS | PASS |
| Preserves domain independence from PostgreSQL | PASS | PASS | PASS | PASS | PASS |
| Supports bounded transaction representation | PASS | PASS | PASS | PASS | PASS |
| Preserves PostgreSQL CPN authority | PASS | PASS | PASS | PASS | PASS |
| Supports isolated testing | PASS | PASS | PASS | PASS | PASS |
| Permits future infrastructure replacement | PASS | PASS | PASS | PASS | BOUNDED |
| Minimizes additional abstraction | REVIEW | REVIEW | REVIEW | FAIL | PASS |
| Avoids ORM dependency | PASS | PASS | PASS | PASS | PASS |
| Fits bounded Patient increment | PASS | PASS | PASS | REVIEW | PASS |
| Scope-expansion risk | LOW | LOW | LOW | MEDIUM | LOWEST |
| Additional architectural concepts required | LOW | MEDIUM | MEDIUM | HIGH | LOW |

### 15.1 MATRIX INTERPRETATION

The matrix does not select a mechanism by convention or popularity.

Repository, Persistence Adapter, Persistence Gateway, Port + Adapter,
and Minimal Persistence Access Module can all satisfy the fundamental
persistence boundary requirements.

However, Port + Adapter introduces the highest additional architectural
surface for the bounded increment.

Minimal Persistence Access Module introduces the least additional
architectural surface, but its responsibilities must be explicitly
defined before it can be distinguished from an alternative Repository
concept.

Therefore:

MATRIX_DECISION = NOT YET SELECTED

NEXT REVIEW QUESTION =
WHICH CANDIDATE PROVIDES THE REQUIRED PERSISTENCE ACCESS BOUNDARY WITH
THE LEAST UNAUTHORIZED ARCHITECTURAL MEANING?

IMPLEMENTATION = NOT PERFORMED


## 16. RESPONSIBILITY-FIRST MECHANISM DEFINITION

Before selecting a mechanism name, the required responsibility is defined
independently of architectural pattern terminology.

### 16.1 REQUIRED RESPONSIBILITY

The mechanism shall provide the bounded technical boundary through which
the Application Service can request authorized Patient persistence behavior
without directly depending on PostgreSQL implementation details.

For the first authorized persistence increment, the mechanism must be
capable of representing only the persistence behavior required for:

1. Patient registration persistence.
2. Patient retrieval by the already-authorized technical Patient identity.
3. Integration with the authoritative PostgreSQL CPN allocation mechanism.
4. The already-authorized bounded Patient registration transaction.
5. Success/failure propagation without exposing partial Patient registration.

### 16.2 EXPLICIT NON-RESPONSIBILITIES

The mechanism shall NOT:

- define domain rules;
- own Patient business identity;
- redefine CPN authority;
- generate an alternative CPN;
- expose PostgreSQL infrastructure to the Application Service;
- become an ORM;
- define unrelated persistence abstractions;
- define API behavior;
- define UI behavior;
- define authentication or authorization;
- resolve delete/retention semantics;
- resolve merge semantics;
- resolve audit/event-sourcing semantics;
- resolve caching;
- resolve deployment/runtime infrastructure;
- become a generic persistence framework.

### 16.3 BOUNDARY

The intended dependency direction is:

Application Service
        |
        v
[ BOUNDED PERSISTENCE ACCESS MECHANISM ]
        |
        v
PostgreSQL persistence infrastructure

The Application Service MUST NOT bypass the bounded mechanism.

The Domain MUST NOT depend on the bounded mechanism.

PostgreSQL-specific implementation MUST remain below the bounded
persistence access mechanism.

### 16.4 RESPONSIBILITY TEST

A candidate is eligible only if it can carry the required responsibility
without introducing architectural meaning outside the authorized increment.

A candidate is not selected merely because its name is conventional.

RESPONSIBILITY_DEFINITION = CLOSED FOR REVIEW

MECHANISM_NAME = NOT YET SELECTED
IMPLEMENTATION = NOT PERFORMED

NEXT_GATE = MECHANISM SEMANTIC RECONCILIATION


## 17. MECHANISM SEMANTIC RECONCILIATION

Each candidate is evaluated against the already-closed responsibility,
not against convention, popularity, or implementation preference.

### 17.1 REQUIRED SEMANTIC RESPONSIBILITY

The mechanism must provide one bounded technical boundary through which
the Application Service requests the authorized Patient persistence
behavior while PostgreSQL-specific implementation remains below that
boundary.

Required behavior:

- Patient persistence access.
- Patient retrieval by technical Patient identity.
- Integration with authoritative PostgreSQL CPN allocation.
- Support for the authorized bounded Patient registration transaction.
- Success/failure propagation without partial Patient registration.

### 17.2 SEMANTIC CANDIDATE MATRIX

| Semantic Test | Repository | Persistence Adapter | Persistence Gateway | Port + Adapter | Minimal Persistence Access Module |
|---|---|---|---|---|---|
| Directly represents bounded persistence access | PASS | PASS | PASS | PASS | PASS |
| Naturally represents Patient persistence behavior | PASS | REVIEW | REVIEW | REVIEW | REVIEW |
| Requires explicit second abstraction to be meaningful | NO | REVIEW | NO | YES | NO |
| Implies infrastructure adaptation semantics | NO | YES | REVIEW | YES | NO |
| Implies explicit interface/port semantics | NO | REVIEW | NO | YES | NO |
| Implies generic technical gateway semantics | NO | NO | YES | NO | NO |
| Introduces domain-oriented repository semantics | YES | NO | NO | NO | REVIEW |
| Can remain bounded to Patient persistence | PASS | PASS | REVIEW | PASS | PASS |
| Can preserve PostgreSQL below the boundary | PASS | PASS | PASS | PASS | PASS |
| Requires unrelated architectural concepts | LOW | MEDIUM | MEDIUM | HIGH | LOW |
| Semantic fit to current responsibility | REVIEW | REVIEW | REVIEW | REVIEW | REVIEW |

### 17.3 SEMANTIC INTERPRETATION

Repository carries an established persistence-access meaning and can
naturally represent Patient persistence behavior, but its domain-oriented
semantics must remain explicitly bounded to the authorized increment.

Persistence Adapter carries infrastructure adaptation meaning and may
implicitly require a separate abstraction boundary if used as the
Application Service-facing mechanism.

Persistence Gateway carries a broader technical-access meaning and does
not naturally constrain itself to the Patient persistence responsibility.

Port + Adapter explicitly introduces two architectural concepts and is
therefore semantically larger than the currently authorized increment.

Minimal Persistence Access Module carries the least predefined pattern
meaning, but it is eligible only if its contract remains explicitly
bounded and does not become an unnamed Repository, Gateway, or
Port/Adapter architecture.

### 17.4 DECISION RULE

The selected mechanism must:

1. satisfy the complete closed responsibility;
2. introduce no architectural concept not required by that responsibility;
3. preserve the established Application Service → Persistence boundary;
4. preserve PostgreSQL as the authoritative persistence mechanism;
5. preserve PostgreSQL CPN allocation authority;
6. preserve the authorized transaction boundary;
7. avoid ORM or generic persistence-framework semantics;
8. remain bounded to the first Patient persistence increment.

No candidate is selected solely because it is conventional.

MECHANISM_SELECTION = NOT YET SELECTED
IMPLEMENTATION = NOT PERFORMED

NEXT_GATE = SEMANTIC MINIMUM-RESPONSIBILITY DECISION


## 18. SEMANTIC MINIMUM-RESPONSIBILITY DECISION

The responsibility is already closed.

The decision question is now:

WHICH CANDIDATE EXPRESSES THE REQUIRED RESPONSIBILITY
WITHOUT REQUIRING ARCHITECTURAL MEANING BEYOND IT?

### 18.1 MINIMUM REQUIRED MEANING

The mechanism needs to mean only:

"Application-level access to the authorized persistent Patient data,
behind the established persistence boundary."

It does NOT need to mean:

- a generic persistence framework;
- an infrastructure adaptation architecture;
- an explicit hexagonal Port + Adapter architecture;
- a broad technical gateway;
- ORM behavior;
- a generic data-access abstraction;
- ownership of domain rules;
- ownership of PostgreSQL;
- ownership of CPN authority.

### 18.2 CANDIDATE ELIMINATION

PORT + ADAPTER
DECISION = ELIMINATED FOR MINIMUM-MEANING PURPOSES

Reason:
It introduces explicit port and adapter concepts that are not required
by the closed responsibility.

PERSISTENCE ADAPTER
DECISION = ELIMINATED FOR MINIMUM-MEANING PURPOSES

Reason:
The term describes an infrastructure adaptation role rather than the
complete Application Service-facing persistence responsibility.

PERSISTENCE GATEWAY
DECISION = ELIMINATED FOR MINIMUM-MEANING PURPOSES

Reason:
The term introduces a broader technical gateway meaning than the
bounded Patient persistence responsibility requires.

MINIMAL PERSISTENCE ACCESS MODULE
DECISION = REVIEWED BUT NOT SELECTED

Reason:
It minimizes predefined architectural meaning, but the term itself does
not establish a sufficiently meaningful persistence responsibility.
If its contract is later defined as Patient persistence access, it risks
becoming a Repository under another name.

REPOSITORY
DECISION = REMAINING SEMANTIC CANDIDATE

Reason:
Repository directly expresses persistence access for a bounded
domain-oriented persistent entity without requiring a second architectural
concept.

### 18.3 SEMANTIC BOUNDARY OF REPOSITORY

For this decision, Repository does NOT mean:

- generic repository framework;
- repository for every domain object;
- ORM repository;
- domain-rule owner;
- transaction owner outside the authorized persistence workflow;
- CPN authority;
- API service;
- authorization mechanism.

For this decision, Repository means only:

"Bounded Patient persistence access behind the established persistence
boundary."

The Repository boundary shall preserve:

Application Service
        |
        v
Patient Repository
        |
        v
PostgreSQL persistence infrastructure

The Domain remains independent of the Repository.

PostgreSQL-specific implementation remains below the Repository boundary.

### 18.4 MINIMUM-RESPONSIBILITY RESULT

SEMANTIC_MINIMUM_TEST = PASS

REMAINING_CANDIDATE = REPOSITORY

MECHANISM_SELECTED = REPOSITORY

SELECTION_REASON =
"Repository is the smallest established architectural meaning that
directly names the required bounded Patient persistence access without
requiring an additional architectural concept."

IMPLEMENTATION = NOT PERFORMED

NO_SQL_IMPLEMENTATION = PERFORMED
NO_MIGRATION_IMPLEMENTATION = PERFORMED
NO_ORM_IMPLEMENTATION = PERFORMED
NO_REPOSITORY_IMPLEMENTATION = PERFORMED
NO_API_IMPLEMENTATION = PERFORMED
NO_UI_IMPLEMENTATION = PERFORMED

NEXT_GATE = REPOSITORY MECHANISM DECISION REVIEW


## 19. REPOSITORY MECHANISM DECISION REVIEW

### 19.1 DECISION UNDER REVIEW

SELECTED_MECHANISM = REPOSITORY

The Repository mechanism is reviewed against all previously closed
architectural authorities and implementation boundaries.

### 19.2 AUTHORITY RECONCILIATION

PERSISTENCE_BOUNDARY
= PRESERVED

APPLICATION_SERVICE_BOUNDARY
= PRESERVED

DOMAIN_INDEPENDENCE
= PRESERVED

POSTGRESQL_AUTHORITY
= PRESERVED

CPN_AUTHORITY
= PRESERVED

CPN_ALLOCATION_MECHANISM
= PRESERVED

AUTHORIZED_PATIENT_TRANSACTION
= PRESERVED

ORM_DECISION
= NOT INTRODUCED

API_BOUNDARY
= PRESERVED

UI_BOUNDARY
= PRESERVED

AUTHENTICATION_AUTHORIZATION_BOUNDARY
= PRESERVED

DEFERRED_DECISIONS
= NOT RESOLVED

### 19.3 SCOPE RECONCILIATION

The Repository decision introduces no new product capability.

The Repository decision introduces no new actor.

The Repository decision transfers no authority.

The Repository decision does not define:

- SQL schema beyond the already-authorized persistence boundary;
- migration tooling;
- ORM;
- API payloads;
- API authentication;
- UI behavior;
- authorization behavior;
- deletion or retention semantics;
- Patient merge semantics;
- audit/event sourcing;
- caching;
- deployment infrastructure;
- generic persistence framework.

### 19.4 IMPLEMENTATION BOUNDARY

Selecting Repository does NOT authorize Repository implementation.

Repository implementation remains a separate downstream gate.

The current state therefore remains:

REPOSITORY_MECHANISM_SELECTED = YES
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION = NOT_PERFORMED

No implementation may begin until the implementation authorization
boundary is explicitly established.

### 19.5 REVIEW RESULT

REPOSITORY_MECHANISM_DECISION_REVIEW = PASS

DECISION_STATUS = CLOSED + PROVEN

MECHANISM_SELECTED = REPOSITORY

IMPLEMENTATION_AUTHORIZED = NO

IMPLEMENTATION = NOT_PERFORMED

SCOPE_EXPANSION = NO

AUTHORITY_TRANSFER = NO

DEFERRED_DECISIONS_RESOLVED = NO

NEXT_GATE = REPOSITORY IMPLEMENTATION DEFINITION + AUTHORIZATION REVIEW


## 20. REPOSITORY IMPLEMENTATION DEFINITION — BOUNDED

The Repository mechanism is CLOSED + PROVEN.

This section defines the minimum implementation boundary required before
Repository implementation authorization can be considered.

### 20.1 IMPLEMENTATION PURPOSE

The Repository implementation shall materialize the already-selected
Patient persistence access mechanism.

It shall provide the bounded persistence access required by the
authorized Patient persistence increment.

### 20.2 AUTHORIZED FUNCTIONAL RESPONSIBILITY TO BE DEFINED

The implementation definition shall cover only:

1. Persisting a Patient identity.
2. Retrieving an existing Patient by technical Patient persistence
   identity.
3. Preserving the stable persisted CPN.
4. Participating in the already-authorized Patient registration
   transaction.
5. Returning success or failure without exposing partial Patient
   persistence.

### 20.3 IMPLEMENTATION BOUNDARY

The intended implementation boundary is:

Application Service
        |
        v
Patient Repository
        |
        v
PostgreSQL persistence infrastructure

The Repository implementation shall remain below the Application Service
boundary and above the PostgreSQL infrastructure boundary.

The Application Service shall not execute SQL directly.

The Domain shall not depend on PostgreSQL or Repository implementation.

### 20.4 IMPLEMENTATION DEFINITION DOES NOT YET SELECT

This definition does NOT yet select:

- exact Repository class/file name;
- exact method names;
- exact SQL statements;
- exact SQL transaction API;
- exact PostgreSQL query structure;
- exact connection lifecycle;
- exact error mapping;
- exact test implementation;
- migration tooling;
- ORM;
- generic persistence framework.

Any such detail that remains undefined shall require explicit bounded
technical definition before implementation if it is necessary to proceed.

### 20.5 PRESERVED AUTHORITIES

The implementation must preserve:

PATIENT_TECHNICAL_IDENTITY = DISTINCT_FROM_CPN

CPN_AUTHORITY = POSTGRESQL

CPN_ALLOCATION_MECHANISM = POSTGRESQL_SEQUENCE

PATIENT_REGISTRATION_TRANSACTION =
BEGIN → allocate CPN → persist Patient → COMMIT

FAILURE =
ROLLBACK

NO_PARTIAL_PATIENT_REGISTRATION = REQUIRED

### 20.6 EXPLICIT NON-SCOPE

Repository implementation shall not introduce:

- new product capabilities;
- new actors;
- new authority;
- API redesign;
- UI behavior;
- authentication;
- authorization;
- ORM;
- generic repository framework;
- unrelated domain persistence;
- deletion/retention;
- merge;
- audit/event sourcing;
- caching;
- deployment changes.

### 20.7 CURRENT IMPLEMENTATION STATE

REPOSITORY_MECHANISM = SELECTED

REPOSITORY_IMPLEMENTATION_DEFINITION = BOUNDED

REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO

REPOSITORY_IMPLEMENTATION = NOT_PERFORMED

SQL_IMPLEMENTATION = NOT_PERFORMED

MIGRATION_IMPLEMENTATION = NOT_PERFORMED

ORM_IMPLEMENTATION = NOT_PERFORMED

NEXT_GATE = REPOSITORY IMPLEMENTATION DEFINITION REVIEW


## 21. REPOSITORY IMPLEMENTATION DEFINITION REVIEW — RECONCILIATION

### 21.1 REVIEW RESULT

The Repository implementation definition has been reconciled against:

- Persistence Technical Contract;
- Persistence Implementation Authorization Decision;
- PostgreSQL Persistence Implementation Authorization;
- API Implementation Structure Decision;
- Final Authority Map;
- the previously closed Repository mechanism decision.

### 21.2 AUTHORITY RESULT

PERSISTENCE_BOUNDARY = PRESERVED

APPLICATION_SERVICE_BOUNDARY = PRESERVED

DOMAIN_INDEPENDENCE = PRESERVED

POSTGRESQL_AUTHORITY = PRESERVED

CPN_AUTHORITY = PRESERVED

CPN_ALLOCATION_MECHANISM = PRESERVED

AUTHORIZED_TRANSACTION_BOUNDARY = PRESERVED

DEFERRED_DECISIONS = PRESERVED

### 21.3 SCOPE RESULT

NEW_PRODUCT_CAPABILITY = NO

NEW_ACTOR = NO

AUTHORITY_TRANSFER = NO

SCOPE_EXPANSION = NO

ORM_INTRODUCED = NO

GENERIC_PERSISTENCE_FRAMEWORK = NO

API_SCOPE_EXPANSION = NO

UI_SCOPE_EXPANSION = NO

AUTH_AUTHZ_SCOPE_EXPANSION = NO

### 21.4 IMPLEMENTATION STATE CLARIFICATION

The earlier shorthand statements using the form:

NO_SQL_IMPLEMENTATION = PERFORMED
NO_MIGRATION_IMPLEMENTATION = PERFORMED
NO_ORM_IMPLEMENTATION = PERFORMED
NO_REPOSITORY_IMPLEMENTATION = PERFORMED

mean that the corresponding "NO_*" condition was recorded as satisfied.

For unambiguous implementation-state semantics, the authoritative state
is explicitly:

SQL_IMPLEMENTATION = NOT_PERFORMED

MIGRATION_IMPLEMENTATION = NOT_PERFORMED

ORM_IMPLEMENTATION = NOT_PERFORMED

REPOSITORY_IMPLEMENTATION = NOT_PERFORMED

APPLICATION_INTEGRATION = NOT_PERFORMED

No implementation execution is established by this review.

### 21.5 REVIEW CONCLUSION

REPOSITORY_IMPLEMENTATION_DEFINITION_REVIEW = PASS

REPOSITORY_IMPLEMENTATION_DEFINITION = CLOSED + PROVEN

REPOSITORY_MECHANISM = SELECTED

REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO

REPOSITORY_IMPLEMENTATION = NOT_PERFORMED

SQL_IMPLEMENTATION = NOT_PERFORMED

MIGRATION_IMPLEMENTATION = NOT_PERFORMED

ORM_IMPLEMENTATION = NOT_PERFORMED

NEXT_GATE = REPOSITORY IMPLEMENTATION AUTHORIZATION REVIEW


## 22. REPOSITORY IMPLEMENTATION AUTHORIZATION — BOUNDED SCOPE DEFINITION

Repository implementation authorization, if granted, shall be limited to
the already-selected Repository mechanism and the already-authorized
Patient persistence increment.

### 22.1 PROPOSED AUTHORIZED IMPLEMENTATION

The proposed authorization boundary covers only:

1. Patient persistence access through the selected Repository mechanism.
2. Retrieval of an existing Patient by technical Patient persistence
   identity.
3. Patient persistence required by the already-authorized Patient
   registration increment.
4. Preservation of the stable CPN.
5. Integration with the authoritative PostgreSQL CPN allocation mechanism.
6. Participation in the already-authorized Patient registration
   transaction.
7. Failure propagation consistent with transaction rollback.
8. Bounded tests proving the Repository behavior.

### 22.2 REQUIRED TECHNICAL BEHAVIOR

The implementation shall preserve:

PATIENT_TECHNICAL_IDENTITY = DISTINCT_FROM_CPN

CPN_AUTHORITY = POSTGRESQL

CPN_ALLOCATION_MECHANISM = POSTGRESQL_SEQUENCE

PATIENT_REGISTRATION_TRANSACTION =
BEGIN → allocate CPN → persist Patient → COMMIT

FAILURE =
ROLLBACK

NO_PARTIAL_PATIENT_REGISTRATION = REQUIRED

### 22.3 EXPLICITLY NOT AUTHORIZED BY THIS PROPOSED BOUNDARY

The following remain outside the proposed Repository authorization:

- ORM implementation;
- generic repository framework;
- generic persistence framework;
- migration framework/tooling;
- unrelated domain repositories;
- unrelated domain persistence;
- API route implementation;
- API authentication;
- API authorization;
- UI implementation;
- deployment changes;
- Patient merge;
- deletion/retention;
- audit/event sourcing;
- caching;
- new domain rules;
- new product capabilities;
- new actors;
- authority transfer;
- resolution of unrelated deferred decisions.

### 22.4 SQL BOUNDARY

SQL required by the already-authorized PostgreSQL Patient persistence
increment may only be materialized within the established persistence
boundary.

The Application Service shall not execute SQL.

The Domain shall not execute SQL.

The Repository shall not redefine the PostgreSQL persistence authority.

### 22.5 AUTHORIZATION STATE

This section defines the proposed authorization boundary only.

It does NOT yet grant implementation authorization.

REPOSITORY_IMPLEMENTATION_AUTHORIZATION_PROPOSED = BOUNDED

REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO

REPOSITORY_IMPLEMENTATION = NOT_PERFORMED

SQL_IMPLEMENTATION = NOT_PERFORMED

MIGRATION_IMPLEMENTATION = NOT_PERFORMED

ORM_IMPLEMENTATION = NOT_PERFORMED

NEXT_GATE = REPOSITORY IMPLEMENTATION AUTHORIZATION REVIEW


## 23. REPOSITORY IMPLEMENTATION AUTHORIZATION DECISION — RECONCILIATION REQUIRED

### 23.1 CURRENT AUTHORITY STATE

The selected Repository mechanism and its bounded implementation definition are
closed and proven.

However, the existing persistence authorization artifacts still explicitly state:

REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO
SQL_IMPLEMENTATION_AUTHORIZED = NO

Therefore, the bounded Repository implementation proposal does not itself create
implementation authority.

No Repository implementation shall begin from this document until an explicit
authorization decision reconciles the existing persistence authority.

### 23.2 AUTHORIZATION REQUIREMENT

Any authorization for Repository implementation MUST explicitly establish:

- the exact bounded Repository implementation scope;
- whether the already-authorized PostgreSQL Patient persistence increment covers
  the technical persistence behavior required by the Repository;
- whether SQL required by the Repository is independently authorized or is
  included within the bounded persistence implementation authority;
- preservation of PostgreSQL as authoritative durable persistence;
- preservation of PostgreSQL CPN authority;
- preservation of PostgreSQL Sequence as the CPN allocation mechanism;
- preservation of Patient technical identity as distinct from CPN;
- preservation of the authorized Patient registration transaction boundary;
- no partial Patient registration;
- no ORM;
- no generic persistence framework;
- no unrelated repository implementation;
- no API scope expansion;
- no UI scope expansion;
- no authentication or authorization implementation;
- no Patient Merge;
- no deletion/retention implementation;
- no audit/event-sourcing implementation;
- no caching implementation;
- no new actor;
- no authority transfer;
- no new product capability;
- no silent resolution of deferred technical decisions.

### 23.3 IMPLEMENTATION STATE

REPOSITORY_IMPLEMENTATION_AUTHORIZATION_RECONCILIATION = REQUIRED
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION = NOT_PERFORMED
SQL_IMPLEMENTATION = NOT_PERFORMED
MIGRATION_IMPLEMENTATION = NOT_PERFORMED
ORM_IMPLEMENTATION = NOT_PERFORMED

### 23.4 NEXT GATE

NEXT_GATE = REPOSITORY IMPLEMENTATION AUTHORIZATION RECONCILIATION REVIEW


## 24. REPOSITORY IMPLEMENTATION AUTHORIZATION — RECONCILIATION DECISION

### 24.1 AUTHORITY FINDING

The review confirms that:

- GLOBAL_IMPLEMENTATION_AUTHORIZATION = YES
- POSTGRESQL_PERSISTENCE_IMPLEMENTATION_AUTHORIZED = YES
- DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = YES
- REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO
- SQL_IMPLEMENTATION_AUTHORIZED = NO
- MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
- ORM_IMPLEMENTATION_AUTHORIZED = NO

The existing PostgreSQL persistence authorization explicitly authorizes
the bounded first PostgreSQL persistence increment, including the Patient
persistence boundary, PostgreSQL CPN sequence, and bounded Patient
registration transaction.

However, the existing persistence authorization and final authority map
explicitly retain:

REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO

Therefore, the existing PostgreSQL persistence authorization shall not be
interpreted as implicit Repository implementation authorization.

### 24.2 RECONCILIATION RESULT

REPOSITORY_MECHANISM = SELECTED
REPOSITORY_IMPLEMENTATION_DEFINITION = CLOSED + PROVEN
POSTGRESQL_PERSISTENCE_AUTHORITY = PRESERVED
REPOSITORY_AUTHORITY = NOT YET GRANTED
SQL_AUTHORITY = NOT YET GRANTED

No implementation authority is created by this reconciliation statement.

### 24.3 REQUIRED AUTHORITY DECISION

A separate explicit bounded authorization decision is required before
Repository implementation begins.

That decision MUST state whether:

1. Repository implementation is authorized as a bounded materialization
   of the already-established PostgreSQL Patient persistence boundary; and

2. SQL required exclusively for that bounded Repository implementation is
   authorized within the same bounded decision or requires a separate
   authorization.

No assumption shall be made between these two authorization boundaries.

### 24.4 PRESERVED BOUNDARIES

The following remain unchanged:

PATIENT_TECHNICAL_IDENTITY = DISTINCT_FROM_CPN
CPN_AUTHORITY = POSTGRESQL
CPN_ALLOCATION_MECHANISM = POSTGRESQL_SEQUENCE
PATIENT_REGISTRATION_TRANSACTION = PRESERVED
NO_PARTIAL_PATIENT_REGISTRATION = REQUIRED

The following remain unauthorized:

REPOSITORY_IMPLEMENTATION = NO
SQL_IMPLEMENTATION = NO
MIGRATION_IMPLEMENTATION = NO
ORM_IMPLEMENTATION = NO
API_SCOPE_EXPANSION = NO
UI_SCOPE_EXPANSION = NO
AUTH_SCOPE_EXPANSION = NO
AUTHZ_SCOPE_EXPANSION = NO
NEW_PRODUCT_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
PATIENT_MERGE = NO
RETENTION_IMPLEMENTATION = NO
AUDIT_IMPLEMENTATION = NO
CACHE_IMPLEMENTATION = NO
GENERIC_PERSISTENCE_FRAMEWORK = NO

### 24.5 DECISION STATE

REPOSITORY_AUTHORIZATION_RECONCILIATION = CLOSED
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION = NOT_PERFORMED
SQL_IMPLEMENTATION = NOT_PERFORMED
MIGRATION_IMPLEMENTATION = NOT_PERFORMED
ORM_IMPLEMENTATION = NOT_PERFORMED

NEXT_GATE = EXPLICIT BOUNDED REPOSITORY IMPLEMENTATION AUTHORIZATION DECISION


## 25. EXPLICIT BOUNDED REPOSITORY IMPLEMENTATION AUTHORIZATION DECISION

### 25.1 DECISION BASIS

This decision is based on:

- the selected Repository persistence-access mechanism;
- the CLOSED + PROVEN Repository implementation definition;
- the CLOSED + PROVEN Repository authorization reconciliation;
- the established PostgreSQL persistence authority;
- the established Patient persistence boundary;
- the established PostgreSQL CPN authority and Sequence mechanism.

This decision creates only the bounded implementation authority explicitly
stated below.

### 25.2 AUTHORIZED IMPLEMENTATION SCOPE

The proposed bounded authorization covers ONLY:

1. Materialization of the selected Patient Repository boundary;
2. Patient persistence access required by the already-established Patient
   persistence increment;
3. Retrieval of an existing Patient by technical Patient identity;
4. Preservation of stable Clinic Patient Number;
5. Use of the established PostgreSQL persistence boundary;
6. Participation in the already-established Patient registration transaction;
7. Failure propagation required to preserve transactional integrity;
8. Bounded automated tests for the authorized Repository behavior.

### 25.3 SQL AUTHORIZATION BOUNDARY

SQL required exclusively to materialize the authorized Patient Repository
behavior is proposed as part of this bounded implementation decision.

Such SQL MUST:

- remain inside the established persistence boundary;
- serve only the authorized Patient Repository behavior;
- preserve PostgreSQL as authoritative durable persistence;
- preserve PostgreSQL CPN authority;
- preserve PostgreSQL Sequence allocation;
- introduce no unrelated schema or persistence capability.

No SQL outside this bounded Repository implementation is authorized.

### 25.4 EXPLICITLY NOT AUTHORIZED

This decision does NOT authorize:

- ORM implementation;
- migration framework adoption;
- generic persistence framework;
- generic repository framework;
- unrelated repositories;
- unrelated domain persistence;
- Patient Merge;
- deletion or retention;
- audit or event sourcing;
- caching;
- API scope expansion;
- UI scope expansion;
- authentication implementation;
- authorization implementation;
- deployment implementation;
- new actors;
- authority transfer;
- new product capability;
- resolution of unrelated deferred technical decisions.

### 25.5 AUTHORITY PRESERVATION

PATIENT_TECHNICAL_IDENTITY = DISTINCT_FROM_CPN
CPN_AUTHORITY = POSTGRESQL
CPN_ALLOCATION_MECHANISM = POSTGRESQL_SEQUENCE
PATIENT_REGISTRATION_TRANSACTION = PRESERVED
NO_PARTIAL_PATIENT_REGISTRATION = REQUIRED

### 25.6 CURRENT AUTHORIZATION STATE

REPOSITORY_IMPLEMENTATION_AUTHORIZATION_PROPOSED = BOUNDED
REPOSITORY_IMPLEMENTATION_AUTHORIZED = PENDING REVIEW
SQL_IMPLEMENTATION_AUTHORIZED = PENDING REVIEW
REPOSITORY_IMPLEMENTATION = NOT_PERFORMED
SQL_IMPLEMENTATION = NOT_PERFORMED
MIGRATION_IMPLEMENTATION = NOT_PERFORMED
ORM_IMPLEMENTATION = NOT_PERFORMED

### 25.7 DECISION GATE

NEXT_GATE = EXPLICIT BOUNDED REPOSITORY IMPLEMENTATION AUTHORIZATION REVIEW


## 26. EXPLICIT BOUNDED REPOSITORY IMPLEMENTATION AUTHORIZATION REVIEW

### 26.1 REVIEW RESULT

The bounded authorization proposal was reviewed against the
established Persistence Implementation Authorization,
PostgreSQL Persistence Implementation Authorization,
and Final Authority Map.

The proposed Repository implementation scope is bounded to
the already-established Patient persistence increment.

The proposal introduces:

- no new product capability;
- no new actor;
- no authority transfer;
- no unrelated persistence behavior;
- no ORM;
- no migration framework adoption;
- no generic persistence framework;
- no API/UI/auth/authz/deployment expansion;
- no resolution of unrelated deferred technical decisions.

Therefore:

REPOSITORY_AUTHORIZATION_SCOPE_REVIEW = PASS

### 26.2 AUTHORITY CONFLICT IDENTIFIED

The existing canonical authority documents currently state:

SQL_IMPLEMENTATION_AUTHORIZED = NO
MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
ORM_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO

The current Section 25 decision proposes bounded authorization for:

REPOSITORY_IMPLEMENTATION_AUTHORIZED = PENDING REVIEW
SQL_IMPLEMENTATION_AUTHORIZED = PENDING REVIEW

Therefore Section 25 MUST NOT be interpreted as implicit
authorization overriding the existing canonical authority.

### 26.3 IMPLEMENTATION STATUS

REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO
SQL_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION = NOT_PERFORMED
SQL_IMPLEMENTATION = NOT_PERFORMED
MIGRATION_IMPLEMENTATION = NOT_PERFORMED
ORM_IMPLEMENTATION = NOT_PERFORMED

### 26.4 RECONCILIATION REQUIREMENT

Before Repository implementation can begin, the bounded
authorization decision must be reconciled with the canonical
authority documents.

The reconciliation MUST explicitly establish:

1. whether Repository implementation authority is granted;
2. whether SQL required exclusively for the authorized Repository
   behavior is granted;
3. whether the existing PostgreSQL persistence authorization is
   extended only within this bounded Patient increment;
4. whether the Final Authority Map is updated consistently;
5. preservation of PostgreSQL CPN authority;
6. preservation of PostgreSQL Sequence allocation;
7. preservation of Patient technical identity distinct from CPN;
8. preservation of the existing Patient registration transaction;
9. preservation of all unrelated deferred decisions.

No implementation may begin before this reconciliation is closed.

### 26.5 REVIEW CLOSURE

EXPLICIT_BOUNDED_REPOSITORY_IMPLEMENTATION_AUTHORIZATION_REVIEW = PASS
AUTHORITY_RECONCILIATION = REQUIRED
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO
SQL_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION = NOT_PERFORMED
SQL_IMPLEMENTATION = NOT_PERFORMED
MIGRATION_IMPLEMENTATION = NOT_PERFORMED
ORM_IMPLEMENTATION = NOT_PERFORMED

NEXT_GATE = CANONICAL REPOSITORY + SQL AUTHORITY RECONCILIATION REVIEW


## 27. CANONICAL REPOSITORY + SQL AUTHORITY RECONCILIATION DECISION

### 27.1 RECONCILIATION BASIS

The reconciliation review confirms an explicit authority gap between
the bounded Repository authorization proposal and the existing
canonical Persistence Authority / Final Authority Map.

The existing canonical authority currently grants:

GLOBAL_IMPLEMENTATION_AUTHORIZATION = YES
DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = YES
POSTGRESQL_PERSISTENCE_IMPLEMENTATION_AUTHORIZED = YES

The existing canonical authority does NOT grant:

SQL_IMPLEMENTATION_AUTHORIZED = NO
MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
ORM_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO

Section 25 established a bounded Repository authorization proposal,
and Section 26 confirmed that proposal is bounded and valid for
reconciliation.

### 27.2 RECONCILED AUTHORIZATION

The following authorization is hereby proposed for explicit bounded
reconciliation:

REPOSITORY_IMPLEMENTATION_AUTHORIZED = YES

SQL_IMPLEMENTATION_AUTHORIZED = YES

The SQL authorization is limited exclusively to SQL required to
materialize the authorized Patient Repository behavior.

This authorization does NOT constitute general SQL authorization.

### 27.3 BOUNDED REPOSITORY AUTHORITY

The authorized Repository implementation is limited to:

1. Patient persistence access required by the established Patient
   persistence increment;
2. Retrieval of an existing Patient by technical Patient identity;
3. Preservation of stable Clinic Patient Number;
4. Participation in the established Patient registration transaction;
5. Failure propagation required for transactional integrity;
6. Bounded automated tests.

No unrelated Repository behavior is authorized.

### 27.4 BOUNDED SQL AUTHORITY

SQL authorization is limited exclusively to the SQL necessary for the
authorized Patient Repository behavior.

SQL MUST:

- remain inside the persistence boundary;
- operate only on the authorized Patient persistence behavior;
- preserve PostgreSQL as authoritative durable persistence;
- preserve PostgreSQL CPN authority;
- preserve PostgreSQL Sequence allocation;
- preserve transactional integrity;
- introduce no unrelated persistence capability.

### 27.5 EXPLICITLY REMAINING UNAUTHORIZED

The reconciliation does NOT authorize:

MIGRATION_IMPLEMENTATION = NO
ORM_IMPLEMENTATION = NO
GENERIC_PERSISTENCE_FRAMEWORK = NO
GENERIC_REPOSITORY_FRAMEWORK = NO
UNRELATED_REPOSITORIES = NO
UNRELATED_DOMAIN_PERSISTENCE = NO
PATIENT_MERGE = NO
DELETE_OR_RETENTION = NO
AUDIT_OR_EVENT_SOURCING = NO
CACHING = NO
API_SCOPE_EXPANSION = NO
UI_SCOPE_EXPANSION = NO
AUTHENTICATION_IMPLEMENTATION = NO
AUTHORIZATION_IMPLEMENTATION = NO
DEPLOYMENT_IMPLEMENTATION = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
NEW_PRODUCT_CAPABILITY = NO
UNRELATED_DEFERRED_DECISIONS = NO

### 27.6 AUTHORITY PRESERVATION

PATIENT_TECHNICAL_IDENTITY = DISTINCT_FROM_CPN
CPN_AUTHORITY = POSTGRESQL
CPN_ALLOCATION_MECHANISM = POSTGRESQL_SEQUENCE
PATIENT_REGISTRATION_TRANSACTION = PRESERVED
NO_PARTIAL_PATIENT_REGISTRATION = REQUIRED

### 27.7 IMPLEMENTATION STATUS

REPOSITORY_IMPLEMENTATION_AUTHORIZED = YES
SQL_IMPLEMENTATION_AUTHORIZED = YES

REPOSITORY_IMPLEMENTATION = NOT_PERFORMED
SQL_IMPLEMENTATION = NOT_PERFORMED
MIGRATION_IMPLEMENTATION = NOT_PERFORMED
ORM_IMPLEMENTATION = NOT_PERFORMED

### 27.8 CANONICAL RECONCILIATION REQUIREMENT

The reconciled authorization MUST be reflected consistently in the
canonical authority record before implementation begins.

The Final Authority Map and the applicable Persistence Authorization
record MUST NOT remain contradictory with this bounded authorization.

No implementation may begin until canonical authority synchronization
is closed and proven.

### 27.9 DECISION GATE

CANONICAL_REPOSITORY_SQL_AUTHORIZATION_RECONCILIATION = PROPOSED
REPOSITORY_IMPLEMENTATION_AUTHORIZED = YES
SQL_IMPLEMENTATION_AUTHORIZED = YES
IMPLEMENTATION = NOT_PERFORMED

NEXT_GATE = CANONICAL AUTHORITY SYNCHRONIZATION REVIEW


## 28. CANONICAL AUTHORITY SYNCHRONIZATION REVIEW

### 28.1 REVIEW RESULT

The proposed bounded Repository + SQL authorization was reviewed
against:

- PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-DECISION-V1.md
- FINAL-AUTHORITY-MAP-V1.md
- POSTGRESQL-PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-V1.md
- the closed and proven Repository implementation definition;
- the closed and proven Repository authorization reconciliation.

The review confirms that the proposed authorization is bounded and
consistent in scope with the established Patient persistence increment.

CANONICAL_AUTHORITY_SCOPE_REVIEW = PASS

### 28.2 EXISTING CANONICAL CONFLICT

The review also confirms that the existing canonical authority records
still explicitly state:

SQL_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO

Therefore the proposed Section 27 authorization has NOT yet become
canonical authority.

### 28.3 REQUIRED SYNCHRONIZATION

The following canonical records require explicit synchronization with
the closed bounded authorization decision:

1. PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-DECISION-V1.md
2. FINAL-AUTHORITY-MAP-V1.md

The synchronization MUST:

- grant only the bounded Patient Repository implementation authority;
- grant only SQL required exclusively for that Repository behavior;
- preserve PostgreSQL as authoritative persistence;
- preserve PostgreSQL CPN authority;
- preserve PostgreSQL Sequence allocation;
- preserve Patient technical identity distinct from CPN;
- preserve the established Patient registration transaction;
- preserve all existing NO authorities outside this bounded increment;
- introduce no migration authority;
- introduce no ORM authority;
- introduce no generic persistence framework authority;
- introduce no unrelated Repository authority;
- introduce no new actor;
- introduce no authority transfer;
- introduce no new product capability;
- resolve no unrelated deferred technical decision.

### 28.4 IMPLEMENTATION SAFETY

Until canonical synchronization is closed and proven:

REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO
SQL_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION = NOT_PERFORMED
SQL_IMPLEMENTATION = NOT_PERFORMED

### 28.5 REVIEW CLOSURE

CANONICAL_AUTHORITY_SYNCHRONIZATION_REVIEW = PASS
CANONICAL_AUTHORITY_SYNCHRONIZATION = REQUIRED
NEXT_GATE = CANONICAL AUTHORITY SYNCHRONIZATION EXECUTION REVIEW

## 28.6 CANONICAL AUTHORITY SYNCHRONIZATION EXECUTION REVIEW — CLOSURE

REVIEW_SCOPE = CANONICAL AUTHORITY RECORD SYNCHRONIZATION ONLY

CANONICAL_FINAL_AUTHORITY_MAP = CLOSED + PROVEN
CANONICAL_PERSISTENCE_AUTHORIZATION = CLOSED + PROVEN

REPOSITORY_IMPLEMENTATION_AUTHORIZED = YES
SQL_IMPLEMENTATION_AUTHORIZED = YES

SQL_AUTHORIZATION_SCOPE = PATIENT_REPOSITORY_BEHAVIOR_ONLY
MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
ORM_IMPLEMENTATION_AUTHORIZED = NO

REPOSITORY_IMPLEMENTATION = NOT_PERFORMED
SQL_IMPLEMENTATION = NOT_PERFORMED
MIGRATION_IMPLEMENTATION = NOT_PERFORMED
ORM_IMPLEMENTATION = NOT_PERFORMED

NO_NEW_ACTOR = YES
AUTHORITY_TRANSFER = NO
NEW_PRODUCT_CAPABILITY = NO
UNRELATED_DEFERRED_DECISION_RESOLUTION = NO

PATIENT_TECHNICAL_IDENTITY = DISTINCT_FROM_CPN
CPN_AUTHORITY = POSTGRESQL
CPN_ALLOCATION_MECHANISM = POSTGRESQL_SEQUENCE
PATIENT_REGISTRATION_TRANSACTION = PRESERVED
NO_PARTIAL_PATIENT_REGISTRATION = REQUIRED

CANONICAL_AUTHORITY_SYNCHRONIZATION_EXECUTION_REVIEW = PASS
CANONICAL_AUTHORITY_SYNCHRONIZATION = CLOSED + PROVEN

NEXT_GATE = PATIENT REPOSITORY + SQL PRE-EXECUTION SAFETY PROBE

FAIL = 0

## 28.7 PATIENT REPOSITORY + FIRST REAL SQL IMPLEMENTATION CLOSURE

REVIEW_SCOPE = AUTHORIZED PATIENT REPOSITORY IMPLEMENTATION + FIRST REAL SQL PERSISTENCE PROOF ONLY

AUTHORIZED_REPOSITORY_IMPLEMENTATION = EXECUTED
AUTHORIZED_SQL_IMPLEMENTATION = EXECUTED

SQL_AUTHORIZATION_SCOPE = PATIENT_REPOSITORY_BEHAVIOR_ONLY
MIGRATION_IMPLEMENTATION = NOT_PERFORMED
ORM_IMPLEMENTATION = NOT_PERFORMED
GENERIC_PERSISTENCE_FRAMEWORK = NOT_INTRODUCED

FIRST_REAL_SQL_PATIENT_REGISTRATION = PROVEN
FIRST_REAL_SQL_CPN = CPN-16

REAL_SQL_PERSISTENCE = PASS
CPN-16_PERSISTED = PASS
CPN_SEQUENCE_AT_16 = PASS
PREVIOUS_PROOF_ROWS_PRESERVED = PASS

PATIENT_TECHNICAL_IDENTITY = DISTINCT_FROM_CPN
CPN_AUTHORITY = POSTGRESQL
CPN_ALLOCATION_MECHANISM = POSTGRESQL_SEQUENCE
PATIENT_REGISTRATION_TRANSACTION = PRESERVED
NO_PARTIAL_PATIENT_REGISTRATION = REQUIRED

REGISTER_NEW_PATIENT_TRANSACTION_SUCCESS_TEST = PASS
REGISTER_NEW_PATIENT_TRANSACTION_ROLLBACK_TEST = PASS
PATIENT_REPOSITORY_TESTS = 4/4 PASS
FULL_PATIENT_REGRESSION = 6/6 PASS

REAL_SQL_FINAL_PROOF_ADDITIONAL_WRITE = NONE
EXISTING_DATA_MUTATION_DURING_FINAL_PROOF = NONE

CONTRACT_MUTATION = NO
NEW_PRODUCT_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
UNAUTHORIZED_SCOPE_EXPANSION = NO
UNRELATED_DEFERRED_DECISION_RESOLUTION = NO

FAIL = 0

PATIENT_REPOSITORY_IMPLEMENTATION = PROVEN
SQL_IMPLEMENTATION = PROVEN
PATIENT_REPOSITORY_FIRST_REAL_SQL_INCREMENT = CLOSED + PROVEN

NEXT_GATE = NEXT AUTHORIZED PERSISTENCE IMPLEMENTATION GATE
