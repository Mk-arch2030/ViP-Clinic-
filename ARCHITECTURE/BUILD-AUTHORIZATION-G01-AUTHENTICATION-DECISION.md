# DR. ROBY CLINIC — BUILD AUTHORIZATION G01 AUTHENTICATION DECISION

STATUS = TECHNICAL DEFINITION DECISION
GAP = G01 — AUTHENTICATION

EVIDENCE:
- API Decision Register A08 = OPEN.
- Authentication requires its own deliberate technical definition.
- Authorization Technical Contract does not define authentication, sessions, tokens, or security mechanisms.
- API Technical Contract does not select authentication transport.
- Actor Authority Contract does not authorize authentication or session implementation.
- Application Capability Contract deliberately leaves authentication and session mechanism undefined.

DECISION:
G01 = TECHNICAL CONTRACT REQUIRED

SCOPE:
A dedicated Authentication Technical Contract must define the approved authentication boundary before implementation.

MUST DEFINE:
- authentication actors and identity boundary;
- credential model;
- authentication mechanism;
- session/token model;
- authentication lifecycle;
- authentication failure boundary;
- relationship to the established Doctor/Nurse authority model;
- implementation authorization boundary.

MUST NOT ASSUME:
- JWT;
- server sessions;
- password storage model;
- external identity provider;
- any specific authentication framework;
- any implementation mechanism not deliberately selected by contract.

INVARIANTS:
- Doctor remains Main Admin / Clinical Authority / System Owner.
- Nurse remains delegated Operational Workflow Participant.
- Authentication does not transfer authority.
- Authorization remains governed by the existing Authorization Technical Contract.
- No new Nurse authority is created.
- No implementation is authorized by this decision.

IMPLEMENTATION_AUTHORIZED = NO
CONTRACT_MUTATION = NOT PERFORMED
NEXT_GATE = AUTHENTICATION TECHNICAL CONTRACT DEFINITION
