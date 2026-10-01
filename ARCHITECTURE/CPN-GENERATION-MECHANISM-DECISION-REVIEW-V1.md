# CPN GENERATION MECHANISM DECISION REVIEW V1

STATUS = REVIEW DRAFT

## 1. FORMAT ALIGNMENT

CPN_FORMAT = PREFIX + SEQUENTIAL NUMBER
PREFIX = CPN-

RESULT = PASS

## 2. PRODUCT ALIGNMENT

CPN is:
- system-generated at first Patient registration;
- stable for the Patient;
- the stable clinic reference for Find / Retrieve;
- not a Visit identifier;
- not a Case identifier;
- not a Clinic Day identifier.

RESULT = PASS

## 3. GENERATION DIRECTION

Selected direction:

PERSISTENCE-AUTHORITATIVE SEQUENTIAL GENERATION

Rationale:
- application-memory counters are not durable;
- application-memory counters are not authoritative across process restarts;
- application-memory counters are not authoritative across multiple instances;
- first-registration uniqueness requires an authoritative boundary.

RESULT = PASS

## 4. CONCURRENCY

The eventual persistence mechanism must provide authoritative uniqueness/concurrency behavior for sequential allocation.

Application memory is not the authority for CPN uniqueness.

RESULT = PASS

## 5. IDENTITY ALIGNMENT

CPN remains the stable product-level clinic reference.

A separate technical Patient persistence key remains preserved.

CPN does not become:
- Visit identity;
- Case identity;
- Clinic Day identity;
- replacement for the technical Patient key.

RESULT = PASS

## 6. SCOPE CONTROL

SQL = NOT DEFINED
SCHEMA = NOT DEFINED
MIGRATION = NOT DEFINED
ORM = NOT DEFINED
REPOSITORY = NOT DEFINED
APPLICATION IMPLEMENTATION = NOT DEFINED
API = NOT DEFINED
UI = NOT DEFINED
AUTHENTICATION = NOT DEFINED
AUTHORIZATION = NOT DEFINED
DEPLOYMENT = NOT DEFINED

RESULT = PASS

## 7. GOVERNANCE

NEW_PRODUCT_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
CONTRACT_MUTATION = NO
UNAUTHORIZED_SCOPE_EXPANSION = NO

RESULT = PASS

## 8. REVIEW RESULT

FORMAT_ALIGNMENT = PASS
PRODUCT_ALIGNMENT = PASS
GENERATION_DIRECTION = PASS
CONCURRENCY_PRINCIPLE = PASS
IDENTITY_ALIGNMENT = PASS
SCOPE_CONTROL = PASS
GOVERNANCE = PASS

FAIL = 0

NEXT GATE = CPN GENERATION MECHANISM DECISION CLOSURE
