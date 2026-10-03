# API SERVER BOOTSTRAP SOURCE IMPLEMENTATION AUTHORIZATION V1

## 1. DOCUMENT IDENTITY

DOCUMENT = API-SERVER-BOOTSTRAP-SOURCE-IMPLEMENTATION-AUTHORIZATION-V1
PURPOSE = AUTHORIZE_MINIMUM_CURRENT_BOOTSTRAP_SOURCE_IMPLEMENTATION
SCOPE = BOOTSTRAP_SOURCE_ONLY
IMPLEMENTATION_EXECUTION = NOT_PERFORMED_BY_THIS_DOCUMENT

## 2. CURRENT AUTHORITY BASELINE

CURRENT_API_AUTHORITY_REESTABLISHMENT = ESTABLISHED
CURRENT_API_AUTHORITY = PARTIALLY_GRANTED
CURRENT_API_AUTHORITY_SCOPE = REGISTER_NEW_PATIENT_ONLY

PERSISTENCE_COMPLETE_CLOSURE = CLOSED
PERSISTENCE_LIVE_RECONCILIATION = CLOSED
DATA_PRESERVATION = PROVEN
ROLLBACK_SAFETY = PROVEN

API_SERVER_FRAMEWORK = FASTIFY
NODE_VERSION = v26.4.0
FASTIFY_VERSION = 5.12.5

## 3. PURPOSE OF THIS AUTHORIZATION

This decision establishes a separate and bounded authorization for
the source implementation of the Clinic API Server Bootstrap.

The authorization exists only to materialize the already-defined
server runtime boundary.

This decision MUST NOT be interpreted as authorization for API
business implementation, persistence implementation, authentication,
authorization, UI, deployment, production use, or real use.

## 4. AUTHORITY BASIS

This decision is subordinate to and MUST preserve:

- API-SERVER-FRAMEWORK-DECISION-V1.md
- API-SERVER-BOOTSTRAP-CONTRACT-V1.md
- API-SERVER-BOOTSTRAP-TECHNICAL-DECISION-V1.md
- API-SERVER-BOOTSTRAP-CONTRACT-RECONCILIATION-V1.md
- API-SERVER-RUNTIME-CONTRACT-V1.md
- API-SERVER-RUNTIME-CONTRACT-CLOSURE-V1.md
- BUILD-AUTHORIZATION-API-SERVER-RUNTIME-V1.md
- API-AUTHORITY-REESTABLISHMENT-DECISION-V1.md

No closed authority is reopened or reinterpreted by this decision.

## 5. AUTHORIZATION RESULT

BOOTSTRAP_SOURCE_IMPLEMENTATION_AUTHORIZATION = TO_BE_DECIDED

SERVER_SOURCE_IMPLEMENTATION = TO_BE_DECIDED
SERVER_STARTUP_IMPLEMENTATION = TO_BE_DECIDED

API_ROUTES = NOT_AUTHORIZED
BUSINESS_ENDPOINTS = NOT_AUTHORIZED
HEALTH_ENDPOINT = NOT_AUTHORIZED

AUTHENTICATION_IMPLEMENTATION = NOT_AUTHORIZED
AUTHORIZATION_IMPLEMENTATION = NOT_AUTHORIZED
PERSISTENCE_IMPLEMENTATION = NOT_AUTHORIZED
UI_IMPLEMENTATION = NOT_AUTHORIZED
DEPLOYMENT_IMPLEMENTATION = NOT_AUTHORIZED
PRODUCTION_USE = NOT_AUTHORIZED
REAL_USE = NOT_AUTHORIZED
REAL_PILOT = NOT_AUTHORIZED

## 6. IMPLEMENTATION PRINCIPLE

Any eventual authorization MUST be limited to the minimum source
required to materialize the already-defined Bootstrap Contract.

No implementation may silently resolve an architectural gap.

No new product capability may be introduced.

No actor or authority may be introduced or transferred.

No persistence behavior may be introduced.

No API business behavior may be introduced.

FAIL = 0

## 7. BOOTSTRAP SOURCE AUTHORITY BOUNDARY

The authorized bootstrap source, if granted by the final decision,
MUST be limited to server-runtime initialization.

The source boundary may include only:

- Fastify server instance creation.
- Explicit application start behavior.
- Environment-based PORT resolution.
- Environment-based HOST resolution.
- Development-safe default HOST.
- Development-safe default PORT.
- Graceful shutdown signal registration.
- Controlled server startup and shutdown behavior.

The source boundary MUST NOT include:

- API route registration.
- Controller registration.
- Application service invocation.
- Business endpoint implementation.
- Health endpoint implementation.
- Database pool creation.
- Database connection management.
- Repository wiring.
- SQL execution.
- Transaction management.
- Authentication.
- Authorization.
- Session management.
- Credential handling.
- UI behavior.
- Deployment behavior.
- Production configuration.

## 8. STARTUP BOUNDARY

STARTUP_MODEL = EXPLICIT_APPLICATION_START

SERVER_STARTUP_AUTOMATIC_ON_IMPORT = NO

SERVER_STARTUP_SCOPE =
BOOTSTRAP_RUNTIME_ONLY

APPLICATION_START_SCOPE =
SERVER_INITIALIZATION_AND_LISTEN_ONLY

BUSINESS_OPERATION_EXECUTION_DURING_STARTUP = PROHIBITED

DATABASE_ACCESS_DURING_STARTUP = PROHIBITED

PERSISTENCE_MUTATION_DURING_STARTUP = PROHIBITED

AUTHENTICATION_DURING_STARTUP = PROHIBITED

AUTHORIZATION_DURING_STARTUP = PROHIBITED

## 9. NETWORK BOUNDARY

ENVIRONMENT = DEVELOPMENT

PORT_SOURCE = ENVIRONMENT_VARIABLE
PORT_DEFAULT = 3000

HOST_SOURCE = ENVIRONMENT_VARIABLE
HOST_DEFAULT = 127.0.0.1

DEVELOPMENT_EXTERNAL_NETWORK_EXPOSURE = NOT_AUTHORIZED

PUBLIC_NETWORK_EXPOSURE = NOT_AUTHORIZED

PRODUCTION_NETWORK_EXPOSURE = NOT_AUTHORIZED

The bootstrap implementation MUST NOT silently change the
development host from the defined loopback default.

## 10. SHUTDOWN BOUNDARY

SHUTDOWN_MODEL = GRACEFUL

SHUTDOWN_SIGNALS = SIGINT + SIGTERM

SHUTDOWN_SCOPE =
SERVER_RUNTIME_ONLY

SHUTDOWN_MUST_NOT_IMPLEMENT:

- business workflow closure
- Clinic Day closure
- database transaction completion
- persistence migration
- data mutation
- authentication state management
- authorization state management
- deployment lifecycle

FAIL = 0

## 11. SOURCE FILE BOUNDARY

SERVER_SOURCE_FILE = TO_BE_DEFINED_BY_IMPLEMENTATION

SERVER_SOURCE_LOCATION = BACKEND_SERVER_RUNTIME_ONLY

SERVER_SOURCE_MUST_REMAIN_WITHIN =
ESTABLISHED_API_SERVER_RUNTIME_BOUNDARY

NEW_DOMAIN_SOURCE = NOT_AUTHORIZED

NEW_APPLICATION_SERVICE_SOURCE = NOT_AUTHORIZED

NEW_REPOSITORY_SOURCE = NOT_AUTHORIZED

NEW_DATABASE_SOURCE = NOT_AUTHORIZED

NEW_AUTHENTICATION_SOURCE = NOT_AUTHORIZED

NEW_AUTHORIZATION_SOURCE = NOT_AUTHORIZED

NEW_UI_SOURCE = NOT_AUTHORIZED

NEW_DEPLOYMENT_SOURCE = NOT_AUTHORIZED

## 12. FASTIFY INSTANCE BOUNDARY

FASTIFY_INSTANCE_CREATION = AUTHORIZED_SCOPE_CANDIDATE

FASTIFY_INSTANCE_CONFIGURATION =
BOOTSTRAP_CONFIGURATION_ONLY

FASTIFY_PLUGIN_REGISTRATION =
NOT_AUTHORIZED_UNLESS_REQUIRED_FOR_BOOTSTRAP_ONLY

FASTIFY_ROUTE_REGISTRATION = NOT_AUTHORIZED

FASTIFY_CONTROLLER_REGISTRATION = NOT_AUTHORIZED

FASTIFY_SERVICE_REGISTRATION = NOT_AUTHORIZED

FASTIFY_DATABASE_PLUGIN = NOT_AUTHORIZED

FASTIFY_AUTHENTICATION_PLUGIN = NOT_AUTHORIZED

FASTIFY_AUTHORIZATION_PLUGIN = NOT_AUTHORIZED

FASTIFY_UI_PLUGIN = NOT_AUTHORIZED

## 13. ENVIRONMENT CONFIGURATION BOUNDARY

AUTHORIZED_CONFIGURATION_VALUES:

PORT
HOST

PORT_DEFAULT = 3000
HOST_DEFAULT = 127.0.0.1

NO_OTHER_RUNTIME_CONFIGURATION_IS_AUTHORIZED_BY_THIS DECISION.

DATABASE_URL = NOT_AUTHORIZED
DATABASE_USER = NOT_AUTHORIZED
DATABASE_PASSWORD = NOT_AUTHORIZED
SESSION_SECRET = NOT_AUTHORIZED
AUTH_SECRET = NOT_AUTHORIZED
CREDENTIAL_CONFIGURATION = NOT_AUTHORIZED

Environment-variable support MUST NOT be used as an implicit
authorization mechanism for any excluded layer.

## 14. RUNTIME SIDE-EFFECT BOUNDARY

BOOTSTRAP_SOURCE_MAY:

- create the Fastify server instance
- configure the bounded runtime options
- register graceful shutdown handlers
- start listening on the bounded development host and port

BOOTSTRAP_SOURCE_MUST_NOT:

- create database connections
- read patient data
- write patient data
- allocate CPN values
- execute SQL
- invoke business services
- mutate domain state
- create Clinic Days
- register API routes
- authenticate users
- authorize actors
- create sessions
- expose public network interfaces

RUNTIME_SIDE_EFFECT_SCOPE =
SERVER_PROCESS_LIFECYCLE_ONLY

FAIL = 0

## 15. API AUTHORITY PRESERVATION

CURRENT_API_AUTHORITY = PARTIALLY_GRANTED

CURRENT_API_AUTHORITY_SCOPE = REGISTER_NEW_PATIENT_ONLY

REGISTER_NEW_PATIENT_AUTHORITY = PRESERVED

RETRIEVE_EXISTING_PATIENT_AUTHORITY = NOT_GRANTED

OTHER_API_OPERATION_AUTHORITY = NOT_GRANTED

BOOTSTRAP_SOURCE_IMPLEMENTATION_MUST_NOT_EXPAND_API_AUTHORITY.

BOOTSTRAP_SOURCE_IMPLEMENTATION_MUST_NOT_REGISTER
ANY_API_OPERATION.

BOOTSTRAP_SOURCE_IMPLEMENTATION_MUST_NOT_CREATE
ANY_BUSINESS_ENDPOINT.

## 16. PERSISTENCE AUTHORITY PRESERVATION

PERSISTENCE_COMPLETE_CLOSURE = CLOSED

PERSISTENCE_LIVE_RECONCILIATION = CLOSED

PERSISTENCE_AUTHORITY = EXISTING_CLOSED_PERSISTENCE_ONLY

DATABASE_SCHEMA_AUTHORITY = NOT_GRANTED

SQL_AUTHORITY = NOT_GRANTED

REPOSITORY_AUTHORITY = NOT_GRANTED

DATABASE_CONNECTION_AUTHORITY = NOT_GRANTED

PERSISTENCE_REOPENING = PROHIBITED

BOOTSTRAP_SOURCE_IMPLEMENTATION MUST NOT alter,
extend, reopen, or reinterpret the closed persistence boundary.

PATIENT_DATA_PRESERVATION = PROTECTED

ROLLBACK_SAFETY = PROTECTED

## 17. ACTOR AND AUTHORITY PRESERVATION

DOCTOR_AUTHORITY = PRESERVED

NURSE_AUTHORITY = PRESERVED

ACTOR_EXPANSION = NOT_AUTHORIZED

PERMISSION_EXPANSION = NOT_AUTHORIZED

AUTHORITY_TRANSFER = NOT_AUTHORIZED

The bootstrap source MUST NOT introduce any actor,
role, permission, delegation rule, or authorization behavior.

## 18. CONTRACT PRESERVATION

BOOTSTRAP_CONTRACT = PRESERVED

BOOTSTRAP_TECHNICAL_DECISION = PRESERVED

BOOTSTRAP_CONTRACT_RECONCILIATION = PRESERVED

API_RUNTIME_CONTRACT = PRESERVED

API_AUTHORITY_REESTABLISHMENT = PRESERVED

PERSISTENCE_CLOSURE = PRESERVED

No source implementation may modify these contracts implicitly.

Any required contract change MUST be handled by a separate
explicit architectural decision.

FAIL = 0

## 19. IMPLEMENTATION AUTHORIZATION DECISION INPUTS

The final authorization decision MUST reconcile all of the
following inputs before source implementation is permitted:

1. Current API authority state.
2. Bootstrap framework decision.
3. Bootstrap technical decision.
4. Bootstrap contract.
5. Bootstrap contract reconciliation.
6. API server runtime contract.
7. API server runtime contract closure.
8. API server runtime build authorization.
9. Persistence closure.
10. Data preservation proof.
11. Rollback safety proof.
12. Actor authority preservation.
13. Authentication boundary.
14. Authorization boundary.
15. Deployment boundary.
16. Current repository structure.
17. Existing server-source state.
18. Existing package and dependency state.
19. Runtime environment boundary.
20. Test and proof boundary.

No single historical artifact may independently grant current
bootstrap source authority.

## 20. CURRENT SOURCE STATE

SERVER_SOURCE = NOT_CREATED

SERVER_STARTUP = NOT_PERFORMED

FASTIFY_RUNTIME_SOURCE = NOT_IMPLEMENTED

API_ROUTE_REGISTRATION = NOT_IMPLEMENTED_BY_BOOTSTRAP_SOURCE

DATABASE_CONNECTION = NOT_IMPLEMENTED_BY_BOOTSTRAP_SOURCE

AUTHENTICATION = NOT_IMPLEMENTED_BY_BOOTSTRAP_SOURCE

AUTHORIZATION = NOT_IMPLEMENTED_BY_BOOTSTRAP_SOURCE

CURRENT_SOURCE_AUTHORITY = NOT_YET_DECIDED

## 21. HISTORICAL IMPLEMENTATION RECONCILIATION

Historical API implementation evidence may demonstrate that
Fastify-based API behavior existed previously.

Historical runtime evidence MUST remain classified as historical
evidence unless explicitly revalidated under the current authority
boundary.

Historical API implementation authorization MUST NOT automatically
authorize current bootstrap source creation.

Historical runtime proof MUST NOT automatically authorize current
bootstrap source creation.

Current bootstrap source authority MUST be established by this
current decision boundary.

## 22. PROOF REQUIREMENT

Before any final implementation authorization is recorded,
the decision package MUST establish:

BOOTSTRAP_SCOPE = EXPLICIT

SOURCE_BOUNDARY = EXPLICIT

STARTUP_BOUNDARY = EXPLICIT

NETWORK_BOUNDARY = EXPLICIT

SHUTDOWN_BOUNDARY = EXPLICIT

API_BOUNDARY = PRESERVED

PERSISTENCE_BOUNDARY = PRESERVED

AUTH_BOUNDARY = PRESERVED

ACTOR_BOUNDARY = PRESERVED

DEPLOYMENT_BOUNDARY = PRESERVED

REGRESSION_BOUNDARY = EXPLICIT

FAIL = 0

## 23. TEST AND PROOF BOUNDARY

Any source implementation authorized by this decision MUST be
validated independently from historical API runtime proof.

The bootstrap proof boundary MUST cover, at minimum:

- source file existence
- Fastify dependency resolution
- server instance creation
- explicit application start behavior
- default HOST behavior
- default PORT behavior
- environment HOST behavior
- environment PORT behavior
- loopback-only development default
- graceful SIGINT handling
- graceful SIGTERM handling
- no automatic startup on module import
- no API route registration
- no business endpoint registration
- no database connection
- no persistence mutation
- no authentication implementation
- no authorization implementation

## 24. NON-AUTHORIZATION OF PROOF

Passing bootstrap tests MUST prove only the behavior covered by
the bootstrap source boundary.

Bootstrap test success MUST NOT grant:

API_ROUTE_AUTHORITY
BUSINESS_OPERATION_AUTHORITY
DATABASE_AUTHORITY
PERSISTENCE_IMPLEMENTATION_AUTHORITY
AUTHENTICATION_AUTHORITY
AUTHORIZATION_AUTHORITY
UI_AUTHORITY
DEPLOYMENT_AUTHORITY
PRODUCTION_AUTHORITY
REAL_USE_AUTHORITY

Test success is evidence of conformance, not a substitute for
explicit authority.

## 25. REGRESSION REQUIREMENT

The existing regression suite MUST remain protected.

No bootstrap source implementation may intentionally or implicitly
remove, weaken, bypass, or redefine existing tests.

REGRESSION = REQUIRED

REGRESSION_FAIL_COUNT = 0_REQUIRED

NEW_BOOTSTRAP_TESTS = REQUIRED_FOR_NEW_BOOTSTRAP_BEHAVIOR

HISTORICAL_TEST_SUCCESS = SUPPORTING_EVIDENCE_ONLY

## 26. SAFETY INVARIANTS

The following invariants MUST remain true after implementation:

PERSISTENCE_COMPLETE_CLOSURE = CLOSED

DATA_PRESERVATION = PROVEN

ROLLBACK_SAFETY = PROVEN

CURRENT_API_AUTHORITY_SCOPE = REGISTER_NEW_PATIENT_ONLY

RETRIEVE_EXISTING_PATIENT_AUTHORITY = NOT_GRANTED

OTHER_API_OPERATION_AUTHORITY = NOT_GRANTED

AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED

DATABASE_SCHEMA_AUTHORITY = NOT_GRANTED

SQL_AUTHORITY = NOT_GRANTED

REPOSITORY_AUTHORITY = NOT_GRANTED

UI_IMPLEMENTATION = NOT_GRANTED

DEPLOYMENT = NOT_GRANTED

PRODUCTION_USE = NOT_GRANTED

REAL_USE = NOT_GRANTED

REAL_PILOT = NOT_GRANTED

FAIL = 0

## 27. AUTHORIZED IMPLEMENTATION UNIT

If the final decision grants authorization, the authorized
implementation unit SHALL be the minimum source necessary to
materialize the defined Bootstrap Contract.

AUTHORIZED_IMPLEMENTATION_UNIT =
BOOTSTRAP_SERVER_SOURCE_ONLY

AUTHORIZED_RUNTIME_RESPONSIBILITY =
SERVER_PROCESS_INITIALIZATION

AUTHORIZED_START_RESPONSIBILITY =
EXPLICIT_SERVER_START

AUTHORIZED_SHUTDOWN_RESPONSIBILITY =
GRACEFUL_SERVER_PROCESS_SHUTDOWN

No implementation unit outside this boundary is included.

## 28. PROHIBITED IMPLEMENTATION COUPLING

The bootstrap source MUST remain independently understandable
without requiring business-domain implementation.

The bootstrap source MUST NOT depend on:

- Patient domain behavior.
- Case domain behavior.
- Visit domain behavior.
- Clinic Day business behavior.
- Patient repository behavior.
- SQL statements.
- Database transactions.
- Authentication services.
- Authorization services.
- Session services.
- Credential services.
- UI components.
- Deployment infrastructure.

BOOTSTRAP_TO_DOMAIN_COUPLING = PROHIBITED

BOOTSTRAP_TO_PERSISTENCE_COUPLING = PROHIBITED

BOOTSTRAP_TO_AUTH_COUPLING = PROHIBITED

BOOTSTRAP_TO_UI_COUPLING = PROHIBITED

## 29. IMPORT BOUNDARY

The bootstrap source MAY import only dependencies required to
create and control the bounded Fastify runtime.

Business-domain imports = NOT_AUTHORIZED

Application-service imports = NOT_AUTHORIZED

Repository imports = NOT_AUTHORIZED

Database-client imports = NOT_AUTHORIZED

Authentication imports = NOT_AUTHORIZED

Authorization imports = NOT_AUTHORIZED

UI imports = NOT_AUTHORIZED

## 30. APPLICATION START CONTRACT

The eventual implementation MUST preserve:

STARTUP_MODEL = EXPLICIT_APPLICATION_START

SERVER_STARTUP_AUTOMATIC_ON_IMPORT = NO

The module MUST be safely loadable without opening a listening
network socket merely because it was imported.

The actual listening operation MUST occur only through the explicit
application start path.

STARTUP_SIDE_EFFECT_ON_IMPORT = PROHIBITED

LISTEN_ON_IMPORT = PROHIBITED

FAIL = 0

## 31. FINAL AUTHORIZATION DECISION BOUNDARY

This document is a current authorization decision package.

The final authorization result MUST be explicit.

Permitted final states are:

BOOTSTRAP_SOURCE_IMPLEMENTATION_AUTHORIZATION = GRANTED

or

BOOTSTRAP_SOURCE_IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED

A GRANTED result MUST explicitly preserve every exclusion defined
by this document.

A NOT_GRANTED result MUST leave server-source implementation
blocked.

No implementation authority may be inferred from:

- package installation
- Fastify dependency presence
- historical API implementation
- historical runtime proof
- existing route/controller/service source
- persistence closure
- general implementation authorization
- test success
- repository structure

## 32. GRANT SCOPE REQUIREMENT

If GRANTED, the authorization MUST be interpreted as:

SERVER_SOURCE_IMPLEMENTATION = AUTHORIZED

SERVER_STARTUP_IMPLEMENTATION = AUTHORIZED

BOOTSTRAP_RUNTIME_ONLY = YES

The grant MUST NOT be interpreted as authorization for:

API_ROUTES
BUSINESS_ENDPOINTS
HEALTH_ENDPOINT
DATABASE_CONNECTION
PERSISTENCE
AUTHENTICATION
AUTHORIZATION
SESSION
CREDENTIALS
UI
DEPLOYMENT
PRODUCTION
REAL_USE
REAL_PILOT

## 33. IMPLEMENTATION STOP CONDITION

Implementation MUST stop immediately if execution requires any
behavior outside the authorized Bootstrap Source boundary.

Examples include:

- adding an API route
- adding a controller
- invoking an application service
- opening a database connection
- adding repository wiring
- executing SQL
- adding authentication
- adding authorization
- adding session handling
- changing persistence
- changing domain behavior
- changing actor authority
- changing deployment behavior

Such a requirement constitutes an authority gap and MUST NOT be
resolved through implementation improvisation.

## 34. CHANGE CONTROL

Any required change to:

HOST policy
PORT policy
startup model
shutdown model
network exposure
Fastify framework
runtime responsibility
API boundary
persistence boundary
authentication boundary
authorization boundary

MUST be handled by a separate explicit decision.

Implementation MUST NOT become the mechanism for architectural
decision-making.

FAIL = 0

## 35. CURRENT AUTHORITY RECONCILIATION

CURRENT_API_AUTHORITY_REESTABLISHMENT =
ESTABLISHED

CURRENT_API_AUTHORITY =
PARTIALLY_GRANTED

CURRENT_API_AUTHORITY_SCOPE =
REGISTER_NEW_PATIENT_ONLY

REGISTER_NEW_PATIENT_AUTHORITY =
GRANTED

REGISTER_NEW_PATIENT_IMPLEMENTATION_AUTHORIZED =
YES

RETRIEVE_EXISTING_PATIENT_AUTHORITY =
NOT_GRANTED

RETRIEVE_EXISTING_PATIENT_IMPLEMENTATION_AUTHORIZED =
NO

OTHER_API_OPERATION_AUTHORITY =
NOT_GRANTED

The bootstrap source authorization is orthogonal to operation-level
API authority.

Granting bootstrap source authority MUST NOT grant any API operation.

## 36. PERSISTENCE RECONCILIATION

PERSISTENCE_COMPLETE_CLOSURE =
CLOSED

PERSISTENCE_LIVE_RECONCILIATION =
CLOSED

PATIENT_FOUNDATION =
PROTECTED

DATA_PRESERVATION =
PROVEN

ROLLBACK_SAFETY =
PROVEN

API_PERSISTENCE_BOUNDARY =
EXISTING_CLOSED_PERSISTENCE_ONLY

BOOTSTRAP_PERSISTENCE_ACCESS =
NOT_AUTHORIZED

BOOTSTRAP_DATABASE_CONNECTION =
NOT_AUTHORIZED

BOOTSTRAP_SQL =
NOT_AUTHORIZED

BOOTSTRAP_REPOSITORY_WIRING =
NOT_AUTHORIZED

The bootstrap source MUST NOT require or create a database
connection merely to start the server.

## 37. AUTHENTICATION AND AUTHORIZATION RECONCILIATION

AUTHENTICATION_IMPLEMENTATION =
NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION =
NOT_GRANTED

SESSION_IMPLEMENTATION =
NOT_GRANTED

CREDENTIAL_IMPLEMENTATION =
NOT_GRANTED

ACTOR_EXPANSION =
NOT_GRANTED

PERMISSION_EXPANSION =
NOT_GRANTED

The bootstrap source MUST remain neutral with respect to actor
authentication and authorization.

No authentication or authorization behavior may be embedded into
server startup as an implementation shortcut.

## 38. DEPLOYMENT RECONCILIATION

ENVIRONMENT =
DEVELOPMENT

DEVELOPMENT_EXTERNAL_NETWORK_EXPOSURE =
NOT_AUTHORIZED

PUBLIC_NETWORK_EXPOSURE =
NOT_AUTHORIZED

DEPLOYMENT_IMPLEMENTATION =
NOT_AUTHORIZED

PRODUCTION_CONFIGURATION =
NOT_AUTHORIZED

PRODUCTION_CREDENTIALS =
NOT_AUTHORIZED

PRODUCTION_USE =
NOT_AUTHORIZED

REAL_USE =
NOT_AUTHORIZED

REAL_PILOT =
NOT_AUTHORIZED

Bootstrap source authorization is therefore a local development
runtime authorization only.

FAIL = 0

## 39. SOURCE IMPLEMENTATION ACCEPTANCE CRITERIA

Any authorized bootstrap source implementation MUST satisfy all
of the following criteria:

SOURCE_FILE_EXISTS = REQUIRED

FASTIFY_DEPENDENCY_RESOLVES = REQUIRED

FASTIFY_SERVER_INSTANCE_CREATES = REQUIRED

EXPLICIT_APPLICATION_START = REQUIRED

AUTOMATIC_START_ON_IMPORT = PROHIBITED

HOST_ENVIRONMENT_OVERRIDE = REQUIRED

PORT_ENVIRONMENT_OVERRIDE = REQUIRED

HOST_DEFAULT = 127.0.0.1

PORT_DEFAULT = 3000

DEVELOPMENT_LOOPBACK_DEFAULT = REQUIRED

GRACEFUL_SIGINT = REQUIRED

GRACEFUL_SIGTERM = REQUIRED

NO_API_ROUTE_REGISTRATION = REQUIRED

NO_BUSINESS_ENDPOINT_REGISTRATION = REQUIRED

NO_DATABASE_CONNECTION = REQUIRED

NO_PERSISTENCE_MUTATION = REQUIRED

NO_AUTHENTICATION_IMPLEMENTATION = REQUIRED

NO_AUTHORIZATION_IMPLEMENTATION = REQUIRED

## 40. SOURCE CONFORMANCE

The implemented source MUST conform to the existing bootstrap
contract without introducing undocumented behavior.

SOURCE_CONFORMANCE =
REQUIRED

CONTRACT_DRIFT =
PROHIBITED

UNDECLARED_RUNTIME_BEHAVIOR =
PROHIBITED

UNAUTHORIZED_SIDE_EFFECT =
PROHIBITED

SILENT_ARCHITECTURAL_DECISION =
PROHIBITED

If source behavior conflicts with a closed contract, implementation
MUST stop and the conflict MUST be resolved through an explicit
decision rather than through source modification.

## 41. REGRESSION AND DATA SAFETY

Bootstrap implementation MUST preserve all existing regression
tests.

Bootstrap implementation MUST NOT modify patient data.

Bootstrap implementation MUST NOT modify Clinic Day data.

Bootstrap implementation MUST NOT modify persistence schema.

Bootstrap implementation MUST NOT allocate CPN values.

Bootstrap implementation MUST NOT execute business transactions.

PATIENT_DATA_PRESERVATION =
PROTECTED

CLINIC_DAY_DATA_PRESERVATION =
PROTECTED

PERSISTENCE_SCHEMA_PRESERVATION =
PROTECTED

CPN_PRESERVATION =
PROTECTED

TRANSACTION_BOUNDARY =
PRESERVED

ROLLBACK_SAFETY =
PROTECTED

## 42. IMPLEMENTATION EXECUTION RULE

Even after a GRANTED result is recorded, implementation MUST be
performed only within the exact authorized source boundary.

The first implementation action MUST be source creation.

The first implementation action MUST NOT include:

- route creation
- controller creation
- service creation
- repository creation
- database wiring
- authentication
- authorization
- UI
- deployment

IMPLEMENTATION_ORDER =
AUTHORIZATION -> SOURCE_CREATION -> BOOTSTRAP_PROOF

FAIL = 0

## 43. AUTHORIZATION DECISION RECONCILIATION

The final authorization MUST reconcile the source implementation
boundary against the current project authority hierarchy.

AUTHORITY_HIERARCHY =

1. CURRENT_EXPLICIT_AUTHORITY_DECISION
2. CURRENT_CLOSED_TECHNICAL_CONTRACTS
3. CURRENT_PERSISTENCE_CLOSURE
4. CURRENT_API_AUTHORITY_REESTABLISHMENT
5. CURRENT_RUNTIME_AND_BOOTSTRAP_BOUNDARIES
6. CURRENT_IMPLEMENTATION_EVIDENCE
7. HISTORICAL_IMPLEMENTATION_EVIDENCE

Lower-level evidence MUST NOT override a higher-level current
authority decision.

Historical authorization MUST NOT override current exclusions.

## 44. AUTHORITY NON-INHERITANCE

PERSISTENCE_CLOSURE_TO_BOOTSTRAP_AUTHORITY =
NO

API_OPERATION_AUTHORITY_TO_BOOTSTRAP_AUTHORITY =
NO

HISTORICAL_API_AUTHORITY_TO_BOOTSTRAP_AUTHORITY =
NO

GENERAL_IMPLEMENTATION_AUTHORIZATION_TO_BOOTSTRAP_SOURCE_AUTHORITY =
NO

PACKAGE_MANIFEST_MATERIALIZATION_TO_BOOTSTRAP_SOURCE_AUTHORITY =
NO

FASTIFY_DEPENDENCY_PRESENCE_TO_BOOTSTRAP_SOURCE_AUTHORITY =
NO

TEST_SUCCESS_TO_BOOTSTRAP_SOURCE_AUTHORITY =
NO

Bootstrap source authority exists only when explicitly granted by
the final result of this decision.

## 45. REQUIRED FINAL DECISION RECORD

The final section of this document MUST explicitly record:

BOOTSTRAP_SOURCE_IMPLEMENTATION_AUTHORIZATION

SERVER_SOURCE_IMPLEMENTATION

SERVER_STARTUP_IMPLEMENTATION

BOOTSTRAP_SCOPE

SOURCE_BOUNDARY

STARTUP_BOUNDARY

NETWORK_BOUNDARY

SHUTDOWN_BOUNDARY

TEST_BOUNDARY

PERSISTENCE_BOUNDARY

AUTHENTICATION_BOUNDARY

AUTHORIZATION_BOUNDARY

ACTOR_BOUNDARY

DEPLOYMENT_BOUNDARY

REGRESSION_RESULT

FAIL

The final decision MUST NOT leave the implementation authorization
ambiguous.

## 46. FINAL DECISION SAFETY RULE

If any required authority input remains unresolved, the final
decision MUST NOT silently convert the unresolved state into
implementation permission.

UNRESOLVED_AUTHORITY =
NOT_AUTHORIZED

UNPROVEN_SCOPE =
NOT_AUTHORIZED

UNDEFINED_BEHAVIOR =
NOT_AUTHORIZED

UNAUTHORIZED_EXPANSION =
PROHIBITED

The purpose of this rule is to preserve the factory principle:

AUTHORITY MUST PRECEDE IMPLEMENTATION.

FAIL = 0

## 47. CURRENT BOOTSTRAP AUTHORITY STATUS

At this stage of the decision package, no bootstrap source
implementation authority has yet been issued.

BOOTSTRAP_SOURCE_IMPLEMENTATION_AUTHORIZATION =
NOT_YET_ISSUED

SERVER_SOURCE_IMPLEMENTATION =
NOT_AUTHORIZED

SERVER_STARTUP_IMPLEMENTATION =
NOT_AUTHORIZED

BOOTSTRAP_SCOPE =
NOT_YET_GRANTED

This status MUST remain unchanged until the final decision
explicitly resolves the authorization boundary.

## 48. CURRENT IMPLEMENTATION STATE

SERVER_SOURCE =
NOT_CREATED

SERVER_STARTUP =
NOT_PERFORMED

FASTIFY_SERVER_INSTANCE =
NOT_CREATED_BY_CURRENT_SOURCE

LISTENING_SOCKET =
NOT_OPENED_BY_CURRENT_SOURCE

API_ROUTES =
NOT_IMPLEMENTED_BY_CURRENT_SOURCE

DATABASE_CONNECTION =
NOT_IMPLEMENTED_BY_CURRENT_SOURCE

AUTHENTICATION =
NOT_IMPLEMENTED_BY_CURRENT_SOURCE

AUTHORIZATION =
NOT_IMPLEMENTED_BY_CURRENT_SOURCE

## 49. PRE-IMPLEMENTATION SAFETY GATE

Before source creation, the following MUST be true:

AUTHORITY_DECISION =
EXPLICIT

BOOTSTRAP_SCOPE =
EXPLICIT

SOURCE_BOUNDARY =
EXPLICIT

STARTUP_BOUNDARY =
EXPLICIT

NETWORK_BOUNDARY =
EXPLICIT

SHUTDOWN_BOUNDARY =
EXPLICIT

PERSISTENCE_BOUNDARY =
PRESERVED

API_AUTHORITY_BOUNDARY =
PRESERVED

AUTHENTICATION_BOUNDARY =
PRESERVED

AUTHORIZATION_BOUNDARY =
PRESERVED

ACTOR_BOUNDARY =
PRESERVED

DEPLOYMENT_BOUNDARY =
PRESERVED

REGRESSION_BOUNDARY =
EXPLICIT

FAIL =
0

## 50. NO IMPLEMENTATION BY DOCUMENTATION

This document defines and records authority.

This document MUST NOT itself create the server source.

This document MUST NOT itself start the server.

This document MUST NOT itself create a database connection.

This document MUST NOT itself register an API route.

DOCUMENTATION_ACTION =
NON_IMPLEMENTING

SOURCE_IMPLEMENTATION =
SEPARATE_EXECUTION_STEP

PROOF =
SEPARATE_EXECUTION_STEP

COMMIT =
SEPARATE_REPOSITORY_STEP

FAIL = 0

## 51. AUTHORIZATION GRANT SCOPE

The authorization, if granted by the final decision, SHALL cover
only the following implementation responsibilities:

1. Create the Fastify server instance.
2. Configure the bounded development HOST.
3. Configure the bounded development PORT.
4. Provide explicit application start behavior.
5. Provide graceful SIGINT shutdown behavior.
6. Provide graceful SIGTERM shutdown behavior.
7. Preserve the no-start-on-import rule.

AUTHORIZED_SOURCE_RESPONSIBILITIES =
SERVER_INSTANCE_CREATION
HOST_CONFIGURATION
PORT_CONFIGURATION
EXPLICIT_START
GRACEFUL_SHUTDOWN
IMPORT_SAFETY

## 52. EXPLICITLY EXCLUDED SOURCE RESPONSIBILITIES

The authorization MUST NOT cover:

API route registration.
Controller registration.
Application service registration.
Business endpoint implementation.
Health endpoint implementation.
Database pool creation.
Database connection management.
Repository wiring.
SQL execution.
Transaction management.
Patient mutation.
Patient retrieval behavior.
Clinic Day behavior.
Authentication.
Authorization.
Session management.
Credential handling.
UI behavior.
Deployment behavior.
Production configuration.
Public network exposure.

EXCLUDED_SOURCE_RESPONSIBILITIES =
ALL_BUSINESS_AND_EXTERNAL_LAYERS

## 53. SERVER LIFECYCLE CONTRACT

The implementation SHALL preserve the following lifecycle:

IMPORT
    ->
SERVER_MODULE_AVAILABLE
    ->
EXPLICIT_START
    ->
FASTIFY_LISTEN
    ->
RUNNING
    ->
SIGINT_OR_SIGTERM
    ->
GRACEFUL_CLOSE
    ->
PROCESS_EXIT

IMPORT MUST NOT START THE SERVER.

EXPLICIT_START MUST BE THE ONLY NORMAL START PATH.

GRACEFUL_CLOSE MUST TERMINATE THE SERVER PROCESS LIFECYCLE
WITHOUT introducing business or persistence behavior.

## 54. NETWORK SAFETY CONTRACT

Default development binding:

HOST = 127.0.0.1

Default development port:

PORT = 3000

Environment overrides are permitted only for HOST and PORT.

No default may bind the server to:

0.0.0.0
public interfaces
external network interfaces

unless a separate explicit architectural decision authorizes
such exposure.

DEVELOPMENT_NETWORK_SCOPE =
LOOPBACK_BY_DEFAULT

PUBLIC_NETWORK_EXPOSURE =
NOT_AUTHORIZED

## 55. FINAL PRE-GRANT CHECK

Before the final grant is recorded, the following MUST be
reconciled:

BOOTSTRAP_FRAMEWORK = FASTIFY
NODE_RUNTIME = v26.4.0
FASTIFY_VERSION = 5.12.5
STARTUP_MODEL = EXPLICIT_APPLICATION_START
AUTO_START_ON_IMPORT = NO
HOST_DEFAULT = 127.0.0.1
PORT_DEFAULT = 3000
SHUTDOWN_MODEL = GRACEFUL
SHUTDOWN_SIGNALS = SIGINT + SIGTERM

API_ROUTES = EXCLUDED
DATABASE = EXCLUDED
AUTHENTICATION = EXCLUDED
AUTHORIZATION = EXCLUDED
UI = EXCLUDED
DEPLOYMENT = EXCLUDED
PRODUCTION = EXCLUDED
REAL_USE = EXCLUDED

PERSISTENCE_CLOSURE =
PRESERVED

CURRENT_API_AUTHORITY_SCOPE =
REGISTER_NEW_PATIENT_ONLY

FAIL = 0

## 56. FINAL AUTHORIZATION DECISION

After reconciliation of the current authority hierarchy,
closed contracts, persistence closure, API authority boundary,
runtime boundary, source boundary, network boundary, shutdown
boundary, test boundary, and all explicit exclusions:

BOOTSTRAP_SOURCE_IMPLEMENTATION_AUTHORIZATION = GRANTED

SERVER_SOURCE_IMPLEMENTATION = AUTHORIZED

SERVER_STARTUP_IMPLEMENTATION = AUTHORIZED

BOOTSTRAP_SCOPE = SERVER_RUNTIME_BOOTSTRAP_ONLY

## 57. GRANTED IMPLEMENTATION SCOPE

GRANTED:

FASTIFY_SERVER_INSTANCE_CREATION = YES
EXPLICIT_APPLICATION_START = YES
HOST_CONFIGURATION = YES
PORT_CONFIGURATION = YES
GRACEFUL_SIGINT_SHUTDOWN = YES
GRACEFUL_SIGTERM_SHUTDOWN = YES
NO_AUTOMATIC_START_ON_IMPORT = YES

HOST_DEFAULT = 127.0.0.1
PORT_DEFAULT = 3000

ENVIRONMENT_HOST_OVERRIDE = YES
ENVIRONMENT_PORT_OVERRIDE = YES

## 58. GRANT EXCLUSIONS

API_ROUTE_IMPLEMENTATION = NO
BUSINESS_ENDPOINT_IMPLEMENTATION = NO
HEALTH_ENDPOINT_IMPLEMENTATION = NO
CONTROLLER_IMPLEMENTATION = NO
APPLICATION_SERVICE_IMPLEMENTATION = NO
DATABASE_CONNECTION_IMPLEMENTATION = NO
DATABASE_SCHEMA_IMPLEMENTATION = NO
SQL_IMPLEMENTATION = NO
REPOSITORY_IMPLEMENTATION = NO
TRANSACTION_IMPLEMENTATION = NO
AUTHENTICATION_IMPLEMENTATION = NO
AUTHORIZATION_IMPLEMENTATION = NO
SESSION_IMPLEMENTATION = NO
CREDENTIAL_IMPLEMENTATION = NO
UI_IMPLEMENTATION = NO
DEPLOYMENT_IMPLEMENTATION = NO
PUBLIC_NETWORK_EXPOSURE = NO
PRODUCTION_USE = NO
REAL_USE = NO
REAL_PILOT = NO

## 59. AUTHORITY PRESERVATION

CURRENT_API_AUTHORITY = PARTIALLY_GRANTED

CURRENT_API_AUTHORITY_SCOPE = REGISTER_NEW_PATIENT_ONLY

REGISTER_NEW_PATIENT_AUTHORITY = GRANTED

RETRIEVE_EXISTING_PATIENT_AUTHORITY = NOT_GRANTED

OTHER_API_OPERATION_AUTHORITY = NOT_GRANTED

PERSISTENCE_COMPLETE_CLOSURE = CLOSED

PERSISTENCE_LIVE_RECONCILIATION = CLOSED

DATA_PRESERVATION = PROVEN

ROLLBACK_SAFETY = PROVEN

AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED

ACTOR_EXPANSION = NOT_GRANTED

PERMISSION_EXPANSION = NOT_GRANTED

## 60. IMPLEMENTATION EXECUTION BOUNDARY

The granted implementation MUST create only the bootstrap server
source required by Sections 51 through 57.

The implementation MUST NOT create or modify:

API routes
controllers
application services
repositories
database schema
SQL behavior
authentication
authorization
sessions
credentials
UI
deployment configuration

Any requirement outside this scope constitutes an authority gap.

AUTHORITY_GAP_DURING_IMPLEMENTATION =
STOP_AND_REASSESS

## 61. POST-IMPLEMENTATION PROOF REQUIREMENT

After source implementation, proof MUST establish:

SOURCE_EXISTS = PASS
FASTIFY_RESOLUTION = PASS
SERVER_INSTANCE_CREATION = PASS
EXPLICIT_START = PASS
NO_AUTO_START_ON_IMPORT = PASS
HOST_DEFAULT = PASS
PORT_DEFAULT = PASS
HOST_OVERRIDE = PASS
PORT_OVERRIDE = PASS
GRACEFUL_SIGINT = PASS
GRACEFUL_SIGTERM = PASS
NO_API_ROUTES = PASS
NO_BUSINESS_ENDPOINTS = PASS
NO_DATABASE_CONNECTION = PASS
NO_PERSISTENCE_MUTATION = PASS
NO_AUTHENTICATION_IMPLEMENTATION = PASS
NO_AUTHORIZATION_IMPLEMENTATION = PASS
REGRESSION = PASS
FAIL = 0

## 62. FINAL STATUS

BOOTSTRAP_SOURCE_IMPLEMENTATION_AUTHORIZATION = GRANTED
SERVER_SOURCE_IMPLEMENTATION = AUTHORIZED
SERVER_STARTUP_IMPLEMENTATION = AUTHORIZED

BOOTSTRAP_SCOPE = SERVER_RUNTIME_BOOTSTRAP_ONLY

API_OPERATION_AUTHORITY = REGISTER_NEW_PATIENT_ONLY
RETRIEVE_EXISTING_PATIENT_AUTHORITY = NOT_GRANTED

PERSISTENCE_CLOSURE = PRESERVED
DATA_PRESERVATION = PROTECTED
ROLLBACK_SAFETY = PROTECTED

AUTHENTICATION = NOT_GRANTED
AUTHORIZATION = NOT_GRANTED
UI = NOT_GRANTED
DEPLOYMENT = NOT_GRANTED
REAL_USE = NOT_GRANTED
REAL_PILOT = NOT_GRANTED
PRODUCTION_USE = NOT_GRANTED

IMPLEMENTATION_EXECUTION = NOT_PERFORMED_BY_THIS_DOCUMENT

NEXT_GATE = BOOTSTRAP SOURCE IMPLEMENTATION AND PROOF

FAIL = 0
