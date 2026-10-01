# CONTRACT-06 — Clinical Decision & Treatment

## 1. Purpose

This contract defines the product-level clinical decision and treatment boundary within the Dr.Roby Clinic visit journey.

It translates the approved product manuscript scope into explicit behavioral rules without authorizing implementation details.

## 2. Contract Scope

Primary scope:

- Clinical Decision
- Treatment

Related scope:

- Investigation and/or Diagnosis within the Visit clinical journey

Already contracted elsewhere:

- Visit workflow
- Follow-up
- Case completion
- Patient identity
- Clinical history
- Doctor/Nurse authority

## 3. Clinical Journey Context

Within a Visit, the clinical journey may include:

Current Complaint
→ Investigation and/or Diagnosis
→ Treatment
→ Follow-up when required
→ Case Completion when clinically established

This contract does not redefine the Visit lifecycle established by CONTRACT-05.

## 4. Current Complaint

The current complaint is part of the clinical information presented to the Doctor during the Visit.

The product may preserve the current complaint as part of the Visit's clinical record.

## 5. Investigation and Diagnosis

The Doctor may determine that investigation and/or diagnosis is required as part of the clinical encounter.

Investigation and diagnosis are included only within the defined clinic clinical journey.

This contract does not define a laboratory information system, specimen pipeline, laboratory workflow, or LIMS capability.

## 6. Clinical Decision

The Doctor is the Clinical Authority for clinical decisions within the Visit.

A clinical decision may determine the appropriate next clinical action, including treatment and whether follow-up is required.

Clinical decision authority is not transferred to the Nurse through operational delegation.

## 7. Treatment

Treatment follows the Doctor's clinical decision within the defined product scope.

Treatment may represent the treatment decision associated with the current Visit.

The product does not become a pharmacy, dispensing, inventory, or medication-management system by recording treatment information.

## 8. Follow-up Boundary

When follow-up is required, the existing CONTRACT-05 rule applies:

A later follow-up return creates a new Visit within the same ongoing Case on the applicable Clinic Day.

This contract does not redefine follow-up behavior.

## 9. Case Completion Boundary

Case completion remains governed by the existing Case contract:

Case completion requires the Doctor's clinical completion decision.

Exit from a Visit does not itself complete the Case.

This contract does not redefine Case completion.

## 10. Doctor Authority

The Doctor remains:

- Clinical Authority
- Main Admin
- Actor

The Doctor is responsible for clinical decisions within the product's defined clinical scope.

## 11. Nurse Boundary

The Nurse remains an Operational Workflow Participant.

Operational delegation may allow the Nurse to record or execute operational information according to the approved workflow.

Delegation does not transfer clinical authority or system ownership from the Doctor.

## 12. Operating Modes

Doctor-only operation remains valid.

Doctor + Nurse operation remains valid.

The operating mode does not change the Doctor's clinical authority.

## 13. Clinical History

Clinical decisions and treatment information associated with a Visit contribute to the patient's longitudinal Clinical History according to the existing Patient/Clinical History contracts.

Previous Visits remain preserved.

A later Visit does not overwrite previous clinical history.

## 14. Explicit Out-of-Scope Boundaries

The following are outside this contract:

- AI diagnosis
- AI clinical decision support
- Hospital system functionality
- LIMS pipeline
- Laboratory information system
- Pharmacy system
- Medication dispensing system
- Pharmacy inventory
- Billing or accounting
- Multi-clinic or multi-branch operation
- Multi-tenant operation

## 15. Implementation Non-Authorization

This contract does not authorize:

- Database schema
- Database migrations
- SQL implementation
- API routes
- API contracts
- UI contracts
- JWT implementation
- Authentication implementation
- Authorization implementation
- Technical permission matrices
- Workflow state-machine implementation
- Audit or locking mechanisms
- Deployment implementation

Those require later explicit authorization.

## 16. Dependency Integrity

This contract depends on:

- CONTRACT-01 — Patient / Case / Visit
- CONTRACT-02 — Clinic Day
- CONTRACT-03 — Actor & Authority
- CONTRACT-04 — Patient Identity & Clinical History
- CONTRACT-05 — Visit / Clinical Encounter Workflow

Closed contracts remain authoritative and are not redefined by this contract.

## 17. Acceptance Target

CONTRACT-06 is acceptable only when the clinical decision and treatment boundary is explicit, coherent with the closed contracts, preserves Doctor clinical authority, preserves longitudinal history, and does not expand the product into AI diagnosis, LIMS, pharmacy, hospital, or other excluded systems.

---

IMPLEMENTATION_AUTHORIZED=NO
SCHEMA_AUTHORIZED=NO
API_AUTHORIZED=NO
UI_AUTHORIZED=NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED=NO
