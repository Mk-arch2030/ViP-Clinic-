# DR. ROBY CLINIC — AUTHENTICATION ACTOR IDENTITY REPRESENTATION DECISION V1

STATUS = CLOSED + PROVEN
IMPLEMENTATION_AUTHORIZED = NO

## 1. PURPOSE

Closes the open Authentication Identity Representation decision
without selecting a UUID or numeric persistence key.

## 2. ACTOR IDENTITY

The product Actor is represented by a stable Actor Identity Reference.

Approved Product Actor roles remain:

- Doctor
- Nurse

The Actor Identity Reference identifies the approved Actor independently
of the Actor Role / Authority Context.

## 3. IDENTITY REFERENCE

The Stable Actor Identity Reference is the identity reference used to
associate an authenticated identity with its approved Actor.

The Stable Actor Identity Reference remains stable across authenticated
requests.

The identity reference is not defined as:

- Clinic Patient Number
- Visit identifier
- Clinic Day Working Date
- Username
- Password
- Session token

## 4. PERSISTENCE BOUNDARY

The Actor Identity Reference is logically distinct from a
Persistence Technical Key.

The Persistence Technical Key remains persistence-only if required.

No UUID or numeric technical identifier is selected by this decision.

The existing deferred decision remains unchanged:

UUID vs numeric technical identifiers = DEFERRED.

## 5. AUTHENTICATION ASSOCIATION

Authentication MUST associate the authenticated identity with the
approved Actor through the Stable Actor Identity Reference.

Authentication state remains distinct from:

- Actor Identity
- Actor Role
- Authority Context
- Delegated Permission Scope
- Case State
- Visit State
- Clinic Day State

## 6. ACTOR ROLES

Approved Product Actor roles:

- Doctor
- Nurse

Doctor remains:

- Main Admin
- Clinical Authority
- System Owner
- Initial Actor

Nurse remains:

- Operational Workflow Participant
- Doctor-created Actor
- Delegated operational participant

## 7. IDENTITY PROTECTION

The Stable Actor Identity Reference MUST NOT be used to transfer:

- Clinical Authority
- Main Admin authority
- System Ownership
- Case Completion authority
- Clinic Day Closure authority

Identity identifies the Actor.
Authorization determines what that Actor may do.

## 8. IMPLEMENTATION BOUNDARY

This decision does not authorize:

- authentication implementation
- password implementation
- session implementation
- database implementation
- API implementation
- UI implementation
- middleware implementation
- deployment implementation

## 9. CROSS-CONTRACT INVARIANTS

ACTOR_MODEL = ONE_INDEPENDENT_ACTOR_CONCEPT
APPROVED_ROLES = DOCTOR + NURSE
DOCTOR_IS_INITIAL_ACTOR = YES
DOCTOR_AUTHORITY = PRESERVED
NURSE_DELEGATION = PRESERVED
AUTHORITY_TRANSFER = NO
PERSISTENCE_KEY_SELECTION = DEFERRED
UUID_VS_NUMERIC = DEFERRED
IDENTITY_REFERENCE = STABLE_ACTOR_IDENTITY_REFERENCE

## 10. CLOSURE

IDENTITY_REPRESENTATION = STABLE_ACTOR_IDENTITY_REFERENCE
IDENTITY_REFERENCE_STABLE_ACROSS_AUTHENTICATED_REQUESTS = YES
ACTOR_IDENTITY_DISTINCT_FROM_PERSISTENCE_KEY = YES
UUID_SELECTION = DEFERRED
NUMERIC_SELECTION = DEFERRED
IMPLEMENTATION = NOT AUTHORIZED

DECISION_STATUS = CLOSED + PROVEN
