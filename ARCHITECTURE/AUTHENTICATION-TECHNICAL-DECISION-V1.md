# Authentication Technical Decision V1

STATUS = TECHNICAL DECISION
GAP = G01 — AUTHENTICATION
IMPLEMENTATION_AUTHORIZED = NO
CONTRACT_MUTATION = NOT PERFORMED

## 1. DECISION

AUTHENTICATION_MECHANISM = LOCAL_APPLICATION_MANAGED

CREDENTIAL_MODEL = PASSWORD_BASED

SESSION_TOKEN_MODEL = SERVER_MANAGED_SESSION

EXTERNAL_IDENTITY_PROVIDER = NO

JWT_REQUIRED = NO

## 2. DECISION BASIS

The selected model is intentionally simple and appropriate to the
current clinic product boundary:

- Doctor and Nurse are the established actors.
- The application is a single clinic web application.
- Authentication must establish identity before authorization.
- Authorization remains governed by the existing Authorization Technical Contract.
- No external identity provider is currently required by the product contract.
- No stateless token architecture is currently required by the product contract.
- Authentication complexity should remain proportional to the product scope.

## 3. IDENTITY

AUTHENTICATED_IDENTITY = ONE_ESTABLISHED_ACTOR

ALLOWED_ACTORS:
- Doctor
- Nurse

Authentication establishes identity only.

Authentication MUST NOT grant or transfer authority.

## 4. CREDENTIALS

Credential type = password-based.

Credentials MUST:
- never be stored in plaintext;
- be protected using an appropriate password hashing mechanism;
- support verification;
- have an explicit lifecycle;
- have an explicit recovery/reset policy before implementation.

Exact hashing library/algorithm is an implementation decision and is
NOT selected by this artifact.

## 5. SESSION

Authenticated browser state = server-managed session.

The final technical contract MUST define:
- session issuance;
- session validation;
- expiration;
- logout/invalidation;
- revocation;
- protection against session misuse.

Exact framework/session library is NOT selected by this artifact.

## 6. FAILURE MODEL

AUTHENTICATION_FAILURE is distinct from AUTHORIZATION_FAILURE.

Authentication failures include:
- missing credentials;
- invalid credentials;
- expired session;
- revoked session;
- malformed authentication material.

Authorization failure occurs after identity is established but the
authenticated actor lacks the requested capability.

## 7. AUTHORIZATION RELATIONSHIP

Authentication establishes:

WHO IS THE ACTOR?

Authorization establishes:

WHAT MAY THE ACTOR DO?

Doctor authority remains unchanged.

Nurse delegation remains unchanged.

AUTHORITY_TRANSFER = NO

## 8. PERSISTENCE

Authentication persistence remains conceptually separate from:

Patient
Case
Visit
Clinic Day
Clinical History
Past History

Authentication data MUST NOT redefine or mutate the clinical domain model.

## 9. API BOUNDARY

The API layer will later expose the authenticated-request boundary
defined by the Authentication Technical Contract.

Exact routes, HTTP methods, framework handlers, middleware, and response
implementation remain outside this decision.

## 10. SECURITY

The implementation must provide appropriate protection for:
- stored credentials;
- authenticated sessions;
- authentication transport;
- session lifecycle;
- credential recovery.

Exact production security configuration remains subject to the
technical contract and deployment definition.

## 11. EXPLICITLY NOT SELECTED

JWT = NOT REQUIRED
EXTERNAL_IDP = NOT REQUIRED
OAUTH = NOT REQUIRED
API_KEY_AUTHENTICATION = NOT SELECTED
FRAMEWORK = NOT SELECTED
SESSION_LIBRARY = NOT SELECTED
PASSWORD_HASH_LIBRARY = NOT SELECTED
DEPLOYMENT_PROVIDER = NOT SELECTED

## 12. IMPLEMENTATION GATE

TECHNICAL_DECISION = ESTABLISHED

CONTRACT_MUTATION = NOT PERFORMED

IMPLEMENTATION_AUTHORIZED = NO

NEXT_GATE = AUTHENTICATION TECHNICAL CONTRACT CONTROLLED MUTATION
