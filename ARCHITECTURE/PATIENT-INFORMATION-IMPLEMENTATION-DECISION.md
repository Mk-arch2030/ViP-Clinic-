# Dr.Roby Clinic — Patient Information Implementation Decision

STATUS = CLOSED
GATE = PATIENT DOMAIN IMPLEMENTATION

AUTHORIZED_SCOPE = DOMAIN_ONLY

PATIENT_IDENTITY:
- clinicPatientNumber remains the stable Patient identity reference.
- Existing Patient identity representation MUST be preserved.

BASIC_PERSONAL_DATA:
- Name = APPROVED
- Age = APPROVED
- Profession = APPROVED_WHEN_NECESSARY
- Exact complete field set = DEFERRED
- Additional fields = DEFERRED

IMPLEMENTATION_REPRESENTATION:
- Basic / Personal Data is represented as Patient information.
- Approved fields may be represented without claiming that they form the final complete schema.
- No persistence-specific representation is introduced.
- No API/UI representation is introduced.

PAST_HISTORY:
- Patient-level information.
- Established during initial registration.
- Distinct from Visit.
- Not represented as a historical Visit.

CLINICAL_HISTORY:
- Accumulated from recorded Visits.
- No separate ClinicalHistory domain object is introduced.
- Previous Visits remain preserved.

SAFETY:
NEW_ACTOR = NO
NEW_CAPABILITY = NO
CONTRACT_MUTATION = NO
PERSISTENCE = NO
API = NO
UI = NO
AUTHENTICATION = NO
AUTHORIZATION = NO
WORKFLOW_RUNTIME = NO
RANDOM_REFACTORING = NO

DECISION:
PATIENT_INFORMATION_DOMAIN_IMPLEMENTATION = AUTHORIZED

NEXT_GATE:
PATIENT_JAVASCRIPT_MINIMAL_MUTATION
