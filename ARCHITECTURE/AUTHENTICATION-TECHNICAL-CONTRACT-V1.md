# DR. ROBY CLINIC — AUTHENTICATION TECHNICAL CONTRACT V1

DOCUMENT = AUTHENTICATION TECHNICAL CONTRACT
VERSION = V1
PHASE = TECHNICAL CONTRACT DEFINITION
STATUS = CONTROLLED AMENDMENT

AUTHORITY =
PRODUCT MANUSCRIPT
+ CONTRACT-03 ACTOR AUTHORITY
+ APPLICATION CAPABILITY CONTRACT V1
+ AUTHORIZATION TECHNICAL CONTRACT V1
+ PERSISTENCE TECHNICAL CONTRACT V1
+ API TECHNICAL CONTRACT V1
+ BUILD AUTHORIZATION G01 DECISION

---

## 1. PURPOSE

This document defines the technical authentication boundary required to
establish authenticated identity before authorization is applied.

This document does not introduce new Product capabilities.

This document does NOT implement:
- authentication code;
- login routes;
- passwords or credential storage;
- sessions;
- tokens;
- database schema or migrations;
- API handlers;
- UI;
- authorization middleware;
- deployment;
- runtime infrastructure.

---

## 2. AUTHORITY CHAIN

Authentication MUST conform to the established authority chain:

Product Manuscript
→ Actor Authority
→ Application Capability Contract
→ Authorization Technical Contract
→ Persistence Technical Contract
→ API Technical Contract
→ Authentication Technical Contract

Authentication establishes authenticated identity.
Authorization determines what that authenticated actor may do.

Authentication MUST NOT transfer or create product authority.

---

## 3. ACTOR BOUNDARY

The approved product actors remain:

- Doctor
- Nurse

Doctor remains:
- Main Admin;
- Clinical Authority;
- System Owner.

Nurse remains:
- delegated Operational Workflow Participant.

Authentication MUST NOT create:
- a new product actor;
- a second owner;
- additional Nurse authority;
- authority transfer from Doctor to Nurse.

---

## 4. IDENTITY BOUNDARY

The authentication definition MUST establish:

- how a Doctor identity is represented;
- how a Nurse identity is represented;
- how an authenticated identity is associated with an approved actor;
- what stable identity reference is used across authenticated requests;
- how unauthenticated requests are distinguished from authenticated requests.

The identity boundary MUST remain separate from authorization decisions.

---

## 5. CREDENTIAL BOUNDARY

The technical authentication definition MUST deliberately select:

- credential type;
- credential acquisition flow;
- credential verification mechanism;
- credential protection requirements;
- credential lifecycle;
- credential recovery/reset behavior, if required.

No credential mechanism is assumed by this contract.

In particular, this contract MUST NOT assume:
- passwords;
- API keys;
- JWT;
- opaque tokens;
- server sessions;
- external identity providers.

---

## 6. AUTHENTICATION STATE

The technical definition MUST establish the minimum authentication states
required by the product.

At minimum, it MUST distinguish:

- unauthenticated;
- authenticated.

Any additional authentication state MUST have an explicit technical reason.

Authentication state MUST NOT be confused with:
- Case state;
- Visit state;
- Clinic Day state;
- authorization role;
- product completion or closure state.

---

## 7. SESSION / TOKEN BOUNDARY

If the selected authentication mechanism uses sessions or tokens, the
technical contract MUST define:

- issuance;
- validation;
- expiration;
- revocation;
- renewal/rotation, where applicable;
- logout/invalidation behavior;
- protection against reuse of invalid authentication state.

If the selected mechanism does not use sessions or tokens, that absence
MUST be explicit.

---

## 8. FAILURE BOUNDARY

The technical definition MUST establish behavior for:

- missing credentials;
- invalid credentials;
- expired authentication state;
- revoked authentication state;
- malformed authentication material;
- unauthorized access after successful authentication.

Authentication failure MUST NOT be treated as authorization failure.

---

## 9. AUTHORIZATION RELATIONSHIP

Successful authentication establishes identity only.

Authorization remains governed by:
AUTHORIZATION TECHNICAL CONTRACT V1.

Authentication MUST NOT:
- decide Nurse permissions;
- create permission matrices;
- complete Cases;
- close Clinic Days;
- alter Doctor authority;
- alter Nurse delegation.

---

## 10. API BOUNDARY

The authentication definition MUST deliberately establish the authentication
boundary exposed through the Web Application API.

It MUST define, before implementation:

- authentication entry boundary;
- authenticated request boundary;
- authentication failure boundary;
- transport mechanism;
- required request/response behavior at the authentication boundary.

Exact routes, handlers, framework code, and runtime behavior remain
implementation concerns until separately authorized.

---

## 11. PERSISTENCE BOUNDARY

If authentication requires persistence, the authentication definition MUST
identify the required conceptual persistence responsibility without selecting
SQL, tables, migrations, ORM, or repository implementation.

Authentication persistence MUST NOT overwrite or redefine:
- Patient identity;
- CPN;
- Case;
- Visit;
- Clinic Day;
- Clinical History;
- Past History.

---

## 12. SECURITY BOUNDARY

The technical definition MUST establish the security requirements necessary
to protect authentication credentials and authenticated state.

No specific security framework or library is selected by this draft.

---

## 13. DEPLOYMENT BOUNDARY

Deployment-specific authentication behavior remains undefined until the
deployment architecture is separately defined.

This document does not authorize:
- hosting configuration;
- TLS deployment;
- environment secrets;
- reverse proxy configuration;
- production infrastructure.

---

## 14. IMPLEMENTATION PROHIBITION

This contract definition does not authorize implementation.

The following remain prohibited until separately authorized:

- login implementation;
- credential implementation;
- password storage;
- session implementation;
- token implementation;
- authentication middleware;
- authentication API routes;
- authentication UI;
- database implementation;
- deployment implementation.

---

## CONTROLLED AMENDMENT — ACTOR IDENTITY REPRESENTATION

IDENTITY_REPRESENTATION = STABLE_ACTOR_IDENTITY_REFERENCE
IDENTITY_REFERENCE_STABLE_ACROSS_AUTHENTICATED_REQUESTS = YES
ACTOR_IDENTITY_DISTINCT_FROM_PERSISTENCE_KEY = YES
UUID_VS_NUMERIC = DEFERRED
IMPLEMENTATION = NOT AUTHORIZED

## 15. REQUIRED NEXT DECISION

The following technical decisions remain open:

- AUTHENTICATION_MECHANISM = LOCAL_APPLICATION_MANAGED
- CREDENTIAL_MODEL = PASSWORD_BASED
- SESSION_TOKEN_MODEL = SERVER_MANAGED_SESSION
- IDENTITY_REPRESENTATION = STABLE_ACTOR_IDENTITY_REFERENCE
- FAILURE_MODEL = OPEN
- API_AUTHENTICATION_BOUNDARY = OPEN
- PERSISTENCE_AUTHENTICATION_BOUNDARY = OPEN
- SECURITY_REQUIREMENTS = OPEN
- DEPLOYMENT_AUTHENTICATION_BOUNDARY = OPEN

IMPLEMENTATION_AUTHORIZED = NO
CONTRACT_MUTATION = PERFORMED
NEXT_GATE = AUTHENTICATION CONTRACT RECONCILIATION AND PROOF

---

## CONTROLLED COMPLETION AMENDMENT — TECHNICAL DEFINITION

STATUS = CONTROLLED AMENDMENT
IMPLEMENTATION_AUTHORIZED = NO
PURPOSE = COMPLETE AUTHENTICATION TECHNICAL DEFINITION

FAILURE_MODEL = NORMALIZED_AUTHENTICATION_FAILURE_BOUNDARY

FAILURE_CLASSES:
- Missing credentials
- Invalid credentials
- Malformed authentication material
- Expired authenticated state
- Revoked authenticated state
- Authentication state unavailable

AUTHENTICATION_FAILURE_DISTINCT_FROM_AUTHORIZATION_FAILURE = YES
AUTHENTICATION_FAILURE_MUST_NOT_REVEAL_SENSITIVE_CREDENTIAL_DETAILS = YES
AUTHENTICATION_FAILURE_MUST_NOT_TRANSFER_AUTHORITY = YES

API_AUTHENTICATION_BOUNDARY = SERVER_SIDE_AUTHENTICATION_PRECONDITION
AUTHENTICATED_REQUEST = REQUEST_WITH_VALID_SERVER_MANAGED_AUTHENTICATED_STATE
API_AUTHENTICATION_EXECUTION_POINT = SERVER_REQUEST_AUTHENTICATION_BOUNDARY
INVALID_OR_MISSING_AUTHENTICATED_STATE = AUTHENTICATION_FAILURE
AUTHENTICATION_SUCCESS = ESTABLISH_AUTHENTICATED_ACTOR_IDENTITY_FOR_REQUEST

API_AUTHENTICATION_MUST_NOT:
- create an Actor
- change Actor Role
- transfer Authority
- grant Delegation
- complete a Case
- close a Clinic Day

PERSISTENCE_AUTHENTICATION_BOUNDARY = APPLICATION_MANAGED_AUTHENTICATION_DATA

PERSISTENCE_MAY_REPRESENT:
- Actor authentication credential material
- Server-managed authenticated session state
- Authentication lifecycle state required by this contract

PERSISTENCE_MUST_NOT_REDEFINE:
- Patient identity
- Clinic Patient Number
- Case
- Visit
- Clinic Day
- Clinical History
- Past History
- Actor domain authority

PASSWORD_PLAINTEXT_STORAGE = PROHIBITED
SESSION_PERSISTENCE = SERVER_MANAGED_APPLICATION_STATE
DATABASE_SCHEMA = DEFERRED_TO_PERSISTENCE_IMPLEMENTATION_DESIGN
MIGRATION = DEFERRED_TO_PERSISTENCE_IMPLEMENTATION_DESIGN
ORM = DEFERRED

SECURITY_REQUIREMENTS = CONTROLLED

REQUIRED_SECURITY_PROPERTIES:
- Password plaintext storage prohibited
- Credential material protected
- Session identifiers protected
- Authentication state protected
- Authentication errors do not disclose credential secrets
- Session expiration enforced
- Session revocation supported
- Logout invalidates authenticated state
- Recovery/reset requires controlled authorization
- Authentication state must not transfer Actor authority
- Transport protection required for deployed authenticated traffic
- Secrets must not be hard-coded into source
- Production secrets must be supplied through protected deployment configuration

SECURITY_LIBRARY_SELECTION = NOT REQUIRED AT CONTRACT LEVEL

DEPLOYMENT_AUTHENTICATION_BOUNDARY = PROTECTED_DEPLOYED_APPLICATION_BOUNDARY

DEPLOYMENT_REQUIREMENTS:
- Authentication traffic MUST use protected transport in deployed environments.
- Authentication secrets MUST NOT be committed to source control.
- Environment-specific authentication secrets MUST be externally supplied.
- Production configuration MUST NOT use development credentials.
- Reverse proxy / TLS details remain deployment-architecture concerns.
- Deployment implementation remains unauthorized.

CREDENTIAL_MODEL = PASSWORD_BASED
PASSWORD_STORAGE = ONE_WAY_PASSWORD_VERIFIER
PASSWORD_PLAINTEXT_STORAGE = PROHIBITED
PASSWORD_VERIFICATION = SERVER_SIDE_VERIFICATION
PASSWORD_HASHING_ALGORITHM = NODE_RUNTIME_CRYPTOGRAPHIC_PASSWORD_HASHING
EXACT_COST_PARAMETERS = DEFERRED_TO_IMPLEMENTATION_SECURITY_CONFIGURATION
EXACT_LIBRARY = NODE_RUNTIME_CRYPTOGRAPHY_CAPABILITY
PASSWORD_RECOVERY = CONTROLLED_APPLICATION_FLOW

SESSION_TOKEN_MODEL = SERVER_MANAGED_SESSION
SESSION_STATE = SERVER_SIDE_AUTHENTICATED_STATE
CLIENT_PRESENTS = SESSION_IDENTIFIER
SERVER_VALIDATES = SESSION_IDENTIFIER_AND_SESSION_STATE
SESSION_EXPIRATION = REQUIRED
SESSION_REVOCATION = REQUIRED
LOGOUT_INVALIDATION = REQUIRED
SESSION_RENEWAL = CONTROLLED
SESSION_ROTATION = REQUIRED_WHEN_SESSION_SECURITY_REQUIRES_IT
SESSION_REUSE_PROTECTION = REQUIRED

SESSION_MUST_IDENTIFY:
- Authenticated Actor Identity
- Authentication state
- Session lifecycle state

SESSION_MUST_NOT_CREATE_AUTHORITY = YES

UUID_VS_NUMERIC = DEFERRED_FROM_AUTHENTICATION_CONTRACT
PERSISTENCE_KEY_ENCODING = DEFERRED_TO_PERSISTENCE_IMPLEMENTATION_DESIGN

OPEN_AUTHENTICATION_TECHNICAL_DECISIONS = 0

IMPLEMENTATION_AUTHORIZED = NO
CONTRACT_MUTATION = PERFORMED

NEXT_GATE = AUTHENTICATION CONTRACT RECONCILIATION AND PROOF

---

END OF CONTROLLED AUTHENTICATION COMPLETION AMENDMENT
