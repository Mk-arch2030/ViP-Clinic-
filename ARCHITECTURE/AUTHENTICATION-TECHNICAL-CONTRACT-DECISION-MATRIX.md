# Authentication Technical Contract — Decision Matrix V1

STATUS = CONTROLLED DEFINITION
GAP = G01 — AUTHENTICATION
IMPLEMENTATION_AUTHORIZED = NO
CONTRACT_MUTATION = NOT PERFORMED

## 1. DECISION SCOPE

This matrix evaluates authentication design choices required by the
Authentication Technical Contract before implementation.

No implementation mechanism is selected by this artifact.

## 2. AUTHENTICATION MECHANISM

OPTIONS:
- Local application-managed authentication
- External Identity Provider
- Hybrid authentication

CURRENT DECISION = OPEN

## 3. CREDENTIAL MODEL

OPTIONS:
- Password-based credentials
- Passwordless credentials
- External identity credentials
- Hybrid credential model

CURRENT DECISION = OPEN

## 4. SESSION / TOKEN MODEL

OPTIONS:
- Server-managed session
- Stateless token
- Hybrid session/token model
- No persistent authenticated session

CURRENT DECISION = OPEN

## 5. IDENTITY REPRESENTATION

REQUIRED:
- Stable authenticated identity
- Explicit association with Doctor or Nurse actor
- Separation between identity and authorization
- No authority transfer through authentication

CURRENT DECISION = OPEN

## 6. FAILURE MODEL

MUST DEFINE:
- Unauthenticated request
- Invalid credential
- Expired authentication state
- Revoked authentication state
- Malformed authentication material
- Authentication failure versus authorization failure

CURRENT DECISION = OPEN

## 7. API AUTHENTICATION BOUNDARY

MUST DEFINE:
- Authentication entry boundary
- Authenticated request boundary
- Authentication failure behavior
- Relationship to Authorization Technical Contract

CURRENT DECISION = OPEN

## 8. PERSISTENCE AUTHENTICATION BOUNDARY

MUST DEFINE:
- Whether authentication requires persistence
- What conceptual authentication data must exist
- Protection requirements

MUST NOT DEFINE:
- SQL schema
- Tables
- Migrations
- ORM
- Repository implementation

CURRENT DECISION = OPEN

## 9. SECURITY REQUIREMENTS

MUST DEFINE:
- Credential protection
- Authenticated-state protection
- Credential lifecycle
- Revocation behavior
- Recovery behavior if applicable

CURRENT DECISION = OPEN

## 10. DEPLOYMENT BOUNDARY

MUST DEFINE LATER:
- Production authentication transport requirements
- Secret handling
- TLS requirements
- Hosting/runtime relationship

CURRENT DECISION = OPEN

## 11. CROSS-CONTRACT INVARIANTS

DOCTOR_AUTHORITY = PRESERVED
NURSE_DELEGATION = PRESERVED
AUTHORITY_TRANSFER = NO
NEW_ACTOR = NO
NEW_PRODUCT_CAPABILITY = NO
IMPLEMENTATION_AUTHORIZED = NO

## 12. NEXT DECISION

NEXT_GATE = AUTHENTICATION TECHNICAL CONTRACT OPTION ANALYSIS
