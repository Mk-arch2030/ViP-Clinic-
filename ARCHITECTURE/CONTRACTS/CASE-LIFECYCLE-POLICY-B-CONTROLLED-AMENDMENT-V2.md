# Case Lifecycle Policy B — Controlled Amendment V2

STATUS = RECONCILED BOUNDED CONTRACT DEFINITION / RUNTIME NOT PROVEN
OWNER_POLICY = APPROVED
AUTHORITY = OWNER DIRECTIVE 2026-10-13 + EXACT AMENDED MANUSCRIPT SECTIONS 5 AND 13
CLINICAL_MUTATION_CONTRACT = DEFINED_WITH_EXPLICIT_REMAINING_GATES
NEXT_CLINICAL_POSTGRESQL_IMPLEMENTATION = NOT AUTHORIZED
IMPLEMENTED_POLICY_SUBSET = CALENDAR_COMPUTATION_ONLY

This additive definition supersedes the uncommitted V1 draft's need to choose one operational reopening destination. It incorporates the owner-approved independent lifecycle and administrative reopening before arrival. Prior proposals/reports and all original closed contracts remain historical records. No runtime lifecycle transition is authorized by prose alone.

## Authoritative bounded domain model

Patient: existing technical UUID and stable CPN. Patient 1→many Cases. Case: one complaint/problem, one Patient, independent lifecycle OPEN or COMPLETED, no mandatory opening Clinic Day. Visit: one Case and one actual Clinic Day, created by deliberate Start Recording after physical arrival. Clinic Day: existing working-date context, independent start/closure; no manufactured Day on administrative action.

OPEN/COMPLETED is the independent Case lifecycle dimension, not a sixth queue state. Encounter progression belongs to recorded Visits. No arrival/queue/Doctor/Exit value exists merely because a Case was created/reopened. UI keeps the original dossier/consultation/census identity, showing Case lifecycle and available current encounter separately. Legacy Completed seals remain immutable. The owner-approved Manuscript amendment is applied; historical contracts are qualified only by the explicit supersession map in CASE-LIFECYCLE-POLICY-B-RECONCILIATION-V2.md.

## Lifecycle operations

| Source | Intent | Result and guards |
|---|---|---|
| No Case | Doctor creates new complaint Case | OPEN, stable Patient link, no Visit/counter/Day side effect |
| OPEN | Same-complaint continuity | Remains OPEN; no 90-day cutoff; deliberate post-arrival recording creates separate Visit |
| OPEN | Doctor completion | COMPLETED plus new immutable completion fact; Visit/Day unchanged |
| COMPLETED | No explicit decision, arrival, lookup, form, recording attempt | Remains COMPLETED; no implicit reopen |
| COMPLETED | Doctor explicit same-complaint administrative reopen | OPEN plus linked immutable reopening fact if eligible; no Visit/arrival/Day/count effect |
| COMPLETED | Different complaint or outside calendar window | Reopening denied; independent new Case path, previous unchanged |

Case completion after full recovery/follow-up must not require inventing a currently With Doctor encounter. Future services MUST prevent partial writes; completion while a Visit remains active and completion before any recorded Visit remain clinical decision gates, not invented automatic guards. Multiple Cases may remain open. One Patient is never duplicated by a return. Visit count counts Visits; daily Case activity counts distinct Cases with actual recorded Visits, not all administrative openings/reopenings. A newly created Case may have zero recorded Visits; creating the first Visit is a separate deliberate action or an explicitly contracted combined recording intent.

## Policy B rules

Only authenticated currently authorized Doctor can complete/reopen or confirm same complaint. Nurse operational recording requires separately defined delegation; no Nurse prerequisite. The Doctor may normally choose a new Case even when eligible to reopen the old one. Similar text is never clinical confirmation.

Africa/Cairo local date of actual completion event is Day0. Date difference 0…90 inclusive is eligible, Day91 is denied. Not 90×24 hours. Use server-authoritative actual event instants and correct IANA rules; working date/latest Visit/client clock never anchor. A decision earlier than completion is invalid. Missing/untrusted actor/instant/episode evidence denies without fabricated facts.

The latest applicable unmatched successful completion event of the Case is the reopening episode. Reopening references and consumes only that episode's eligibility; another successful completion creates a new independently identified seal and calendar window. All prior episodes remain preserved. If current lifecycle, event chain or latest unmatched episode is missing, contradictory or untrusted, deny the effect without inventing evidence. No choice of an older convenient episode is permitted.

## Historical facts and future transaction boundary

Each successful completion/reopen MUST preserve: independent event ID, Case ID, authenticated Doctor ID, type, actual UTC instant, policy zone/calendar date, source/destination lifecycle and applicable completion reference. Reopen also records explicit same-complaint Doctor confirmation. Required bounded technical provenance is policy version, operation ID, canonical meaning fingerprint and resulting lifecycle version. Use bounded lifecycle fact records beside current Case lifecycle, not generic event sourcing/all-transition history. History is append-only for normal clinical operations; no event UPDATE/DELETE is permitted by this contract. Current OPEN state never requires earlier completion facts to be nulled or removed.

Future command transaction must validate current session/authority, lock/version, Case ownership and applicable episode/calendar eligibility before effect; atomically persist lifecycle update, event and durable replay receipt. Failure leaves no partial mutation. Replayed same intent returns original result after authorized receipt access; changed meaning conflicts. Concurrent contradictory commands cannot overwrite newer episodes. Lost acknowledgement remains unknown and reconciles the same intent across reload/re-auth; receipt absence alone is not proof of rollback. No success until durable acknowledgement.

Reopening changes only Case lifecycle and its bounded event/receipt/version. No Visit creation, CPN allocation, arrival fact, working Day fabrication, old Visit/Rx edit, old Day reopening/protection change or Past History rewrite. Clinical History continues to derive from preserved Visits.

## Visit durable boundary

Use an explicit Start Recording action after confirmed physical arrival. Save one Visit with selected Patient/Case, actual open Clinic Day, arrival condition/current complaint and actor/instant/operation identity; then acknowledge. Unsaved form is not a Visit. New Case creation and Visit creation are separable commands, but a combined explicit recording intent may transactionally create new Case+initial Visit if separately contracted. Replay never increments Visit count twice. Visit clinical content and authorized Rx remain separate capabilities; no empty defaults advertised as completed clinical recording.

## Normative recording, ownership and counting rules

Patient enrollment, CPN lookup, selecting a Case, opening/typing an unsaved form, physical arrival alone, new administrative Case and administrative reopening MUST NOT create Visit or increment its count. Start Recording is an explicit authenticated intent after actual arrival, carrying an arrival-confirmation assertion, selected Patient/Case/Day, captured arrival condition and nonempty current complaint. Server recording time is the actual durable recording-event timestamp; it MUST NOT be passed off as the patient's independently measured physical arrival time. No pre-arrival appointment or fabricated historical arrival is allowed.

Initial recorded Visit operational status is AWAITING_DOCTOR. Explicit Doctor encounter start moves it to WITH_DOCTOR. Explicit authorized Exit moves it to EXITED; an exited Visit cannot be reset by creating a later Visit. Visit Exit does not establish Case completion even if no further follow-up is requested. Doctor-recorded Exit and Follow-up retains OPEN Case. The displayed historical label Exited — Follow-up Pending must not assert follow-up when no such decision is recorded. Completed communicates Case lifecycle, not a replacement Visit operational status. Arrived — Awaiting Registration remains familiar historical/interface terminology and is not a new implicit persistent Visit-creation trigger. No sixth label is introduced.

A Visit MUST reference exactly one Case and one applicable Clinic Day. That Day MUST be OPEN at durable recording creation; its later closure preserves the Visit/link and does not invalidate history. Derive Patient identity through Case ownership, or enforce equivalent relational consistency if a redundant Patient link is selected; a caller-supplied Patient/Case mismatch rejects. Patient, Case and Visit technical identities are distinct server-generated UUIDs; operation identity is not resource identity. CPN allocation occurs only through the established Patient registration authority. Case may reference zero or many preserved Visits and span many Days. Administrative Case create/reopen does not require a Day. No same-name or similar-complaint identity merge is allowed.

Visit count is derived from durably committed Visit rows, including a committed Visit whose client acknowledgement was lost, not from lifecycle events or client success messages. Per-Day Case activity counts distinct Case identities with recorded Visits on that Day; repeated Visits to one Case count as multiple Visits and one active Case for that Day. Start Day, administrative Case creation/reopening, enrollment and rolled-back/replayed recording add zero additional Visits. If a materialized counter is later selected, it MUST update in the same transaction and equal the derived count; the historical clinic_days.counter field is not silently redefined by this documentation.

Doctor can execute the full authorized operational flow alone. This initial definition reserves clinical creation/linkage/continuity/completion/reopening to Doctor. Nurse recording/Exit requires a separately approved capability/delegation contract checked by the server; no Nurse capability is implicitly enabled. Nurse must never establish same-complaint clinical linkage, completion/reopening or Rx authorization. No Secretary/new actor or mandatory staffing is introduced.

## Bounded future persistence/service representation — definition only

Select separate Case current-lifecycle, Visit encounter, immutable Case lifecycle-fact and durable operation-receipt structures. Case preserves Patient UUID, Doctor-established clinical problem reference/summary, OPEN/COMPLETED lifecycle and monotonic version. No mandatory opening Clinic Day, artificial title/diagnosis, historical completion nulling or implicit Visit. Visit preserves Case UUID, Clinic Day reference, recording identity/instant/actor and operational status, with clinical content under its separately authorized Visit boundary. Lifecycle fact fields are defined above; each reopening links its completion fact, and each completion has a distinct event ID/version. Retain Doctor identity, not merely a role string. Clinical History is derived from preserved Visits, with deterministic recorded chronology and UUID tie-break; no mutable independent latest-history source is introduced.

Visit Type rules in CONTRACT-08 §7 remain binding: first recorded Visit is Visit & Consultation; later selection/confirmation and second-Visit establishment remain Doctor decisions and must be represented, not inferred from a constant UI string. Initial recording does not falsely claim that later diagnostic/treatment/follow-up content is complete: uncaptured values stay explicitly uncaptured within their existing clinical boundaries; no invented diagnosis, normal vitals, allergy absence or follow-up decision is used to satisfy a shape. Full clinical-record cardinality/content acceptance remains a separate proof gate, not relaxed by the structural Visit slice.

Receipt key is authenticated actor identity plus durable operation ID. Bind operation kind, schema/policy version and canonical request meaning fingerprint; one intent cannot switch kind/payload. Preserve result resource/event identities and acknowledged resulting version atomically with effect. Reauthorize replay/receipt read against current session and access policy. Same-key/same-meaning committed replay returns the original outcome without reapplying effect or choosing a new completion episode, even after later state/window/Day changes. Same-key/different-meaning conflicts. A different key does not bypass current state/version/ownership guards. Receipt absence alone cannot prove an earlier in-flight request will never commit.

Transaction ownership stays in the authenticated application service: authorization, Case/Day guards, state/event/Visit/count and receipt use the same transaction client and outer COMMIT. Repositories MUST NOT independently commit. Preserve existing authentication transaction serialization until separately reviewed. Future clinical effects lock the affected Case; recording also coordinates with Day closure. Select consistent Day-before-Case business lock ordering when both are touched; administrative Case operations acquire no Day lock. Version/precondition conflicts and timeouts must return a bounded rejection/unknown acknowledgement as appropriate, with no partial business effects. Client clock is never authority; calculate eligibility from a fresh authoritative server event/effect instant after serialization, and store that same instant/date on the event. A Day closing concurrently with recording cannot produce a Visit outside the valid open-Day transaction boundary.

No schema DDL, migration, repository or endpoint execution is granted here. Future API must reject role/actor/timestamp/lifecycle override fields, preserve existing origin/session/CSRF controls, and explicitly authorize its new Doctor operations; reuse of a Patient permission as a clinical capability is forbidden. No protected demo/localStorage clinical fallback. Unknown acknowledgement requires authenticated same-intent receipt reconciliation after reload; minimal local recovery metadata cannot contain credentials or clinical payload and cannot substitute for the server receipt. Existing Patient marker remains a denial guard with its recorded limitations.

## Remaining clinical gates and excluded scope

The longitudinal model/Policy B calendar/episode anchor are settled by owner authority. Before any affected clinical operation, separately decide: completion with an active Visit or before a first recorded Visit; clinic-wide active-Day/overnight selection rules; simultaneous active or same-day repeated Visit policy; exact delegated Nurse permissions if included. Until decided, affected writes are outside executable scope. No arbitrary elapsed-time cutoff applies to active Case continuity. No later Visit may overwrite prior clinical history or unprotect earlier Rx/Visit/Day. Clinical content amendments, prescription certification/correction, Day protection and historical data import retain their separate contracts and authority gates.

## Authority and closure boundary

This is the effective bounded contract definition under the applied owner-approved Manuscript and directive §6, reconciled by the companion map. It is not CLOSED + PROVEN runtime, clinical release or authorization to implement the next Case/Visit PostgreSQL slice. Definition validation, source implementation, local unit/DOM proof, real database/browser proof and owner clinical release remain separate statuses. Original CLOSED contracts and prior proposal versions remain in Git as historical evidence.

## Proof matrix

Calendar unit tests in domain/case-policy-b.test.cjs are EXECUTED only when tied to a recorded test run; they establish calculation, not Doctor authority/trusted completion history or runtime reopening.

All lifecycle/service/API/real-PostgreSQL/browser tests below are PROPOSED / NOT RUN: default closed; Doctor same complaint Day0/89/90; Day91/different complaint/Nurse/unauthorized/revoked/expired denied; active continuity >90 days; administrative reopen before arrival with zero Visits/arrival/count/Day effect; exactly one deliberate recorded Visit; prior completion unchanged; second completion distinct; repeated intents no duplicate event; concurrent conflicts; month/year/leap/Cairo transitions; Day closure and Exit independent; old Visit/Rx unchanged; missing closure evidence no fabrication; lost COMMIT acknowledgement and reload/authenticated receipt recovery; restore preserves full graph/episodes/receipts. Real PG and original browser proof are mandatory before clinical closure.
