# CLINIC UI INCREMENT 01 DEFINITION V1

## STATUS
DEFINITION

## INCREMENT
CLINIC UI INCREMENT 01

## PURPOSE
Establish the first real Clinic UI interaction surface from the closed UI contracts without introducing new product capability or changing any closed contract.

## IMPLEMENTATION_AUTHORIZED
YES

## FRONTEND_STACK
REACT + VITE

## RUNTIME_DATA_SOURCE
MOCK ADAPTER

## INITIAL_UI_SCOPE

The first UI increment shall establish the Doctor entry and clinic navigation shell supporting:

- Patients;
- Patient data;
- Selected Patient inspection entry;
- New Patient registration entry;
- Doctor's continuing Patients and Cases;
- Current Clinic Day;
- Clinic Day counter;
- Clinic Day status;
- Clinic Day lifecycle;
- Patients awaiting Doctor;
- Patients with Doctor;
- relevant open Cases;
- patient continuity.

## CORE_RELATIONSHIP

Patient
↓
Case
↓
Visit
↓
Clinic Day

The UI shall preserve Patient identity continuity and shall not imply duplicate identity creation.

## CLINIC_DAY_SCOPE

The Clinic Day surface shall expose:

- current working day;
- daily counter;
- status;
- lifecycle;
- relevant Patients/Cases.

A zero-case Clinic Day remains a valid visible state.

Clinic Day closure remains Doctor-authorized.

Clinic Day closure does not complete an open Case.

## RESPONSIVE_SCOPE

The shell shall support:

- Desktop;
- Laptop;
- Tablet;
- Mobile.

Exact visual breakpoints and device-specific layout rules may be implemented only as presentation behavior and shall not alter domain or workflow meaning.

## DATA_BOUNDARY

UI
↓
Frontend Data / Service Boundary
↓
Mock Adapter

No component shall access persistence or database directly.

## EXCLUDED_FROM_INCREMENT_01

The following are not part of this increment:

- API implementation;
- API connection;
- database implementation;
- database connection;
- authentication implementation;
- authorization middleware implementation;
- Nurse UI surface;
- clinical examination workflow;
- Doctor clinical decision workflow;
- Case completion interaction;
- Visit Exit interaction;
- new workflow states;
- new domain entities;
- new Nurse permissions;
- new clinical capabilities;
- direct frontend-to-database access.

## CONTRACT_PROTECTION

This increment shall preserve:

- Doctor Clinical Authority;
- Nurse delegated operational boundary;
- Patient identity stability;
- Patient → Case → Visit → Clinic Day relationship;
- Clinic Day visibility when counter is zero;
- Case lifecycle;
- Visit chronology;
- Past History / Clinical History distinction;
- no cross-Visit overwrite;
- no unauthorized Nurse capability;
- no silent contract mutation.

## BUILD_DISCIPLINE

BUILD → PROVE → NEXT

## NEXT_GATE
INCREMENT 01 IMPLEMENTATION

## FAIL
0
