# DR. ROBY CLINIC — FRONTEND STACK DECISION MATRIX V1

DOCUMENT = FRONTEND STACK DECISION MATRIX V1
STATUS = DECISION ANALYSIS
IMPLEMENTATION = NOT PERFORMED
FRONTEND_IMPLEMENTATION_AUTHORIZED = NO
FRONTEND_STACK_SELECTED = NO

## 1. DECISION PURPOSE

This matrix evaluates the frontend implementation approach required
to implement the already-established UI Implementation Requirements.

The decision MUST NOT mutate:

- UI Interaction Technical Contract
- Authorization Technical Contract
- Authentication Technical Contract
- API Technical Contract
- Persistence Technical Contract
- Workflow State Machine Technical Contract
- Deployment Technical Contract

The decision is limited to frontend implementation technology.

## 2. ESTABLISHED PRODUCT REQUIREMENTS

The selected frontend approach must support:

- One internet-hosted Web Application
- Desktop
- Laptop
- Tablet
- Mobile
- Responsive workflow representation
- Doctor operational surface
- Nurse operational surface
- Doctor/Nurse authority separation
- Patient → Case → Visit → Clinic Day continuity
- Longitudinal Patient History presentation
- Case workflow representation
- Visit workflow representation
- Clinic Day representation
- Error / invalid-action presentation
- Authentication UI boundary
- Authorization-aware UI behavior
- Future API Adapter integration
- Isolated Mock Adapter frontend proof
- No direct frontend-to-database access

## 3. REQUIRED ARCHITECTURAL BOUNDARY

The frontend shall use:

UI
→ Frontend Data / Service Boundary
→ Mock Adapter during isolated frontend proof

and later:

UI
→ Frontend Data / Service Boundary
→ API Adapter
→ Fastify API
→ Application / Domain
→ Persistence
→ Database

The frontend framework must not create a direct database dependency.

## 4. CANDIDATE A — REACT + VITE

### Strengths to evaluate

- Component-based UI architecture
- Mature ecosystem
- Strong support for responsive web application development
- Clear separation between presentation and application/service layers
- Suitable for adapter-based frontend architecture
- Suitable for incremental UI construction

### Risks / costs to evaluate

- Additional dependency surface
- Build-tool configuration
- Ecosystem complexity
- Need to deliberately control state management and component boundaries
- Risk of introducing libraries without architectural need

### Contract impact

No product-contract change required if used strictly as the
frontend implementation layer.

## 5. CANDIDATE B — VUE + VITE

### Strengths to evaluate

- Component-based UI architecture
- Mature web application ecosystem
- Responsive web support
- Suitable for adapter-based architecture
- Relatively direct component authoring model

### Risks / costs to evaluate

- Additional dependency surface
- Build-tool configuration
- Ecosystem choices must remain controlled
- Framework-specific implementation decisions

### Contract impact

No product-contract change required if used strictly as the
frontend implementation layer.

## 6. CANDIDATE C — SVELTE / SVELTEKIT

### Strengths to evaluate

- Component-based frontend model
- Small runtime-oriented approach
- Responsive web support
- Suitable for application UI development

### Risks / costs to evaluate

- Different ecosystem conventions
- Additional framework-specific architectural decisions
- Long-term project familiarity and maintenance considerations
- Need to preserve the same adapter boundary

### Contract impact

No product-contract change required if used strictly as the
frontend implementation layer.

## 7. CANDIDATE D — VANILLA HTML / CSS / JAVASCRIPT

### Strengths to evaluate

- Minimal dependency surface
- Direct browser platform
- No framework lock-in
- Simple initial runtime model

### Risks / costs to evaluate

- More manual component organization
- More manual UI state organization
- Greater risk of inconsistent interaction patterns as workflow grows
- More responsibility for maintainable reusable UI structure

### Contract impact

No product-contract change required if used strictly as the
frontend implementation layer.

## 8. DECISION CRITERIA

The final stack decision shall evaluate:

1. Fit with the established UI requirements
2. Responsive web capability
3. Component and interaction maintainability
4. Suitability for Doctor/Nurse workflow separation
5. Suitability for adapter-based mock/API integration
6. Testability and proofability
7. Dependency complexity
8. Build complexity
9. Long-term maintainability
10. Compatibility with existing Node/Fastify project runtime
11. Ability to preserve architecture boundaries
12. Ability to implement without direct database coupling

## 9. NON-DECISION

This matrix does NOT yet select a frontend stack.

It does NOT authorize:

- frontend dependency installation;
- frontend source creation;
- frontend build configuration;
- frontend implementation;
- API connection;
- database connection;
- authentication implementation;
- authorization middleware implementation.

## 10. CURRENT STATUS

FRONTEND_STACK_SELECTED = NO

FRONTEND_IMPLEMENTATION_AUTHORIZED = NO

FRONTEND_IMPLEMENTATION = NOT PERFORMED

API_CONNECTION = NOT PERFORMED

DATABASE_CONNECTION = NOT PERFORMED

## 11. NEXT GATE

NEXT_GATE =
FRONTEND STACK DECISION REVIEW AND AUTHORIZATION

The next gate shall establish one selected frontend implementation
approach, document the rationale and boundaries, and explicitly
authorize or reject the selected approach before dependencies or
frontend source are created.
