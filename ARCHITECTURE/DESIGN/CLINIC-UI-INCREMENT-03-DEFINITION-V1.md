# Dr.Roby Clinic
# Clinic UI Increment 03 — Definition V1

## STATUS

DEFINITION

## PURPOSE

Define the next bounded frontend UI increment after Clinic UI Increment 02.

Increment 03 shall extend the proven Doctor operational surface without changing
the established domain model, workflow states, authority model, persistence
contracts, or frontend architectural boundary.

## IMPLEMENTATION_BOUNDARY

FRONTEND_ONLY

## FRONTEND_STACK

React + Vite

## DATA_BOUNDARY

Mock Adapter only.

No API connection.
No database connection.
No direct database access.

## AUTHORITATIVE_CONTINUITY

The implementation shall preserve:

Patient → Case → Visit → Clinic Day

and shall continue to present existing authoritative domain context without
inventing parallel states or duplicate sources of truth.

## INCREMENT_03_SCOPE

The bounded scope for Increment 03 is:

1. Continue the Doctor operational journey from the proven Visit surface.
2. Provide a bounded Doctor-facing inspection surface for the selected Visit
   that makes the existing clinical/workflow context easier to inspect.
3. Preserve the distinction between:
   - Patient information
   - Past History
   - Clinical History derived from recorded Visits
   - Case workflow state
   - Visit Protection State
   - Clinic Day context
4. Preserve previous Visits and their chronology.
5. Preserve the existing Visit Type:
   `Visit & Consultation`
6. Preserve existing Arrival Condition when recorded.
7. Preserve existing Current Complaint when recorded.
8. Preserve existing Doctor workflow context.
9. Preserve responsive behavior across:
   Desktop / Laptop / Tablet / Mobile.

## CLINICAL_HISTORY_RULE

Clinical History remains a derived read-time presentation based on
authoritative recorded Visits.

No independently persisted Clinical History entity or alternate source of
truth shall be introduced.

## WORKFLOW_RULE

Existing Case workflow states remain authoritative.

Increment 03 shall not introduce a new Case state or a new Visit state machine.

Case completion remains a Doctor-authorized workflow action only.

Visit Exit does not complete the Case.

Clinic Day closure does not complete the Case.

## VISIT_PROTECTION_RULE

Existing Visit Protection State remains authoritative:

- OPEN
- PROTECTED

Increment 03 shall not create another Visit status/state model.

## AUTHORITY_BOUNDARY

Doctor remains:

- Clinic Owner
- Main Admin
- Clinical Authority
- System Owner

Nurse remains a delegated operational participant only.

Increment 03 shall not add Nurse permissions or expand Nurse authority.

## EXPLICIT_EXCLUSIONS

The following are outside Increment 03:

- API implementation
- API connection
- Database implementation
- Database connection
- ORM
- Repository implementation
- Authentication implementation
- Authorization middleware implementation
- New domain entities
- New domain states
- New Visit status/state machine
- New Nurse permissions
- New clinical capabilities
- Clinical examination entry
- Diagnosis entry
- Treatment execution
- Case completion interaction
- Automatic Case completion
- Automatic Clinic Day closure
- Automatic Visit mutation caused by display
- Direct frontend-to-database connection

## UI_BOUNDARY

The UI remains a single internet-hosted Web App for:

- Desktop
- Laptop
- Tablet
- Mobile

PWA/installable behavior remains future direction only and is not part of
Increment 03 implementation.

## DATA_SOURCE

Mock data may be extended only to demonstrate the bounded Increment 03 UI
surface.

Mock data must remain structurally aligned with the existing contracts.

## PRESERVATION_RULE

Existing proven Increment 01 and Increment 02 behavior must remain intact.

No unrelated refactoring is authorized.

## PROOF_REQUIREMENTS

Before closure, Increment 03 must prove:

- production build PASS
- Doctor UI surface PASS
- existing Visit continuity PASS
- existing Patient → Case → Visit → Clinic Day continuity PASS
- Clinical History remains derived from Visits
- existing Case workflow state remains intact
- existing Visit Protection State remains intact
- responsive surface PASS
- no forbidden connection markers
- no direct database markers
- no negative/error markers
- FAIL = 0

## IMPLEMENTATION_AUTHORIZED

PENDING AUTHORIZATION REVIEW

## NEXT_GATE

FRONTEND UI INCREMENT 03 AUTHORIZATION REVIEW

## FAIL

0
