# PostgreSQL Actor Physical Data Types Decision V1

STATUS = OPEN TECHNICAL DECISION
IMPLEMENTATION_AUTHORIZED = NO
SQL_IMPLEMENTATION_AUTHORIZED = NO

## 1. PURPOSE

This decision establishes the bounded technical decision boundary for
the physical PostgreSQL representation of the Product Actor persistence
identity.

This decision exists because the Product Actor architecture and the
Stable Actor Identity Reference are already closed, while the physical
persistence key representation remains explicitly deferred.

## 2. AUTHORITY BASIS

- PDR-I06 — Actor Persistence
- ACTOR-DOMAIN-REPRESENTATION
- ACTOR-DOMAIN-IMPLEMENTATION-CLOSURE
- ACTOR-DOMAIN-IMPLEMENTATION-RECONCILIATION
- AUTHENTICATION-ACTOR-IDENTITY-REPRESENTATION-DECISION-V1
- AUTHENTICATION-TECHNICAL-CONTRACT-COMPLETION-DECISION-V1
- PERSISTENCE-TECHNICAL-CONTRACT-V1
- PERSISTENCE-SCHEMA-DEFINITION-V1

## 3. CURRENT ESTABLISHED ACTOR MODEL

ACTOR_MODEL = ONE_INDEPENDENT_ACTOR_CONCEPT
APPROVED_ROLES = DOCTOR + NURSE
DOCTOR_IS_INITIAL_ACTOR = YES
IDENTITY_REFERENCE = STABLE_ACTOR_IDENTITY_REFERENCE
ACTOR_IDENTITY_DISTINCT_FROM_PERSISTENCE_KEY = YES

## 4. IMPLEMENTATION BOUNDARY

No PostgreSQL object is created by this decision.

No Actor table is created by this decision.

No sequence is created by this decision.

No migration is created by this decision.

No repository is created or modified by this decision.

No authentication implementation is created by this decision.

No authorization implementation is created by this decision.

No Main Admin record is created by this decision.

## 5. OPEN TECHNICAL QUESTION

The remaining decision is limited to the physical persistence
representation of the Actor persistence key.

Candidate families to be evaluated:

- UUID-based persistence key
- Numeric-based persistence key

The final selection must be established by explicit technical
reconciliation and must not be inferred from the Patient persistence
implementation.


## 6. ENGINEERING COMPARISON — UUID VS NUMERIC

### 6.1 UUID-BASED PERSISTENCE KEY

Potential advantages:

- Provides a globally distinct technical identifier without requiring
  sequential allocation.
- Is well suited to an Actor identity whose technical identifier must
  remain independent from human-facing or role-facing identifiers.
- Reduces dependence on externally visible numeric sequencing.
- Aligns naturally with distributed generation if the persistence
  boundary later requires identifiers to be generated outside a single
  database sequence.
- Provides a strong separation between technical identity and
  operational role or authority context.

Potential costs:

- Larger physical representation than a small integer key.
- Less naturally human-readable during direct database inspection.
- Requires an explicit PostgreSQL UUID generation strategy.
- Does not by itself provide any additional authentication or
  authorization authority.

### 6.2 NUMERIC-BASED PERSISTENCE KEY

Potential advantages:

- Compact and straightforward relational representation.
- Simple ordering and direct database inspection.
- Mature PostgreSQL sequence-based generation is available.
- Familiar operational behavior for internally generated identifiers.

Potential costs:

- Requires an explicit allocation strategy and sequence authority.
- Sequential values may expose internal record-count or insertion-order
  characteristics if ever surfaced outside the persistence boundary.
- The identifier may be more easily confused with an operational number
  if the boundary is not kept explicit.
- Numeric representation provides no identity semantics by itself.

### 6.3 PRODUCT AND AUTHORITY RECONCILIATION

Both candidate families can represent the Actor persistence key without
changing the Product Actor model.

Neither candidate may become:

- the Stable Actor Identity Reference by implication;
- a username;
- a password;
- a session identifier;
- a role;
- an authority grant;
- a delegation scope.

The physical persistence key remains an internal persistence
representation.

The Doctor remains the Initial Actor, Main Admin, Clinical Authority,
and System Owner regardless of the selected physical key.

The Nurse remains a delegated operational Actor regardless of the
selected physical key.

### 6.4 PATIENT ALIGNMENT BOUNDARY

The existing Patient persistence implementation uses a PostgreSQL UUID
technical Patient identifier.

That implementation is evidence of an existing Patient-specific
physical decision only.

It does not automatically establish the Actor persistence key type.

Actor UUID versus Numeric must therefore be decided from the Actor
persistence requirements and PostgreSQL physical constraints, not by
copying the Patient implementation.

### 6.5 DECISION CRITERIA

The final selection shall be evaluated against:

1. Stable technical identity.
2. Separation from Product Actor identity semantics.
3. Separation from Role and Authority Context.
4. Persistence integrity.
5. PostgreSQL suitability.
6. Identifier generation safety.
7. Future authentication association.
8. Future authorization association.
9. Historical identity preservation.
10. Data-preservation requirements.
11. Operational simplicity.
12. Avoidance of accidental exposure of authority or identity semantics.

DECISION_STATUS = PENDING_FINAL_SELECTION


## 7. FINAL PHYSICAL TYPE DECISION

ACTOR_PERSISTENCE_KEY_TYPE = PostgreSQL UUID

ACTOR_PERSISTENCE_KEY_GENERATION = PostgreSQL 18 native uuidv7()

DECISION = UUID

DECISION_STATUS = CLOSED + PROVEN

### 7.1 DECISION RATIONALE

The Actor persistence key is an internal technical persistence identity.

It is logically distinct from:

- Stable Actor Identity Reference;
- Actor Role;
- Authority Context;
- Main Admin authority;
- Clinical Authority;
- System Ownership;
- authentication credentials;
- session identifiers;
- delegation scope.

PostgreSQL UUID is selected because it provides a dedicated technical
identifier representation without introducing a business-facing numeric
identifier or an additional sequential identity mechanism.

PostgreSQL 18 native `uuidv7()` provides database-native generation for
the selected UUID representation.

The selected representation therefore preserves the required separation
between:

`Actor Identity`
and
`Actor Persistence Technical Key`.

### 7.2 NUMERIC ALTERNATIVE — REJECTED

NUMERIC is not selected for the Actor persistence key.

The rejection is based on the following bounded considerations:

1. Actor persistence does not require a business-facing sequential number.
2. Actor persistence does not require ordering by technical identity.
3. A numeric sequence would introduce an additional allocation mechanism
   without a Product requirement for sequential Actor identity.
4. A sequential numeric identifier could be unnecessarily confused with
   an operational or externally meaningful identifier.
5. UUID provides a direct technical identity representation while keeping
   Product identity and authority semantics separate.
6. PostgreSQL 18 already provides native UUIDv7 generation, so UUID does
   not require an additional extension or custom sequence for generation.

This rejection does not prohibit numeric identifiers elsewhere in the
Product where a separate authorized decision requires them.

### 7.3 PATIENT ALIGNMENT WITHOUT DECISION COPYING

The existing Patient physical authority is:

`patient_id = PostgreSQL UUID`
`generation = PostgreSQL 18 native uuidv7()`

The Actor decision independently reaches the same physical type because
the Actor persistence requirements support the same technical identity
characteristics.

This is alignment by reconciled engineering criteria, not automatic
inheritance of Patient authority.

### 7.4 IDENTITY MAPPING

The resulting physical Actor identity mapping is:

- Actor persistence physical column = `actor_id`
- Actor persistence technical identity = `actor_id`
- Physical type = PostgreSQL `UUID`
- Physical generation = PostgreSQL 18 native `uuidv7()`
- Product Actor identity = Stable Actor Identity Reference
- Actor persistence technical identity remains distinct from Product Actor
  identity semantics.

The physical column name is recorded here as the proposed physical mapping
for the subsequent naming and identity-mapping reconciliation.

No SQL object is created by this decision.

### 7.5 SAFETY BOUNDARY

This decision does NOT authorize:

- Actor table creation;
- Actor sequence creation;
- SQL execution;
- schema migration;
- repository implementation;
- service implementation;
- API implementation;
- authentication implementation;
- authorization implementation;
- Main Admin creation;
- Doctor credential creation;
- Nurse account creation;
- UI implementation;
- deployment;
- real use.

PERSISTENCE_IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED
ACTOR_SQL_AUTHORITY = NOT_GRANTED
AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED
AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED
MAIN_ADMIN_CREATION = NOT_AUTHORIZED
REAL_USE = NOT_AUTHORIZED

## 8. FINAL DECISION MARKERS

ACTOR_PERSISTENCE_KEY_TYPE = PostgreSQL UUID

ACTOR_PERSISTENCE_KEY_GENERATION = PostgreSQL 18 native uuidv7()

ACTOR_NUMERIC_KEY = REJECTED

ACTOR_TECHNICAL_IDENTITY = actor_id

ACTOR_IDENTITY_DISTINCT_FROM_PERSISTENCE_KEY = YES

ACTOR_ROLE_DISTINCT_FROM_PERSISTENCE_KEY = YES

AUTHORITY_CONTEXT_DISTINCT_FROM_PERSISTENCE_KEY = YES

PATIENT_ALIGNMENT = INDEPENDENTLY_RECONCILED

UUID_VS_NUMERIC = CLOSED

DECISION_STATUS = CLOSED + PROVEN

SQL_EXECUTION = NOT_PERFORMED

SCHEMA_EXECUTION = NOT_PERFORMED

ACTOR_DATA_WRITTEN = NOT_PERFORMED

IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED

FAIL = 0

## 9. NEXT GATE

ACTOR TECHNICAL IDENTITY MAPPING RECONCILIATION

END OF POSTGRESQL ACTOR PHYSICAL DATA TYPES DECISION V1
