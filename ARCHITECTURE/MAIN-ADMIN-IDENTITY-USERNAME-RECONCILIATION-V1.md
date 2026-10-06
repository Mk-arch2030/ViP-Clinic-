# MAIN ADMIN IDENTITY + USERNAME RECONCILIATION V1

STATUS = CLOSED + PROVEN
RECONCILIATION_EVIDENCE = FIRST-REAL-MAIN-ADMIN-ACTOR-LIVE-PROOF-V1
RECONCILIATION_COMMIT = b1a064c

MAIN_ADMIN = Dr_Roby
MAIN_ADMIN_ROLE = DOCTOR
MAIN_ADMIN_AUTHORITY = MAIN_ADMIN + CLINICAL_AUTHORITY + SYSTEM_OWNER

USERNAME = DR/MK_ROBY
USERNAME_PURPOSE = AUTHENTICATION_LOGIN_IDENTIFIER

USERNAME_IS_ACTOR_IDENTITY = NO
USERNAME_IS_PERSISTENCE_KEY = NO
USERNAME_IS_AUTHORITY = NO

ACTOR_IDENTITY = STABLE_ACTOR_IDENTITY_REFERENCE

PERSISTENCE_KEY = actor_id
PERSISTENCE_KEY_TYPE = PostgreSQL UUID
PERSISTENCE_KEY_GENERATION = PostgreSQL 18 native uuidv7()

ACTOR_IDENTITY_DISTINCT_FROM_PERSISTENCE_KEY = YES
ACTOR_IDENTITY_DISTINCT_FROM_USERNAME = YES
USERNAME_DISTINCT_FROM_PERSISTENCE_KEY = YES
USERNAME_DISTINCT_FROM_AUTHORITY = YES

DOCTOR_IS_INITIAL_ACTOR = YES
MAIN_ADMIN_REMAINS_DOCTOR = YES
CLINICAL_AUTHORITY_REMAINS_DOCTOR = YES
SYSTEM_OWNERSHIP_REMAINS_DOCTOR = YES

AUTHORITY_TRANSFER = NO
FIRST_REAL_MAIN_ADMIN_ACTOR = ALREADY_CLOSED_AND_PROVEN
AUTHORITY_REDEFINITION = NO
ACTOR_MODEL_CHANGE = NO
ACTOR_PERSISTENCE_SCHEMA_CHANGE = NO

AUTHENTICATION_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_ARTIFACT
LOGIN_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_ARTIFACT
CREDENTIAL_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_ARTIFACT
SESSION_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_ARTIFACT
AUTHORIZATION_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_ARTIFACT

ACTOR_SQL_EXECUTION = NOT_PERFORMED
ACTOR_DATA_WRITTEN = NOT_PERFORMED
PATIENT_DATA_MODIFICATION = NOT_AUTHORIZED

DATA_PRESERVATION = PROTECTED
ROLLBACK_SAFETY = PROTECTED
SCOPE_EXPANSION = NOT_AUTHORIZED

DECISION = MAIN_ADMIN_AND_USERNAME_RECONCILED
FAIL = 0

## 1. PURPOSE

This artifact formally reconciles the product-level Main Admin identity
and the authentication login username without changing the established
Actor authority model or the Actor persistence structure.

## 2. MAIN ADMIN

The Main Admin remains the Doctor Actor:

Dr_Roby

Dr_Roby is the product identity representing:

- Main Admin
- Doctor
- Clinical Authority
- System Owner

The Doctor remains the Initial Actor.

## 3. USERNAME

The authentication login identifier selected for the Main Admin is:

DR/MK_ROBY

This value is a username/login identifier only.

It is not:

- the Actor Identity;
- the Actor persistence key;
- an authority identifier;
- a role;
- a password;
- a session token.

## 4. IDENTITY SEPARATION

The established identity separation is preserved:

Product Actor Identity
    =
STABLE_ACTOR_IDENTITY_REFERENCE

Authentication Username
    =
DR/MK_ROBY

Persistence Technical Key
    =
actor_id

Persistence Type
    =
PostgreSQL UUID

Persistence Generation
    =
PostgreSQL 18 native uuidv7()

These concepts MUST NOT be collapsed into one identifier.

## 5. ACTOR AUTHORITY

The username selection does not create, transfer, reduce, or redefine
authority.

The authority chain remains:

Dr_Roby
    ->
Main Admin
    ->
Doctor
    ->
Clinical Authority
    ->
System Owner

Nurse authority remains delegated operational authority under the
established Doctor authority model.

## 6. PERSISTENCE BOUNDARY

The existing Actor persistence structure remains authoritative.

No change is authorized to:

- public.actors
- actor_id
- actor_id UUID type
- uuidv7() generation
- actor_role
- lifecycle_state

The selection of DR/MK_ROBY MUST NOT cause any Actor schema mutation.

## 7. AUTHENTICATION BOUNDARY

This artifact identifies the future login username only.

It does NOT authorize:

- login implementation;
- credential storage;
- password hashing;
- session creation;
- session persistence;
- authentication routes;
- authentication middleware;
- UI login implementation.

Those require their own explicit implementation authority and live proof.

## 8. AUTHORIZATION BOUNDARY

Authentication of DR/MK_ROBY MUST NOT itself create or transfer
Main Admin authority.

Authenticated identity must resolve to the already-established Doctor
Actor authority model.

Authorization remains a separate concern governed by the existing
authorization contracts.

## 9. DATA PRESERVATION

This reconciliation introduces no data mutation.

No Actor data is written.

No Patient data is modified.

No persistence object is altered.

The established PostgreSQL Actor persistence closure remains preserved.

## 10. FINAL DECISION

MAIN_ADMIN = Dr_Roby

MAIN_ADMIN_ROLE = DOCTOR

MAIN_ADMIN_AUTHORITY = MAIN_ADMIN + CLINICAL_AUTHORITY + SYSTEM_OWNER

USERNAME = DR/MK_ROBY

USERNAME_PURPOSE = AUTHENTICATION_LOGIN_IDENTIFIER

USERNAME_IS_ACTOR_IDENTITY = NO

USERNAME_IS_PERSISTENCE_KEY = NO

USERNAME_IS_AUTHORITY = NO

ACTOR_IDENTITY = STABLE_ACTOR_IDENTITY_REFERENCE

PERSISTENCE_KEY = actor_id

PERSISTENCE_KEY_TYPE = PostgreSQL UUID

PERSISTENCE_KEY_GENERATION = PostgreSQL 18 native uuidv7()

AUTHORITY_TRANSFER = NO
FIRST_REAL_MAIN_ADMIN_ACTOR = ALREADY_CLOSED_AND_PROVEN

ACTOR_PERSISTENCE_SCHEMA_CHANGE = NO

AUTHENTICATION_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_ARTIFACT

LOGIN_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_ARTIFACT

FAIL = 0
