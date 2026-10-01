# DR. ROBY CLINIC — FRONTEND IMPLEMENTATION DEFINITION V1

DOCUMENT = FRONTEND IMPLEMENTATION DEFINITION V1
STATUS = DEFINITION DRAFT
IMPLEMENTATION = NOT PERFORMED
FRONTEND_STACK = REACT + VITE
FRONTEND_IMPLEMENTATION_AUTHORIZED = NO

## 1. PURPOSE

This document defines the bounded technical implementation approach
for the Dr. Roby Clinic frontend.

It does not mutate established product, domain, persistence,
authentication, authorization, API, workflow, deployment, or UI
interaction contracts.

## 2. IMPLEMENTATION TARGET

The frontend shall be implemented as a React + Vite web application.

The frontend shall support the established responsive product boundary:

- PC
- Laptop
- Tablet
- Mobile

The frontend shall represent only capabilities already established
by the closed UI requirements and related contracts.

## 3. FRONTEND RUNTIME BOUNDARY

The frontend is a presentation and interaction runtime.

It shall not become:

- a database runtime;
- a persistence layer;
- an independent source of clinical truth;
- an authorization authority;
- an authentication authority;
- an API server;
- a replacement for the domain model.

## 4. FRONTEND DATA / SERVICE BOUNDARY

The frontend shall communicate through an explicit data/service boundary.

Initial isolated proof:

UI
→ Frontend Data / Service Boundary
→ Mock Adapter

Later integration:

UI
→ Frontend Data / Service Boundary
→ API Adapter
→ Fastify API
→ Application / Domain
→ Persistence
→ Database

The UI shall not directly access the database.

## 5. MOCK ADAPTER

The first frontend runtime shall use a Mock Adapter.

The Mock Adapter exists to permit isolated frontend construction
and proof without requiring:

- API connectivity;
- database connectivity;
- production authentication;
- production authorization middleware.

Mock behavior shall remain bounded by established contracts.

Mock data shall not redefine the domain model or create unsupported
clinical capabilities.

## 6. FRONTEND SERVICE BOUNDARY

UI components shall consume frontend-facing service/data operations
through the defined boundary rather than embedding future API transport
details directly inside presentation components.

The boundary shall permit the Mock Adapter to be replaced later by
an API Adapter without requiring direct UI-to-database coupling.

## 7. CORE PRODUCT FLOW

The frontend shall represent the established continuity:

Patient
→ Case
→ Visit
→ Clinic Day

The UI shall preserve the distinction between:

- Patient
- Case
- Visit
- Clinic Day
- Past History
- Clinical History

Clinical History shall remain derived from recorded Visits according
to the established persistence/domain definition.

## 8. DOCTOR SURFACE

The Doctor surface shall represent established Doctor capabilities,
including:

- Patients;
- patient data;
- selected patient;
- new registration;
- continuing Patients/Cases;
- current Clinic Day;
- Clinic Day counter;
- Clinic Day status/lifecycle;
- Visit information;
- Past History;
- Clinical History;
- examination;
- clinical decision;
- treatment/follow-up;
- Doctor-authorized Case completion.

The frontend shall not create additional Doctor authority beyond
the established contracts.

## 9. NURSE SURFACE

The Nurse surface shall represent only the established delegated
operational capabilities:

1. Patient Entry / Arrival
2. Patient Data Recording
3. Patient Exit
4. Doctor Notification

The frontend shall not provide Nurse controls for:

- Case completion;
- clinical authority transfer;
- System Ownership transfer;
- Main Admin transfer;
- unauthorized clinical amendment;
- self-expansion of permissions.

## 10. ARRIVAL AND VISIT BOUNDARY

Arrival Patient Condition shall remain a Visit-level value:

- Normal
- Moderately Unwell
- Severely Unwell

Detailed vital signs remain Doctor-entered according to the established
UI and clinical contracts.

The frontend shall not convert Arrival Patient Condition into a
clinical decision or diagnosis.

## 11. CASE / VISIT / CLINIC DAY RULES

The frontend shall preserve:

- Visit belongs to a Case;
- Visit belongs to a Clinic Day;
- follow-up creates a new Visit;
- Visit Exit ends the Visit only;
- Visit Exit does not complete the Case;
- only Doctor completes a Case;
- Clinic Day closure is Doctor-authorized;
- midnight does not automatically close the Clinic Day;
- Clinic Day Start does not create Case or Visit;
- Clinic Day Start does not grant Nurse clinical authority.

## 12. RESPONSIVE IMPLEMENTATION

The frontend shall provide one responsive web application rather than
separate applications for each device class.

Responsive behavior shall cover:

- desktop;
- laptop;
- tablet;
- mobile.

Exact breakpoints, CSS values, component styling, visual theme,
and device-specific layout details remain implementation details
within the established UI boundary.

They shall not introduce new product capabilities.

## 13. ERROR / INVALID ACTION SURFACE

The frontend shall visibly handle invalid actions already defined
by the contracts, including:

- duplicate Patient identity / CPN;
- Visit without Case;
- Visit without Clinic Day;
- Nurse Case completion attempt;
- cross-Visit overwrite;
- unauthorized clinical amendment.

An invalid action shall not silently mutate protected state.

## 14. AUTHENTICATION / AUTHORIZATION BOUNDARY

The frontend may represent authentication and authorization-aware
interaction states, but it shall not independently establish authority.

Authentication remains server-managed according to the Authentication
Technical Contract.

Authorization remains governed by the Authorization Technical Contract.

Frontend visibility of controls shall not be treated as the security
authority.

## 15. FRONTEND STRUCTURE

The implementation shall separate, at minimum:

- application bootstrap;
- presentation/UI components;
- frontend data/service boundary;
- Mock Adapter;
- frontend workflow/state representation;
- static assets/styles;
- frontend proof/test surface.

Exact directory and file names remain implementation details and shall
be established during authorized build preparation without changing
the product contracts.

## 16. DEPENDENCY DISCIPLINE

React and Vite are the selected frontend technologies.

No additional dependency is required by this definition.

Additional dependencies shall require an implementation-specific
technical reason and must not silently expand project scope.

## 17. API INTEGRATION BOUNDARY

The initial frontend build shall not require API implementation.

API integration is a later phase:

Frontend
→ API Adapter
→ Fastify API

The frontend shall not assume undocumented route names, payloads,
response envelopes, authentication transport, or error contracts.

Those remain governed by the API contract and future API implementation
proof.

## 18. DATABASE BOUNDARY

The frontend shall have no direct database dependency.

Database connectivity is outside the initial frontend implementation.

Persistence remains behind the API/application/persistence layers.

## 19. FRONTEND PROOF

Frontend proof shall establish at minimum:

- application starts;
- responsive surface renders;
- Doctor surface renders;
- Nurse surface renders;
- Patient → Case → Visit → Clinic Day continuity is representable;
- Mock Adapter operates through the service boundary;
- Nurse restrictions are represented;
- invalid actions are represented;
- no direct database dependency exists;
- frontend build succeeds.

Proof shall precede progression to API integration.

## 20. IMPLEMENTATION PHASE BOUNDARY

Authorized frontend implementation, once separately approved, shall
follow:

DEFINE
→ BUILD
→ PROVE
→ CLOSE

The frontend phase shall end with:

FRONTEND_IMPLEMENTATION = CLOSED + PROVEN

before API connection work begins.

## 21. EXPLICIT NON-AUTHORIZATION

This definition does not authorize:

- dependency installation;
- source creation;
- frontend build configuration;
- API implementation;
- API route creation;
- database implementation;
- SQL execution;
- authentication implementation;
- authorization middleware implementation;
- deployment;
- PWA installation behavior;
- new clinical capabilities;
- new Nurse authority;
- new workflow states;
- new workflow transitions;
- direct frontend-to-database access.

## 22. CURRENT STATUS

FRONTEND_STACK = REACT + VITE
FRONTEND_IMPLEMENTATION = NOT PERFORMED
FRONTEND_IMPLEMENTATION_AUTHORIZED = NO
DEPENDENCY_INSTALLATION = NOT PERFORMED
SOURCE_CREATION = NOT PERFORMED
API_CONNECTION = NOT PERFORMED
DATABASE_CONNECTION = NOT PERFORMED

## 23. NEXT GATE

NEXT_GATE =
FRONTEND IMPLEMENTATION DEFINITION PROOF AND RECONCILIATION

---

BUILD DISCIPLINE:

DEFINE → PROVE → AUTHORIZE → BUILD → PROVE → CLOSE
