# CPN GENERATION IMPLEMENTATION AUTHORIZATION DECISION V1

STATUS = AUTHORIZATION DECISION

PRODUCT = Dr.Roby Clinic
CAPABILITY = GENERATE CLINIC PATIENT NUMBER

## 1. AUTHORIZATION BASIS

The following decisions are CLOSED + PROVEN:

- CPN product requirement;
- CPN format decision;
- CPN generation mechanism decision.

CPN_FORMAT = PREFIX + SEQUENTIAL NUMBER
PREFIX = CPN-
CPN_GENERATION_DIRECTION = PERSISTENCE-AUTHORITATIVE

## 2. AUTHORIZATION SCOPE

IMPLEMENTATION_AUTHORIZED = YES

Authorization is limited to the bounded technical capability required
to generate a new CPN sequential value through an authoritative
persistence mechanism.

The implementation must:
- generate a new sequential numeric value;
- form the product CPN as `CPN-` + numeric value;
- preserve CPN stability after first Patient registration;
- prevent duplicate allocation under concurrent registration;
- keep CPN separate from Visit, Case, and Clinic Day identifiers;
- preserve the separate technical Patient persistence identity.

## 3. EXPLICITLY AUTHORIZED TECHNICAL WORK

AUTHORIZED:
- CPN generation implementation;
- the minimum persistence mechanism required to provide
  authoritative sequential allocation;
- the minimum application integration required to consume
  the generated CPN.

## 4. EXPLICITLY NOT AUTHORIZED

NOT AUTHORIZED:
- unrelated database schema changes;
- unrelated persistence implementation;
- unrelated repositories;
- API implementation;
- UI implementation;
- authentication;
- authorization;
- deployment;
- new application capabilities;
- new actors;
- authority transfer;
- workflow changes;
- Patient domain redesign;
- Case/Visit/Clinic Day changes.

## 5. SQL / SCHEMA BOUNDARY

This authorization permits only the minimum persistence technical
work required by the CPN mechanism.

No schema object, table, column, sequence, migration, datatype,
constraint, or SQL statement is pre-selected by this authorization.

Those technical details require bounded implementation definition
before execution.

## 6. GOVERNANCE

NEW_PRODUCT_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
CONTRACT_MUTATION = NO
UNAUTHORIZED_SCOPE_EXPANSION = NO
DEFERRED_PRODUCT_DECISIONS_RESOLVED = NO

## 7. PROOF REQUIREMENTS

The eventual implementation must prove:
- sequential allocation;
- required `CPN-` format;
- uniqueness;
- concurrency safety;
- stability of an allocated CPN;
- no cross-identifier contamination;
- no contract mutation;
- no unauthorized scope expansion.

FAIL = 0

## 8. AUTHORIZATION RESULT

BUILD_READINESS = PASS
CPN_GENERATION_IMPLEMENTATION_AUTHORIZED = YES
CPN_GENERATION_IMPLEMENTATION_EXECUTION = NOT PERFORMED

NEXT GATE = CPN GENERATION IMPLEMENTATION DEFINITION
