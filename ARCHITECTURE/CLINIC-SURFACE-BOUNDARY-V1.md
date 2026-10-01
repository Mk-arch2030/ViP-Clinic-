# DR. ROBY CLINIC — CLINIC SURFACE BOUNDARY V1

STATUS: CLOSED / PROVEN
AUTHORIZATION_EFFECT: NONE
IMPLEMENTATION_EFFECT: NONE

## 1. PURPOSE

Define the authoritative boundary of the Clinic Surface before any
Surface implementation is NOT authorized by this document.

## 2. SURFACE RESPONSIBILITY

The Clinic Surface may:

- present authorized clinic information to the user;
- collect user interaction/input within authorized workflows;
- request authorized operations through the API/application boundary;
- represent Doctor and Nurse workflows according to existing authority;
- preserve distinctions already established by the domain and contracts.

## 3. SURFACE NON-RESPONSIBILITY

The Clinic Surface MUST NOT:

- own clinical decisions;
- establish Case Completion;
- transfer clinical authority;
- redefine Doctor or Nurse authority;
- own domain state;
- access persistence directly;
- contain SQL or direct database access;
- bypass the API/application boundary;
- redefine Patient, Case, Visit, or Clinic Day relationships;
- reinterpret Clinic Day Closure as Case Completion;
- overwrite historical clinical meaning;
- introduce new product capabilities.

## 4. API BOUNDARY

Surface communication with internal application behavior occurs through
the authorized API boundary.

The Surface MUST NOT communicate directly with persistence.

No new API operation is implied by this boundary definition.

Any new API operation requires separate definition, reconciliation,
and authorization.

## 5. AUTHORITY ALIGNMENT

The Surface reflects existing authority; it does not create authority.

Doctor remains the clinical and system authority.

Nurse remains a delegated operational participant.

Delegation MUST NOT be represented by the Surface as authority transfer.

## 6. WORKFLOW ALIGNMENT

The Surface MUST preserve the established distinctions:

- Visit Exit != Case Completion
- Clinic Day Closure != Case Completion
- Case may continue across multiple Clinic Days
- Previous Visits remain historically meaningful
- Past History != Clinical History

## 7. PERSISTENCE BOUNDARY

No direct Surface-to-database access is permitted.

Persistence remains behind the established application/API boundary.

The Surface does not define physical storage, persistence mechanics,
audit infrastructure, locking, event sourcing, or state-history mechanisms.

## 8. AUTHORIZATION REQUIREMENT

This document defines a boundary only.

It does NOT authorize:

- UI implementation;
- new API implementation;
- persistence implementation;
- authentication implementation;
- authorization implementation;
- deployment;
- new product capabilities.

Any implementation increment must receive its own bounded
authorization before execution.

## 9. RECONCILIATION REQUIREMENT

Before Surface implementation authorization, this boundary MUST be
reconciled against the authoritative:

- Product Manuscript;
- Domain Specification;
- Domain Contracts;
- Workflow Contracts;
- API Technical Contract;
- Application Capability Contract;
- Authorization Technical Contract;
- Persistence Technical Contract;
- Final Authority Map.

## 10. BOUNDARY PRINCIPLE

The Surface is an expression layer over authorized application
capabilities.

It is not a source of domain authority.

It is not a source of persistence authority.

It is not a source of new product scope.

---

BOUNDARY_EFFECT = DEFINITION_ONLY
AUTHORIZATION_EFFECT = NONE
CONTRACT_MUTATION = NONE
IMPLEMENTATION_AUTHORIZED = NO
SCOPE_EXPANSION = NO
