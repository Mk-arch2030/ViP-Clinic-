# CPN STARTING VALUE FACTORY DECISION V1

STATUS = CLOSED + PROVEN

PRODUCT = Dr.Roby Clinic
CAPABILITY = GENERATE CLINIC PATIENT NUMBER

## 1. ESTABLISHED FORMAT

CPN_FORMAT = PREFIX + SEQUENTIAL NUMBER
PREFIX = CPN-

## 2. STARTING VALUE

The Product Manuscript, Contracts, Domain Specification,
Persistence Schema Definition, and Persistence Decision Register
do not currently establish a starting numeric value for CPN.

Therefore:

CPN_STARTING_VALUE = 1

## 3. EXAMPLES

Any previously displayed values such as:
- CPN-100001
- CPN-100002

are examples only and are NOT Product decisions.

## 4. BOUNDARY

This decision concerns only the initial numeric value of the
approved CPN sequential format.

It does not define:
- database schema;
- SQL;
- sequence implementation;
- migration;
- repository;
- API;
- UI;
- authentication;
- authorization.

## 5. GOVERNANCE

CONTRACT_MUTATION = NO
NEW_PRODUCT_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
UNAUTHORIZED_SCOPE_EXPANSION = NO

## 6. STATUS

CPN_FORMAT = SELECTED
CPN_STARTING_VALUE = 1
IMPLEMENTATION_AUTHORIZED = NO
FAIL = 0

NEXT GATE = CPN GENERATION TECHNICAL DESIGN
