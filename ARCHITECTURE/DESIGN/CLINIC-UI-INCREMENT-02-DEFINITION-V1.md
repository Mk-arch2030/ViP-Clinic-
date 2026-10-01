# CLINIC UI INCREMENT 02 DEFINITION V1

## STATUS
DEFINITION

## INCREMENT
CLINIC UI INCREMENT 02

## PURPOSE
Extend the proven Clinic Day operational surface so that the Clinic Day visibly exposes its recorded Visits and their authoritative existing context, and allow the Doctor to inspect the details of a selected Visit without introducing new domain states, new clinical capabilities, or new authority.

## IMPLEMENTATION_AUTHORIZED
PENDING AUTHORIZATION REVIEW

## FRONTEND_STACK
REACT + VITE

## RUNTIME_DATA_SOURCE
MOCK ADAPTER

## PRIMARY_SCOPE
The increment shall establish:

- Clinic Day Visit visibility;
- Visits belonging to the current Clinic Day;
- Visit operational/context display;
- Visit selection;
- Visit detail inspection;
- Patient → Case → Visit → Clinic Day continuity;
- preservation of previous Visits;
- Visit Type visibility;
- existing Case workflow state visibility;
- existing Visit Protection State visibility;
- Clinical History presentation as derived from recorded Visits.

## CORE_RELATIONSHIP
Patient
↓
Case
↓
Visit
↓
Clinic Day

The UI shall preserve this relationship without creating duplicate Patient, Case, or Visit identity.

## CLINIC_DAY_VISIT_SCOPE
The Current Clinic Day surface shall expose:

- current working day;
- Clinic Day status;
- Clinic Day lifecycle;
- current daily counter;
- relevant Patients / Cases;
- recorded Visits belonging to the Clinic Day;
- the relevant existing state/context of each Visit.

A Clinic Day remains visible when its daily patient or case count is zero.

The Clinic Day shall not create, complete, close, or alter a Visit merely by displaying it.

## VISIT_DISPLAY_SCOPE
Each displayed Visit shall expose, where defined by the existing contracts:

- Visit identity;
- Patient identity;
- Case identity;
- Clinic Day identity/context;
- Visit Type = Visit & Consultation;
- existing Case workflow state;
- existing Visit Protection State;
- relevant Visit chronology/context.

The UI shall not invent an independent Visit state machine.

## VISIT_DETAIL_SCOPE
Selecting a Visit shall expose its organized details, including where applicable:

- Patient information;
- Case context;
- Clinic Day context;
- Visit Type;
- Visit operational context;
- Arrival Patient Condition when recorded;
- Current Complaint when recorded;
- Doctor workflow visibility/context;
- Visit chronology;
- Clinical History derived from accumulated recorded Visits;
- Visit Protection State.

Clinical History shall remain a derived read-time concept based on authoritative recorded Visits.

Clinical History shall not be represented as an independently persisted source of truth.

## VISIT_CONTINUITY
A follow-up shall create a new Visit.

A previous Visit shall remain meaningful and shall not be overwritten.

The UI shall present Visit continuity rather than a mutable latest-record replacement.

## CASE_BOUNDARY
The increment may display the existing Case workflow state associated with a Visit.

The increment shall not introduce or alter Case workflow states.

Only the Doctor may establish Case Completion.

Visit Exit shall not automatically complete a Case.

Clinic Day closure shall not automatically complete a Case.

## VISIT_PROTECTION_BOUNDARY
The increment may display the authoritative existing Visit Protection State:

- OPEN;
- PROTECTED.

The UI shall not create a separate protection state for individual clinical fields.

## NURSE_BOUNDARY
Nurse UI is not implemented by this increment.

No new Nurse permission is introduced.

No Nurse authority is introduced.

The existing Nurse delegated operational boundary remains unchanged.

## CLINICAL_BOUNDARY
This increment does not implement:

- clinical examination workflow;
- detailed Vital Signs entry;
- clinical decision-making;
- diagnosis;
- treatment;
- Case Completion interaction;
- independent clinical amendment authority.

Existing clinical information may be displayed only within the already defined interaction boundary.

## DATA_BOUNDARY
UI
↓
Frontend Data / Service Boundary
↓
Mock Adapter

No component shall access persistence or database directly.

## EXCLUDED_FROM_INCREMENT_02
The following are explicitly excluded:

- API implementation;
- API connection;
- database implementation;
- database connection;
- authentication implementation;
- authorization middleware implementation;
- direct frontend-to-database access;
- new domain entities;
- new workflow states;
- new Visit status state machine;
- new Nurse permissions;
- new clinical capabilities;
- silent contract mutation;
- automatic Case Completion;
- automatic Clinic Day closure;
- automatic Visit mutation caused by display.

## RESPONSIVE_SCOPE
The Visit and Visit Detail surfaces shall preserve:

- Desktop;
- Laptop;
- Tablet;
- Mobile.

Responsive behavior is presentation behavior only and shall not alter domain or workflow meaning.

## CONTRACT_PROTECTION
The increment shall preserve:

- Doctor Clinical Authority;
- Nurse delegated operational boundary;
- Patient identity stability;
- Case identity and continuity;
- Visit identity and chronology;
- Patient → Case → Visit → Clinic Day relationship;
- Visit Type = Visit & Consultation;
- Case workflow states;
- Visit Protection State;
- Past History / Clinical History distinction;
- Clinical History derived from Visits;
- no cross-Visit overwrite;
- no unauthorized Nurse capability;
- no silent contract mutation.

## BUILD_DISCIPLINE
BUILD → PROVE → NEXT

## NEXT_GATE
FRONTEND UI INCREMENT 02 AUTHORIZATION REVIEW

## FAIL
0
