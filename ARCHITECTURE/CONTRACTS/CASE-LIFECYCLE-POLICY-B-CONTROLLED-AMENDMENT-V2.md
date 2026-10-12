# Case Lifecycle Policy B — Controlled Amendment V2

STATUS = PROPOSED / NOT CLOSED
OWNER_POLICY = APPROVED
CLINICAL_MUTATION_CONTRACT = BLOCKED_PENDING_MANUSCRIPT_AMENDMENT
IMPLEMENTED_POLICY_SUBSET = CALENDAR_COMPUTATION_ONLY

This new proposal supersedes the uncommitted V1 draft's need to choose one operational reopening destination. It incorporates the owner's newer explicit permission to reopen administratively before arrival. V1 reports and all original contracts stay unchanged. No runtime lifecycle transition is authorized by prose alone.

## Proposed minimal domain model

Patient: existing technical UUID and stable CPN. Patient 1→many Cases. Case: one complaint/problem, one Patient, independent lifecycle OPEN or COMPLETED, no mandatory opening Clinic Day. Visit: one Case and one actual Clinic Day, created by deliberate Start Recording after physical arrival. Clinic Day: existing working-date context, independent start/closure; no manufactured Day on administrative action.

OPEN/COMPLETED is a proposed independent lifecycle dimension, not a sixth queue state. Encounter progression remains attached to recorded Visits. No arrival/queue/Doctor/Exit value exists merely because a Case was created/reopened. UI keeps the original dossier/consultation/census identity, showing Case lifecycle and available current encounter separately. Legacy Completed seals remain immutable. Exact display and physical mapping require the proposed Manuscript change first.

## Lifecycle operations

| Source | Intent | Result and guards |
|---|---|---|
| No Case | Doctor creates new complaint Case | OPEN, stable Patient link, no Visit/counter/Day side effect |
| OPEN | Same-complaint continuity | Remains OPEN; no 90-day cutoff; deliberate post-arrival recording creates separate Visit |
| OPEN | Doctor completion | COMPLETED plus new immutable completion fact; Visit/Day unchanged |
| COMPLETED | No explicit decision, arrival, lookup, form, recording attempt | Remains COMPLETED; no implicit reopen |
| COMPLETED | Doctor explicit same-complaint administrative reopen | OPEN plus linked immutable reopening fact if eligible; no Visit/arrival/Day/count effect |
| COMPLETED | Different complaint or outside calendar window | Reopening denied; independent new Case path, previous unchanged |

Case completion after full recovery/follow-up must not require inventing a currently With Doctor encounter. Proposed service guards prevent completing with unresolved in-progress writes; exact active-Visit conflict policy must be contracted without treating Visit Exit as completion. Multiple Cases may remain open. One Patient is never duplicated by a return. Visit count counts Visits; daily Case activity counts distinct Cases with actual recorded Visits, not all administrative openings/reopenings.

## Policy B rules

Only authenticated currently authorized Doctor can complete/reopen or confirm same complaint. Nurse operational recording requires separately defined delegation; no Nurse prerequisite. The Doctor may normally choose a new Case even when eligible to reopen the old one. Similar text is never clinical confirmation.

Africa/Cairo local date of actual completion event is Day0. Date difference 0…90 inclusive is eligible, Day91 is denied. Not 90×24 hours. Use server-authoritative actual event instants and correct IANA rules; working date/latest Visit/client clock never anchor. A decision earlier than completion is invalid. Missing/untrusted actor/instant/episode evidence denies without fabricated facts.

Engineering selection proposed for review: latest unmatched completion event of the Case is the applicable episode; second completion creates a fresh independently identified seal/window. All prior episodes retained. This is consistent with repeated cycles but must be explicitly reconciled in the effective lifecycle contract.

## Historical facts and future transaction boundary

Each successful completion/reopen: independent event ID, Case ID, authenticated Doctor ID, type, actual UTC instant, policy zone/calendar date, source/destination lifecycle and applicable completion reference. Reopen also records explicit same-complaint Doctor confirmation. Proposed technical provenance: policy version, operation ID, canonical meaning fingerprint and lifecycle version. Exact SQL representation remains proposed: bounded lifecycle fact records beside current Case lifecycle, not generic event sourcing/all-transition history.

Future command transaction must validate current session/authority, lock/version, Case ownership and applicable episode/calendar eligibility before effect; atomically persist lifecycle update, event and durable replay receipt. Failure leaves no partial mutation. Replayed same intent returns original result after authorized receipt access; changed meaning conflicts. Concurrent contradictory commands cannot overwrite newer episodes. Lost acknowledgement remains unknown and reconciles the same intent across reload/re-auth; receipt absence alone is not proof of rollback. No success until durable acknowledgement.

Reopening changes only Case lifecycle and its bounded event/receipt/version. No Visit creation, CPN allocation, arrival fact, working Day fabrication, old Visit/Rx edit, old Day reopening/protection change or Past History rewrite. Clinical History continues to derive from preserved Visits.

## Visit durable boundary — proposed engineering selection

Use an explicit Start Recording action after confirmed physical arrival. Save one Visit with selected Patient/Case, actual open Clinic Day, arrival condition/current complaint and actor/instant/operation identity; then acknowledge. Unsaved form is not a Visit. New Case creation and Visit creation are separable commands, but a combined explicit recording intent may transactionally create new Case+initial Visit if separately contracted. Replay never increments Visit count twice. Visit clinical content and authorized Rx remain separate capabilities; no empty defaults advertised as completed clinical recording.

## Proof matrix

Calendar unit tests in domain/case-policy-b.test.cjs are EXECUTED only when tied to a recorded test run; they establish calculation, not Doctor authority/trusted completion history or runtime reopening.

All lifecycle/service/API/real-PostgreSQL/browser tests below are PROPOSED / NOT RUN: default closed; Doctor same complaint Day0/89/90; Day91/different complaint/Nurse/unauthorized/revoked/expired denied; active continuity >90 days; administrative reopen before arrival with zero Visits/arrival/count/Day effect; exactly one deliberate recorded Visit; prior completion unchanged; second completion distinct; repeated intents no duplicate event; concurrent conflicts; month/year/leap/Cairo transitions; Day closure and Exit independent; old Visit/Rx unchanged; missing closure evidence no fabrication; lost COMMIT acknowledgement and reload/authenticated receipt recovery; restore preserves full graph/episodes/receipts. Real PG and original browser proof are mandatory before clinical closure.
