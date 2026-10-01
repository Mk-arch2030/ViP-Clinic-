# CPN GENERATION IMPLEMENTATION DEFINITION V1

STATUS = DEFINITION DRAFT

PRODUCT = Dr.Roby Clinic
CAPABILITY = GENERATE CLINIC PATIENT NUMBER

## 1. AUTHORIZATION

CPN_GENERATION_IMPLEMENTATION_AUTHORIZED = YES
BUILD_READINESS = PASS

CPN_FORMAT = PREFIX + SEQUENTIAL NUMBER
PREFIX = CPN-
CPN_GENERATION_DIRECTION = PERSISTENCE-AUTHORITATIVE

## 2. IMPLEMENTATION OBJECTIVE

Implement the minimum technical capability required to allocate a
new authoritative sequential CPN value during first Patient
registration.

The resulting product reference shall be:

CPN = `CPN-` + sequential numeric value

## 3. REQUIRED BEHAVIOR

The implementation shall:

1. allocate a new sequential numeric value;
2. construct the CPN using the approved `CPN-` prefix;
3. provide authoritative uniqueness;
4. remain safe under concurrent first registrations;
5. allocate the CPN only for first Patient registration;
6. preserve the allocated CPN as the Patient's stable clinic reference;
7. never derive CPN from Visit, Case, or Clinic Day identity;
8. preserve the separate technical Patient persistence identity.

## 4. TECHNICAL BOUNDARY

The implementation may define only the minimum persistence mechanism
required for authoritative sequential allocation.

The implementation definition does NOT authorize unrelated:
- Patient persistence;
- repositories;
- API;
- UI;
- authentication;
- authorization;
- workflow;
- Case;
- Visit;
- Clinic Day;
- deployment changes.

## 5. DEFERRED TECHNICAL DETAILS

The following remain to be selected during bounded technical design:

- persistence object type;
- exact SQL;
- exact schema location;
- sequence/counter representation;
- numeric datatype;
- starting numeric value;
- repository/application integration boundary;
- transaction interaction;
- migration details.

These details must preserve the approved CPN contract and mechanism.

## 6. TESTABLE INVARIANTS

The implementation must prove:

CPN-01:
Every newly allocated CPN begins with `CPN-`.

CPN-02:
The suffix is a valid sequential numeric value.

CPN-03:
Two successful concurrent allocations cannot produce the same CPN.

CPN-04:
An allocated CPN is not regenerated for later Visits.

CPN-05:
CPN is not used as Visit, Case, or Clinic Day identity.

CPN-06:
The implementation does not replace the technical Patient persistence key.

CPN-07:
The implementation does not create a new product capability,
actor, authority, or workflow.

## 7. PROOF BOUNDARY

Required proof shall include:
- generation behavior;
- sequential behavior;
- uniqueness;
- concurrent allocation behavior;
- approved format;
- stability principle;
- scope safety.

FAIL = 0

## 8. GOVERNANCE

CONTRACT_MUTATION = NO
NEW_PRODUCT_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
UNAUTHORIZED_SCOPE_EXPANSION = NO

## 9. EXECUTION STATE

IMPLEMENTATION_EXECUTED = NO
IMPLEMENTATION_PROVEN = NO

NEXT GATE = CPN GENERATION IMPLEMENTATION DEFINITION REVIEW
