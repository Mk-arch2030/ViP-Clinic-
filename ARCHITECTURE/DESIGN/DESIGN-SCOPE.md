# Dr.Roby Clinic — Design Scope

STATUS: DRAFT
PHASE: DESIGN

## 1. PURPOSE

This document defines the scope of the Design phase as derived from the
authoritative Product Manuscript.

It does not define implementation contracts.

## 2. DESIGN SOURCE

The authoritative source for this Design Scope is:

ARCHITECTURE/MANUSCRIPT/DR-ROBY-CLINIC-PRODUCT-MANUSCRIPT.md

The Design phase must remain consistent with the closed product definition
and contracts.

## 3. DESIGN FOCUS

The Design phase is centered on the clinic's operational workflow.

The Design phase shall make the following product concepts understandable
and coherent:

- Clinic Day operational context.
- Case operational and clinical journey.
- Visit flow within a Case.
- Patient movement through the clinic workflow.
- Doctor-only operation.
- Doctor + Nurse operation.
- Nurse participation in delegated operational workflow.
- Doctor visibility and oversight of clinic workflow.
- The relationship between workflow state and the current patient journey.
- Dashboard/workflow as a product-level operational visibility concept.

## 4. WORKFLOW DESIGN SCOPE

The Design phase shall organize the already-defined workflow concepts into
a coherent product experience.

This includes:

- how the current workflow is understood by the user;
- how the current Case and Visit journey is represented;
- how multiple Cases may coexist during the same Clinic Day;
- how Doctor and Nurse operating modes affect workflow participation;
- how operational workflow execution remains distinct from clinical authority;
- how the Doctor can understand the state of ongoing clinic work.

## 5. ACTOR DESIGN SCOPE

The Design phase may represent the already-defined actor model:

- Doctor as Clinical Authority, Actor, and Main Admin.
- Nurse as Operational Workflow Participant.
- Doctor-only operation.
- Doctor + Nurse operation.

The Design phase must not invent technical permissions or authorization
rules beyond the closed contracts.

## 6. SURFACE BOUNDARY

The Design phase may define product-level interaction and workflow surfaces
needed to express the already-defined clinic workflow.

It does not yet authorize:

- specific UI screens;
- specific UI components;
- navigation contracts;
- API routes;
- API contracts;
- database schema;
- migrations;
- persistence structures;
- technical authorization implementation;
- technical permission matrices.

## 7. WORKFLOW BOUNDARY

The Design phase must preserve the already-defined distinction between:

- Visit Exit and Case Completion;
- Clinic Day Closure and Case Completion;
- operational workflow execution and clinical authority;
- Past History and Clinical History;
- Patient identity and retrieval methods.

No new workflow state or transition is introduced by this Design Scope.

## 8. NON-AUTHORIZATION

This document does not authorize implementation.

The following remain NOT AUTHORIZED unless explicitly defined and closed
through their appropriate gates:

- PRODUCT IMPLEMENTATION
- DATABASE SCHEMA
- API CONTRACT
- UI CONTRACT
- AUTHORIZATION IMPLEMENTATION
- DEPLOYMENT

## 9. DESIGN PRINCIPLE

Design shall proceed from the already-defined product and workflow inward
to a coherent operational experience.

No invented capability, workflow state, route, schema, permission, or
technical mechanism is authorized by this document.

## 10. NEXT GATE

NEXT GATE = DESIGN SCOPE PROVE
