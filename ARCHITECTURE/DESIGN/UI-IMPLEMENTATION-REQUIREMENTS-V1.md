# DR. ROBY CLINIC — UI IMPLEMENTATION REQUIREMENTS V1

DOCUMENT = UI IMPLEMENTATION REQUIREMENTS V1
STATUS = REQUIREMENTS DEFINITION
IMPLEMENTATION = NOT PERFORMED
FRONTEND_IMPLEMENTATION_AUTHORIZED = NO

## 1. SOURCE AUTHORITY

This requirements definition is derived from the established UI,
Human Design, API, Authentication, Authorization, and Workflow
State Machine technical contracts.

No requirement in this document creates new product authority,
new clinical capability, new Nurse permission, new API route,
new persistence behavior, or implementation authorization.

## 2. PRODUCT SURFACE

The product shall be one internet-hosted Web Application supporting:

- Desktop
- Laptop
- Tablet
- Mobile

The product interaction model shall remain device-independent at
the product level.

Future installable / PWA behavior remains product direction only
and is not part of the current implementation scope.

## 3. DOCTOR SURFACE

The Doctor interaction surface shall support, at minimum:

- Patients
- Patient data
- Selected Patient inspection
- New Patient registration
- Continuing Patients and Cases
- Current Clinic Day
- Clinic Day counter
- Clinic Day status
- Clinic Day lifecycle
- Patients awaiting Doctor
- Patients with Doctor
- Relevant open Cases
- Patient continuity

The Clinic Day shall remain visible even when its daily patient
or case count is zero.

## 4. PATIENT IDENTITY AND JOURNEY

The UI shall preserve:

Patient
→ Case
→ Visit
→ Clinic Day

Patient identity shall remain stable.

Name, CPN, and Barcode retrieval shall resolve to the same Patient.

A returning Patient shall continue through the applicable existing
Case.

A follow-up shall create a new Visit.

A previous Visit shall never be overwritten by a follow-up.

The UI shall prevent duplicate Patient identity creation.

## 5. VISIT ENTRY

The interaction flow shall support:

Patient arrives
→ Patient registered/retrieved
→ Visit recorded
→ Visit Type = Visit & Consultation
→ Patient waits for or enters Doctor encounter

Each Visit shall remain distinct from previous Visits.

A Visit shall not exist without its required Case and Clinic Day
relationship.

## 6. DOCTOR ENCOUNTER

During an active Visit, the Doctor surface shall support:

- Patient information review
- Past History review
- Clinical History review
- Continuing Case review
- Examination
- Clinical information recording
- Doctor clinical decision

The Doctor remains the Clinical Authority.

Detailed Vital Signs remain a Doctor-facing clinical capability.

## 7. CLINICAL HISTORY

The UI shall preserve the distinction between:

- Past History
- Clinical History

Clinical History shall be represented from accumulated recorded
Visits.

Previous Visits shall remain meaningful and shall not be replaced
by later Visits.

The visual interaction shall not imply that Clinical History is an
independent persisted source of truth.

## 8. CASE WORKFLOW

The Case workflow shall preserve the authoritative states:

- New
- Awaiting Doctor
- With Doctor
- Awaiting Follow-up
- Completed

Only the Doctor may establish Case Completion.

Visit Exit shall not automatically complete a Case.

Clinic Day Closure shall not automatically complete a Case.

Completed Cases shall not return to an active Case state.

Invalid workflow transitions shall not mutate Case state.

## 9. CLINIC DAY

The Clinic Day surface shall remain intentionally simple.

It shall expose relevant operational context including:

- Working day
- Counter
- Status
- Lifecycle
- Patients / Cases relevant to the day

Clinic Day closure remains Doctor-authorized.

Clinic Day closure shall not complete an open Case.

## 10. NURSE SURFACE

The Nurse is an Operational Workflow Participant only.

The Nurse interaction surface shall expose only the approved delegated
operational capabilities:

1. Patient Entry / Arrival
2. Patient Data Recording
3. Patient Exit
4. Doctor Notification

The Nurse shall not receive:

- Clinical Authority
- Main Admin authority
- System Ownership
- Case Completion authority
- Independent clinical amendment authority
- Authority to expand or transfer Nurse permissions

The UI shall never visually imply transfer of Doctor authority to Nurse.

## 11. NURSE DELEGATION MODES

The product shall preserve the two authorized Nurse delegation modes:

### FULL OPERATIONAL DELEGATION

The Nurse may execute the four approved operational capabilities
within the Doctor-controlled delegation boundary.

### LIMITED OPERATIONAL DELEGATION

The Doctor selects the approved subset of the four operational
capabilities.

The Nurse may execute only the currently selected capabilities.

The Nurse cannot modify or expand the Nurse's own delegation scope.

## 12. NURSE INTAKE

The Nurse surface may support authorized operational intake including:

- Patient identity information
- Authorized patient data
- Current Complaint
- Initial Past History information when delegated
- Arrival Patient Condition
- Doctor Notification

Arrival Patient Condition is a Visit-level observation:

- Normal
- Moderately Unwell
- Severely Unwell

Arrival Patient Condition is not a replacement for Doctor Vital Signs
or Doctor clinical decision-making.

## 13. SEND TO DOCTOR

The Nurse interaction shall represent:

Send to Doctor
→ Doctor Notification
→ Awaiting Doctor
→ Doctor workflow visibility

The exact technical state transition and API operation remain subject
to their respective implementation definitions.

## 14. VISIT EXIT

Visit Exit shall:

- preserve the Visit;
- preserve Clinical History;
- not automatically complete the Case.

Where delegated operational workflow is active, the Nurse may perform
authorized Visit Exit according to Doctor delegation.

## 15. ERROR / INVALID ACTION BOUNDARY

The UI implementation shall respect and surface the established
invalid-action boundaries.

At minimum, the system shall prevent or reject:

- Duplicate Patient identity
- Visit without Case
- Visit without Clinic Day
- Case completion by Nurse
- Cross-Visit clinical overwrite
- Unauthorized clinical amendment
- Invalid Case state transition
- Unauthorized Nurse capability execution

Exact error presentation remains implementation-defined.

## 16. AUTHENTICATION BOUNDARY

Authentication shall establish authenticated actor identity before
authorization is applied.

The selected technical authentication contract establishes:

- Local application-managed authentication
- Server-managed authenticated session
- Authentication distinct from authorization
- Logout invalidates authenticated state
- Session expiration is enforced
- Session revocation is supported

Authentication shall not transfer or create product authority.

Authentication UI and exact routes remain implementation-defined
until their implementation definition is authorized.

## 17. AUTHORIZATION BOUNDARY

Authorization shall remain governed by the established
Authorization Technical Contract.

The UI shall not invent permissions.

Doctor authority remains Doctor authority.

Nurse delegation remains Doctor-controlled.

The UI shall not expose protected clinical information through a
path that bypasses authorization.

## 18. API BOUNDARY

The frontend shall not connect directly to the database.

The frontend shall communicate through the application/API boundary.

The frontend shall preserve:

- Patient identity
- Patient → Case → Visit → Clinic Day relationships
- Visit chronology
- Past History / Clinical History distinction
- Visit Protection State
- Case lifecycle
- Doctor authority
- Nurse delegation
- Cross-Visit protection

Exact API routes, methods, payloads, response envelopes, error
schemas, and authentication transport remain undefined until their
separate implementation definition and authorization.

## 19. FRONTEND DATA BOUNDARY

The frontend implementation shall be designed so that the UI is
independent from the final persistence implementation.

The runtime sequencing may use:

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

The frontend shall not contain direct database access.

## 20. RESPONSIVE REQUIREMENTS

The same approved workflow shall remain usable across:

- Desktop
- Laptop
- Tablet
- Mobile

Exact responsive breakpoints, CSS architecture, component structure,
visual styling, and device-specific layout remain implementation
decisions.

## 21. EXPLICITLY UNDEFINED

The following are not selected by this requirements definition:

- Frontend framework
- Frontend build tool
- Exact component library
- Exact CSS strategy
- Exact breakpoints
- Exact navigation implementation
- Exact screen/component tree
- API route names
- HTTP methods
- API payload schemas
- API response envelopes
- Authentication UI
- Authentication route implementation
- Session implementation code
- Authorization middleware implementation
- Database access implementation
- Deployment implementation

## 22. EXPLICITLY OUT OF SCOPE

This requirements definition does not authorize:

- New Nurse permissions
- New clinical authority
- Authority transfer
- Case completion by Nurse
- Direct frontend-to-database access
- New product domains
- Billing
- Pharmacy
- Insurance
- Hospital workflows
- LIMS workflows
- ERP
- CRM
- AI diagnosis
- Multi-branch behavior
- Multi-tenant behavior
- Uncontracted scheduling
- Uncontracted capabilities
- Silent contract mutation

## 23. IMPLEMENTATION STATUS

REQUIREMENTS_EXTRACTION = COMPLETE

REQUIREMENTS_DEFINITION = ESTABLISHED

FRONTEND_STACK_SELECTED = NO

FRONTEND_IMPLEMENTATION_AUTHORIZED = NO

FRONTEND_IMPLEMENTATION = NOT PERFORMED

API_IMPLEMENTATION = NOT PERFORMED

DATABASE_RUNTIME_CONNECTION = NOT PERFORMED

END_TO_END_IMPLEMENTATION = NOT PERFORMED

## 24. NEXT GATE

NEXT_GATE =
FRONTEND IMPLEMENTATION DEFINITION AND STACK DECISION REVIEW

The next gate shall define the frontend technical implementation
boundary and evaluate/select a frontend stack without mutating the
closed product, UI, API, Authentication, Authorization, Persistence,
or Workflow contracts.
