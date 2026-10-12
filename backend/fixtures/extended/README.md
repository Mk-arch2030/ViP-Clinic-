# Extended Synthetic V1

47 stable scenarios EXT-001 through EXT-047 are specified in extended-v1.json.
Every row includes purpose, inputs, expected persisted records, relationships, API
behavior, required capability, minimum stage and honest implementation status.

Stage inventory: Stage 6 = 17; Stage 7 = 7; Stage 8 = 15; Stage 9 = 2;
Stage 10 = 3; Stage 11 = 1; Stage 12 = 2.

EXT-040/041 have loader unit implementations (idempotency/rollback), with fake
adapters only. Fifteen other Stage 6 rows describe existing capabilities whose new
synthetic PostgreSQL integration remains NOT RUN. Three new HTTP-injection/client
tests exercise actual extension registration/history inputs, same-name identity,
auth/CSRF/expiry/revocation denial and uncertain mutation blocking using fake SQL
clients. These tests do not certify real persistence. The 30 Stage 7–12 scenarios
are all SPECIFIED_NOT_IMPLEMENTED; no future clinical success is mocked or claimed.

Scenario inventory:
- EXT-001–006: registration, retrieval, same names, stable CPN, invalid data, lost reply.
- EXT-007–011: chronic, allergy, surgery, family and lifestyle history.
- EXT-012–019: chronology, new case, follow-up, multiple visits/cases, case states,
  arrival/exit and cross-patient isolation.
- EXT-020–032: consultation, vitals, investigations, diagnoses, treatment, prescription
  draft/authorization, follow-up, completion, census, day lifecycle and visit status.
- EXT-033–037: unauthenticated, expired, revoked, CSRF and Nurse/clinical denial.
- EXT-038–047: restart, backup/restore, idempotency, rollback, integrated journey,
  pilot, delivery, restore checksum, recovery and fresh provisioning.

4 patients (two same-name identities), 3 cases, 4 visits, 2 clinic days, 4 prescription
specifications. All extension patient labels begin SYNTHETIC, phone strings are
SYN-NON-DIALABLE values and treatment/medication content is explicitly for tests.
UUIDs, CPNs and record identifiers are disjoint from Golden Baseline V1. A legacy
retrieval patient has null DOB/uncaptured history; another has deliberately blank
profession and another an explicitly saved empty history. These distinctions survive
the fixture projection and cannot be normalized to invented clinical facts.

Extension V1 has its own pinned hash. Future scenario additions must use a separately
reviewed version; they never regenerate or alter Golden Baseline V1.
