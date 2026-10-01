# Dr.Roby Clinic — CPN Generation Technical Design V1

DOCUMENT = CPN GENERATION TECHNICAL DESIGN
VERSION = V1
STATUS = DESIGN DRAFT
PRODUCT = Dr.Roby Clinic
CAPABILITY = GENERATE CLINIC PATIENT NUMBER

## 1. AUTHORITY

This technical design is governed by the closed and proven:

- CPN FORMAT FACTORY DECISION V1
- CPN STARTING VALUE FACTORY DECISION V1
- CPN GENERATION MECHANISM DECISION V1
- CPN GENERATION MECHANISM DECISION CLOSURE PROOF V1
- CPN GENERATION IMPLEMENTATION AUTHORIZATION DECISION V1
- CPN GENERATION IMPLEMENTATION DEFINITION V1
- CPN GENERATION IMPLEMENTATION DEFINITION CLOSURE PROOF V1
- PERSISTENCE TECHNICAL CONTRACT V1
- PERSISTENCE SCHEMA DEFINITION V1

This document does not mutate any Product, Domain, Persistence, or Application Capability contract.

## 2. TECHNICAL OBJECTIVE

Provide the minimum technical design required to implement authoritative Clinic Patient Number allocation.

The resulting CPN shall:

- be generated at first Patient registration;
- use the approved `CPN-` prefix;
- use a sequential numeric value;
- begin at numeric value `1`;
- remain stable for the Patient;
- be unique among active Patient identities;
- be allocated through an authoritative persistence boundary;
- remain safe under concurrent first registrations;
- remain separate from the technical Patient persistence identifier.

## 3. IDENTITY MODEL

The Patient has two distinct persistence concepts:

1. Technical Patient Persistence Identity
2. Clinic Patient Number (CPN)

The technical Patient Persistence Identity is persistence-only.

The CPN is the stable product-level clinic reference.

The CPN MUST NOT replace the technical Patient persistence identity.

The CPN MUST NOT become:

- a Visit identifier;
- a Case identifier;
- a Clinic Day identifier.

## 4. GENERATION AUTHORITY

CPN allocation shall be persistence-authoritative.

Application memory shall not be the authority for:

- uniqueness;
- next-value allocation;
- concurrency control;
- durable CPN state.

A process-local counter is therefore not part of the design.

The authoritative persistence mechanism shall own allocation of the next numeric CPN value.

## 5. ALLOCATION SEMANTICS

The authoritative allocator shall provide one new numeric allocation for each newly established Patient identity requiring a CPN.

The first successful allocation shall produce:

`CPN-1`

Subsequent successful allocations shall produce sequential numeric values:

`CPN-2`
`CPN-3`
`CPN-4`

The allocator shall not regenerate a CPN for an existing Patient.

A later Visit, Case, or Clinic Day operation shall not allocate a new CPN.

## 6. CONCURRENCY REQUIREMENT

Concurrent first Patient registrations MUST NOT receive the same allocated numeric value.

The authoritative persistence mechanism shall provide the allocation boundary required to prevent duplicate allocation.

The application shall consume the authoritative allocation rather than independently calculating the next value.

No application-memory synchronization mechanism is sufficient as the authoritative uniqueness mechanism.

## 7. TRANSACTION BOUNDARY

CPN establishment and Patient identity creation must not partially succeed.

The implementation shall preserve the Persistence Technical Contract requirement that:

- Patient identity creation and CPN establishment are atomic where required;
- a Patient must not be left with a partially established identity/CPN relationship;
- a CPN must not be silently regenerated after Patient identity establishment.

The exact transaction syntax and runtime transaction API remain implementation details.

## 8. PERSISTENCE OBJECT BOUNDARY

The implementation requires a persistence-authoritative allocation mechanism.

The exact physical object is intentionally selected at this technical-design gate only to the extent necessary for bounded implementation.

The implementation shall use a dedicated authoritative allocation mechanism rather than an application-memory counter.

No unrelated persistence concept shall be introduced.

No new Product entity is introduced by the CPN allocator.

## 9. NUMERIC REPRESENTATION

The allocated CPN suffix is a numeric sequential value.

The starting numeric value is:

`1`

The physical numeric datatype shall be selected as part of the bounded implementation mapping and MUST be capable of representing the intended sequential range without changing the Product-facing CPN format.

The Product-facing CPN remains textual in its assembled form:

`CPN-` + numeric value

No alternate prefix or format is introduced.

## 10. PERSISTENCE UNIQUENESS

The persistence implementation shall reliably enforce or preserve:

- uniqueness of the technical Patient identity;
- uniqueness of active CPN values;
- one stable CPN per Patient;
- no duplicate CPN allocation under concurrent first registration.

The technical uniqueness mechanism shall remain bounded to the CPN capability.

## 11. APPLICATION INTEGRATION BOUNDARY

The application capability `REGISTER NEW PATIENT` shall consume the authoritative CPN allocation.

The integration shall occur before the Patient domain object is established with its required CPN value.

The existing Patient domain model remains authoritative for Patient construction.

The CPN allocator shall not redesign the Patient domain.

The CPN allocator shall not create:

- Case;
- Visit;
- Clinic Day;
- Actor;
- new Product capability.

## 12. FAILURE / RETRY PRINCIPLE

The implementation shall not allow a failed first-registration attempt to silently create a second Patient identity or attach an incorrect CPN.

Retry behavior must preserve Patient identity and CPN uniqueness.

Exact retry/idempotency mechanics remain bounded implementation concerns and MUST NOT introduce a new Product decision.

## 13. MIGRATION BOUNDARY

Any persistence object required exclusively for authoritative CPN allocation shall be introduced through the minimum authorized persistence implementation.

Migration execution is not performed by this design document.

No unrelated schema migration is authorized.

## 14. EXPLICIT NON-SCOPE

This technical design does not authorize or implement:

- unrelated Patient persistence;
- Case persistence;
- Visit persistence;
- Clinic Day persistence;
- Follow-up persistence;
- Clinical Content persistence;
- API implementation;
- UI implementation;
- authentication;
- authorization;
- deployment;
- unrelated repositories;
- unrelated migrations;
- Patient Merge;
- Audit Log;
- Event Sourcing;
- generic State History;
- caching;
- multi-branch identity;
- multi-tenant identity.

## 15. REQUIRED IMPLEMENTATION PROOF

The implementation must prove:

- `CPN-` prefix;
- first allocation = `CPN-1`;
- sequential allocation;
- uniqueness;
- concurrent allocation safety;
- stable CPN after Patient registration;
- no CPN regeneration for later Visits;
- separation from technical Patient identity;
- no cross-use as Visit/Case/Clinic Day identity;
- atomic Patient identity/CPN establishment where required;
- no contract mutation;
- no new Product capability;
- no new Actor;
- no authority transfer;
- no unauthorized scope expansion.

## 16. GOVERNANCE

CONTRACT_MUTATION = NO
NEW_PRODUCT_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
UNAUTHORIZED_SCOPE_EXPANSION = NO

## 17. IMPLEMENTATION STATUS

TECHNICAL_DESIGN = DRAFT
IMPLEMENTATION_EXECUTED = NO
IMPLEMENTATION_PROVEN = NO
FAIL = 0

NEXT GATE = CPN GENERATION TECHNICAL DESIGN REVIEW
