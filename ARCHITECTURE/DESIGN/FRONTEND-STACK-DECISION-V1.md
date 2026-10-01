# DR. ROBY CLINIC — FRONTEND STACK DECISION V1

DOCUMENT = FRONTEND STACK DECISION V1
STATUS = DECISION DRAFT
IMPLEMENTATION = NOT PERFORMED
FRONTEND_STACK_SELECTED = REACT + VITE
FRONTEND_IMPLEMENTATION_AUTHORIZED = NO

## 1. DECISION PURPOSE

This document establishes the selected frontend implementation approach
for the already-defined Dr. Roby Clinic UI requirements.

This decision does not mutate or redefine any established product,
domain, persistence, authentication, authorization, API, workflow,
or deployment contract.

## 2. SELECTED FRONTEND STACK

SELECTED_STACK = REACT + VITE

React is selected as the frontend component and interaction framework.

Vite is selected as the frontend development/build tool.

The selected stack is limited to the frontend implementation boundary.

## 3. DECISION BASIS

The selection is based on the established project requirements:

1. Responsive web application support.
2. Component-based representation of Doctor and Nurse workflows.
3. Maintainable representation of Patient → Case → Visit → Clinic Day continuity.
4. Support for longitudinal Patient History presentation.
5. Support for workflow state and invalid-action presentation.
6. Clear separation between UI and frontend service/data boundaries.
7. Isolated Mock Adapter support for frontend proof.
8. Later API Adapter integration without direct database access.
9. Testability and proofability of UI behavior.
10. Compatibility with the existing Node/Fastify project runtime.
11. Ability to preserve existing architecture boundaries.
12. Ability to scale the frontend interaction surface without requiring
    direct coupling to persistence.

## 4. REQUIRED FRONTEND ARCHITECTURE

The frontend shall preserve this boundary:

UI
→ Frontend Data / Service Boundary
→ Mock Adapter

During isolated frontend proof.

Later:

UI
→ Frontend Data / Service Boundary
→ API Adapter
→ Fastify API
→ Application / Domain
→ Persistence
→ Database

The frontend shall never connect directly to the database.

## 5. IMPLEMENTATION BOUNDARY

The selected stack does not authorize:

- database access from frontend code;
- direct persistence access;
- direct SQL execution;
- API implementation;
- API route creation;
- authentication implementation;
- authorization middleware implementation;
- deployment implementation;
- mutation of established domain contracts;
- mutation of established UI requirements;
- creation of new clinical capabilities;
- creation of new Nurse authority;
- uncontracted workflow states or transitions.

## 6. FRONTEND PROOF STRATEGY

The initial frontend implementation shall be independently provable
through a Mock Adapter.

The first frontend runtime shall therefore not require:

- Fastify runtime connectivity;
- database connectivity;
- production authentication;
- production authorization middleware.

The Mock Adapter shall represent only behavior required by the already
established UI requirements.

The later API Adapter shall replace the Mock Adapter at the frontend
data/service boundary without requiring direct UI-to-database coupling.

## 7. RESPONSIVE SCOPE

The selected stack shall support the established responsive web boundary:

- PC
- Laptop
- Tablet
- Mobile

Exact breakpoints, CSS system, component library, visual theme,
and device-specific layout details remain implementation decisions
within the authorized frontend scope and shall not mutate product
contracts.

## 8. DOCTOR / NURSE BOUNDARY

The frontend shall represent the already-established authority model.

Doctor:
- Clinic Owner
- Main Admin
- Clinical Authority
- System Owner

Nurse:
- Operational Workflow Participant
- delegated capabilities only

The frontend shall not create authority that does not exist in the
authorization contract.

## 9. DEPENDENCY DISCIPLINE

React and Vite are the selected core frontend technologies.

Additional frontend packages shall not be introduced automatically.

Any additional dependency must have an implementation-specific reason
and remain compatible with the established architecture and proof
discipline.

## 10. CONTRACT IMPACT

CONTRACT_MUTATION = NO

The stack selection does not alter:

- Domain contracts
- Persistence contracts
- Authentication contract
- Authorization contract
- API contract
- Workflow State Machine contract
- Deployment contract
- UI Interaction Technical Contract
- UI Implementation Requirements

## 11. CURRENT AUTHORIZATION STATE

FRONTEND_STACK_SELECTED = REACT + VITE
FRONTEND_IMPLEMENTATION = NOT PERFORMED
FRONTEND_DEPENDENCY_INSTALLATION = NOT PERFORMED
FRONTEND_SOURCE_CREATION = NOT PERFORMED
FRONTEND_BUILD_CONFIGURATION = NOT PERFORMED

UI_IMPLEMENTATION_AUTHORIZED = NO
FRONTEND_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_AUTHORIZED = NO
DATABASE_IMPLEMENTATION_AUTHORIZED = NO

## 12. NEXT GATE

NEXT_GATE =
FRONTEND STACK DECISION PROOF AND IMPLEMENTATION AUTHORIZATION REVIEW

No frontend dependency installation or source creation shall occur
until this decision is independently proofed and the frontend
implementation authorization gate is explicitly closed.

---

DECISION DISCIPLINE:

DECIDE → PROVE → AUTHORIZE → BUILD → PROVE → CLOSE
