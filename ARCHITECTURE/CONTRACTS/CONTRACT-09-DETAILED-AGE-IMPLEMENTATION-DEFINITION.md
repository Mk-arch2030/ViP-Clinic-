# CONTRACT-09 DETAILED AGE IMPLEMENTATION DEFINITION

> STATUS: CLOSED + PROVEN
> PARENT AUTHORITY: CONTRACT-09
> IMPLEMENTATION AUTHORIZATION: CONTRACT-09 IMPLEMENTATION AUTHORIZATION — CLOSED + PROVEN
> SCOPE: BOUNDED CANONICAL DETAILED AGE CALCULATION
> PRODUCTION IMPLEMENTATION: NOT YET CHANGED
> FAIL = 0

## 1. PURPOSE
This document defines the bounded implementation target required to satisfy the canonical detailed-age representation established by Contract-09 and its closed reconciliation decisions.

## 2. AUTHORITY SEPARATION
The existing calculateAge() function remains the Years-only compatibility primitive.
This implementation MUST NOT change its return type or established observable behavior.
A separate function named calculateDetailedAge(dateOfBirth, referenceDate) is authorized as the canonical detailed-age calculation capability.

## 3. CANONICAL RESULT
calculateDetailedAge() SHALL return exactly { years: Number, months: Number, days: Number }.
The result SHALL represent a calendar difference between DOB and the explicit Calculation Date.

## 4. CALENDAR MODEL
Calculation SHALL use sequential calendar arithmetic: completed Years, remaining completed Months, then remaining Days.
Fixed-day approximations such as elapsed milliseconds divided by 365 or 30 are NOT authorized.

## 5. LEAP-DAY RULE
For a DOB of February 29 in a non-leap year, February 28 SHALL be treated as the applicable birthday anniversary.
2024-02-29 -> 2025-02-28 MUST return { years: 1, months: 0, days: 0 }.

## 6. EXPLICIT CALCULATION DATE
The function SHALL accept an explicit Calculation Date.
The same DOB and Calculation Date MUST produce the same result regardless of the system clock.

## 7. INPUT AUTHORITY
DOB remains the authoritative temporal Patient fact.
Submitted Age MUST NOT be accepted as an authoritative input.

## 8. COMPATIBILITY PROTECTION
calculateAge(dateOfBirth, referenceDate) remains the existing Years-only compatibility primitive.
No existing caller depending on its integer result may be forced to consume the detailed representation.

## 9. PERSISTENCE BOUNDARY
This implementation SHALL NOT add an Age database column, Age table, migration, persistence authority, repository authority, or persisted detailed-age object.

## 10. PROHIBITED SCOPE
No API routes, controllers, unrelated services, authentication, authorization, workflow, Case, Visit, Encounter, Clinical History, Past History, mobile/PWA, deployment, database schema, or repository contract changes are authorized.

## 11. TEST AUTHORITY
TEST-01 through TEST-09 MUST exercise calculateDetailedAge().
TEST-10, TEST-11, and TEST-13 MUST continue protecting the existing Years-only compatibility primitive where applicable.
TEST-12 MUST continue proving that detailed Age has no persistence authority.

## 12. IMPLEMENTATION LOCATION
The bounded implementation target is domain/patient.js.
The change SHALL be additive.
Existing calculateAge() SHALL remain intact except for any strictly necessary private helper extraction that preserves its exact observable compatibility behavior.

## 13. PROOF REQUIREMENTS
Contract-09 detailed-age tests MUST PASS.
Existing regression tests MUST remain PASS.
calculateAge() compatibility behavior MUST remain PASS.
No prohibited production files may change.
No persistence authority may be introduced.
FAIL MUST equal 0.

## 14. CURRENT STATE
The implementation definition has passed structural review and is CLOSED + PROVEN.
No production implementation is claimed by this document.
PRODUCTION_IMPLEMENTATION = NOT CHANGED
PRODUCTION_AGE_SEMANTICS = NOT CHANGED
FAIL = 0
