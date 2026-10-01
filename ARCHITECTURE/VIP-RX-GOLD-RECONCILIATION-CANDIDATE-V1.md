# VIP RX GOLD RECONCILIATION CANDIDATE V1

Status: CANDIDATE RECONCILIATION DOCUMENT

## 1. Purpose

This document reconciles the existing ViP Rx and Pharmacotherapy implementation against the Canonical Dr_Roby_Clinic architecture.

ViP is a Factory Product Candidate produced from the same Factory Nucleus and directed Product lineage. ViP implementation is evidence of an existing Factory candidate, not independent authority over the Canonical system.

This document does not authorize implementation changes.

## 2. Canonical Closed Foundations

The Canonical architecture establishes:

- Treatment is a clinical concept associated with the current Visit.
- Treatment entries are MANY per Visit.
- Treatment follows the Doctor's clinical decision.
- Doctor is the Clinical Authority for clinical decisions.
- Nurse delegation does not transfer clinical authority.
- Clinical content belongs to the Visit.
- A later Visit must not overwrite clinical content from a previous Visit.
- Treatment modification requires Doctor Authority.
- The product does not become a pharmacy, dispensing, inventory, or medication-management system.

## 3. Canonical Target Evidence

The Canonical target model identifies Pharmacotherapy targets including:

- Prescribed Medication
- Dose
- Frequency
- Duration
- Administration / Patient Instructions
- Clinical Counseling
- Attending MD Authorization / Signature
- Certified Prescription Output

These target statements do not by themselves authorize implementation.

## 4. ViP Observed Implementation

ViP currently contains:

- MedicationRegimenItem
- Prescription
- Multiple prescription items per Visit
- Medication name
- Strength
- Form
- Dose
- Frequency
- Route
- Duration
- Optional quantity
- Instructions
- Optional PRN state
- Clinical counseling
- Patient instructions
- Prescription authorization state
- Authorization timestamp
- Authorizing Doctor identity
- Doctor-only authorization workflow
- Certified prescription print surface

## 5. Reconciliation Matrix

| ViP Capability | Canonical Evidence | State | Gap | Candidate Status |
|---|---|---|---|---|
| Prescription / Rx workspace | Treatment contract and Pharmacotherapy target | CLOSED FOUNDATION + TARGET | Prescription is not yet a distinct closed Canonical entity | Candidate extension |
| Multiple medication items | Treatment = MANY per Visit | CLOSED | Technical medication structure undefined | Strong candidate |
| Medication name | Prescribed Medication target | TARGET | Dedicated field contract not closed | Candidate |
| Strength | No dedicated closed Canonical field | UNDEFINED | Product decision required | Candidate only |
| Form | No dedicated closed Canonical field | UNDEFINED | Product decision required | Candidate only |
| Dose | Pharmacotherapy target | TARGET | Technical field contract not closed | Candidate |
| Frequency | Pharmacotherapy target | TARGET | Technical field contract not closed | Candidate |
| Route | No dedicated closed Canonical field | UNDEFINED | Product decision required | Candidate only |
| Duration | Pharmacotherapy target | TARGET | Technical field contract not closed | Candidate |
| Quantity | No closed Canonical evidence | UNDEFINED | Product decision required | Candidate only |
| PRN | No closed Canonical evidence | UNDEFINED | Product decision required | Candidate only |
| Medication instructions | Administration / Patient Instructions target | TARGET | Technical contract not closed | Candidate |
| Clinical counseling | Clinical Counseling target | TARGET | Technical contract not closed | Candidate |
| Doctor authorization | Doctor Clinical Authority + Treatment amendment rules | PARTIALLY CLOSED | Rx-specific technical authorization contract undefined | Candidate aligned with Canonical |
| authorizedBy | No closed Rx technical model | UNDEFINED | Technical representation requires contract | Candidate implementation detail |
| authorizedAt | No closed Rx technical model | UNDEFINED | Technical representation requires contract | Candidate implementation detail |
| Certified prescription output | Certified Prescription Output target | TARGET | Output contract and implementation rules undefined | Candidate only |
| Nurse authorization restriction | Doctor Clinical Authority boundary | CLOSED FOUNDATION | Rx-specific enforcement contract undefined | Candidate aligned with Canonical |
| Pharmacy inventory | Explicitly excluded | CLOSED EXCLUSION | None | Must remain excluded |
| Dispensing | Explicitly excluded | CLOSED EXCLUSION | None | Must remain excluded |
| Pharmacy management | Explicitly excluded | CLOSED EXCLUSION | None | Must remain excluded |

## 6. Factory Product Questions

Before Canonical implementation authorization, the Factory must decide:

1. Is Prescription a distinct Product concept from Treatment?
2. Is Prescription always Visit-scoped?
3. Is MedicationRegimenItem the approved Product structure?
4. Which medication fields are mandatory?
5. Is Route part of the Product contract?
6. Is Quantity part of the Product contract?
7. Is PRN part of the Product contract?
8. What exactly constitutes Doctor Authorization of an Rx?
9. Can an authorized Rx be amended, replaced, or cancelled?
10. What amendment rules apply after Doctor Authorization?
11. Must amendment occurrence be preserved?
12. What is the formal Certified Prescription Output contract?
13. What identity and authorization information must appear on the certified output?
14. What is the relationship between Treatment and Prescription when both exist in the same Visit?

## 7. Boundary Protection

This candidate must not expand the Product into:

- Pharmacy inventory
- Medication dispensing
- Pharmacy management
- Billing or accounting
- AI prescribing
- AI diagnosis
- External pharmacy workflow
- Independent medication-management system

The clinical prescription remains within the approved clinical EMR boundary.

## 8. Authorization State

Implementation authorization:

NOT GRANTED BY THIS DOCUMENT

Database authorization:

NOT GRANTED

API implementation authorization:

NOT GRANTED

Authentication / authorization implementation authorization:

NOT GRANTED

UI implementation authorization:

NOT GRANTED

Runtime proof authorization:

NOT GRANTED

## 9. Reconciliation Result

PRODUCT_TREATMENT_FOUND = YES

TREATMENT_CARDINALITY = MANY_PER_VISIT

DOCTOR_CLINICAL_AUTHORITY = CLOSED

PHARMACOTHERAPY_TARGET = PRESENT

VIP_RX_IMPLEMENTATION = PRESENT

PRESCRIPTION_DISTINCT_CONCEPT = NOT_YET_CLOSED

RX_TECHNICAL_CONTRACT = NOT_YET_CLOSED

RX_PERSISTENCE = NOT_AUTHORIZED

RX_API = NOT_AUTHORIZED

RX_RUNTIME = NOT_AUTHORIZED

RX_IMPLEMENTATION_EXPANSION = NO

PHARMACY_EXPANSION = NO

DATABASE_CHANGE = NONE

RUNTIME_CHANGE = NONE

FAIL = 0

## 10. Final Candidate Classification

ViP Rx is classified as:

FACTORY PRODUCT CANDIDATE

It is not classified as:

CANONICAL CLOSED CAPABILITY

The ViP implementation demonstrates a richer Factory Product Candidate than the currently closed Canonical Treatment technical boundary.

Canonical authority remains unchanged.

No silent deferred decision is introduced.

No implementation authorization is implied.

