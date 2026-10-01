# Dr.Roby Clinic — CONTRACT-02
# Clinic Day Contract

STATUS: DEFINED
PHASE: CONTRACT
IMPLEMENTATION: NOT_STARTED

## 1. CONTRACT PURPOSE

This contract defines the authoritative domain rules for the Clinic Day.

The Clinic Day is the working-day context in which the clinic records
Cases and Visits.

This contract does not define database schema, API routes, UI surfaces,
authentication implementation, authorization implementation, or
deployment.

## 2. CLINIC DAY IDENTITY

A Clinic Day represents the clinic's working context for a working date.

A Clinic Day contains the Cases and Visits recorded during that working
day.

Multiple Cases MAY exist during the same Clinic Day.

Multiple Visits MAY exist during the same Clinic Day.

Cases MAY be at different points in their journeys during the same
Clinic Day.

## 3. DAILY CASE ACTIVITY

Cases recorded during a Clinic Day form that day's case activity.

The system MUST preserve the distinction between the Clinic Day itself
and the independent lifecycle of each Case.

The end of a Clinic Day MUST NOT be interpreted as completion of every
Case recorded during that day.

## 4. CLINIC DAY AND VISIT

Each Visit occurs within one Clinic Day.

A Case MAY continue across multiple Clinic Days through later Visits.

Therefore:

Clinic Day
→ Case
→ Visit

A later Visit for an open Case occurs on a later Clinic Day when the
patient returns for follow-up.

## 5. CLINIC DAY CLOSURE

Closing a Clinic Day is an explicit operational action.

The Doctor reviews the daily data before the Clinic Day is closed.

The Clinic Day MUST NOT be treated as automatically closed merely
because the calendar date changes or midnight is reached.

The closure decision belongs to the Doctor / Main Admin, subject to any
operational delegation explicitly defined later.

## 6. OPEN CASE BOUNDARY

Closing a Clinic Day MUST NOT automatically complete an open Case.

Closing a Clinic Day MUST NOT automatically create a Case Completion.

An open Case MAY continue into a later Clinic Day.

The Case remains governed by the Patient / Case / Visit Contract.

## 7. DAILY DATA PRESERVATION

All daily data MUST remain preserved when the working day ends.

Ending the working day MUST NOT cause recorded daily information to be
discarded.

Preservation of daily data is distinct from higher protection of the
closed Clinic Day.

## 8. DATA PROTECTION MODE

The product vision defines two protection timing choices:

- IMMEDIATE
- 3 DAYS

If IMMEDIATE is selected, higher protection follows the Doctor's review
and Clinic Day closure.

If 3 DAYS is selected, the daily data remains preserved while the
defined review/correction period is available, followed by higher
protection after that period.

This contract defines the product rule only.

It does NOT define the technical mechanism used to implement higher
protection.

## 9. AUTHORITY

The Doctor is the Main Admin and Clinical Authority.

The Doctor reviews and explicitly closes the Clinic Day.

A Nurse MAY perform delegated operational workflow under the Doctor's
authority where such delegation is later defined by the appropriate
authorization contract.

Delegation MUST NOT transfer system ownership or clinical authority.

## 10. CORE INVARIANTS

The following rules are mandatory:

1. A Clinic Day represents one working-date context.
2. A Clinic Day contains the Cases and Visits recorded during that
   working day.
3. Multiple Cases MAY coexist within one Clinic Day.
4. Multiple Visits MAY occur within one Clinic Day.
5. Each Visit occurs within one Clinic Day.
6. A Case MAY continue across multiple Clinic Days.
7. Clinic Day closure is explicit.
8. Midnight MUST NOT automatically close the Clinic Day.
9. Daily data MUST remain preserved at the end of the working day.
10. Closing a Clinic Day MUST NOT automatically complete an open Case.
11. Closing a Clinic Day MUST NOT itself establish Case Completion.
12. The Doctor / Main Admin owns the closure decision.
13. Data protection timing is IMMEDIATE or 3 DAYS.
14. The technical mechanism for higher protection is outside this contract.

## 11. EXPLICIT NON-AUTHORIZATION

This contract does NOT authorize:

- Database schema
- Database migrations
- API routes
- API request/response formats
- UI screens
- UI components
- Technical locking mechanisms
- Audit implementation
- Authentication implementation
- Authorization implementation
- Deployment
- Multi-clinic behavior
- Multi-branch behavior
- Multi-tenant behavior

Any implementation mechanism requires its own definition and contract
authority.

## 12. CONTRACT STATUS

CONTRACT-02_SCOPE = CLINIC DAY
CONTRACT-02_IMPLEMENTATION_AUTHORIZED = NO
CONTRACT-02_SCHEMA_AUTHORIZED = NO
CONTRACT-02_API_AUTHORIZED = NO
CONTRACT-02_UI_AUTHORIZED = NO



## CONTROLLED AMENDMENT — CLINIC DAY START / OPEN

The Clinic Day lifecycle MUST begin through an explicit operational Start / Open action.

Clinic Day Start establishes the active working-date context for the clinic.

The Clinic Day Start action belongs to the Doctor / Main Admin.

Clinic Day Start MUST NOT:
- complete a Case;
- create a Case by itself;
- create a Visit by itself;
- replace Patient identity;
- replace Case identity;
- replace Visit identity;
- transfer system ownership;
- transfer clinical authority;
- grant Nurse clinical authority;
- override the existing Clinic Day closure rules.

The Clinic Day Start establishes the working context in which approved Cases and Visits may be recorded for that working date.

The existing Clinic Day closure rules remain unchanged:
- Clinic Day closure remains explicit.
- Doctor / Main Admin retains closure authority.
- Midnight MUST NOT automatically close the Clinic Day.
- Closing a Clinic Day MUST NOT complete an open Case.
- An open Case MAY continue into a later Clinic Day.
- Daily data MUST remain preserved.

CLINIC_DAY_START = EXPLICIT
CLINIC_DAY_OPEN = ESTABLISHED_BY_START
START_AUTHORITY = DOCTOR / MAIN ADMIN
START_CREATES_CASE = NO
START_CREATES_VISIT = NO
START_COMPLETES_CASE = NO
START_TRANSFERS_AUTHORITY = NO
NURSE_START_AUTHORITY = NO
CLOSURE_RULES = PRESERVED
IMPLEMENTATION_AUTHORIZED = NO
SCHEMA_AUTHORIZED = NO
API_AUTHORIZED = NO
UI_AUTHORIZED = NO

END OF CONTRACT-02
