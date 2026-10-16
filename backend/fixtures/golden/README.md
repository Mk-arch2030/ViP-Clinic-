# Golden Baseline V1 — immutable historical reference

Source branch observed at 3caa11b0af88219e42d1e6dcf3c96ad2bd1c781b.
The literal seeds are byte-equivalent in meaning at the initial application commit
c473be0b588078e40bd5c0554b8a24113277d7d5 and the current clinicStore source (last
changed by 96fa03a17333ff23721799693151c5162199c2ab).

Files:
- baseline-v1.json: canonical empty-storage initial ClinicState.
- clinicStore.initial.ts.source.txt: initial raw source, byte-for-byte.
- clinicStore.current.ts.source.txt: audited current raw source, byte-for-byte.
- manifest-v1.json: revisions, source hashes, counts, provenance and known gaps.
- reference.cjs: pinned checksum references. Tests also pin the baseline hash literally.
- capture.cjs: AST literal reader; it returns a value and has no writer/regeneration CLI.

SHA-256 of canonical JSON bytes:
2c29163ab399e99b70918bd179da5e9e2ce3e0df271cf5faeb290952321dba12

The capture sorts object keys only. Array order, clinical wording, original phone
strings and names, CPNs, UUIDs, dates, nulls and relationships are preserved. Source
names and phone strings are confirmed historical demonstration data from the owner's
mock; they are not newly introduced real patient information. They must remain test
fixtures and never be imported into a real patient database.

Inventory: patients CPN-1001/1002/1003; cases C-001/002/003; visits V-001/002/004/003
in original array order; prescriptions RX-V001/V002/V004/V003; one seeded clinic day
CD-2026-09-22. C-003 has V-004 (2026-09-20 initial) then V-003 (2026-09-22 follow-up).
Three prescriptions are authorized and one is a draft. Six medication items across
the four prescriptions are preserved exactly in JSON.

The source references CD-2026-09-20 from C-003 and V-004 but does not seed that day's
record. Verification explicitly permits only those two exact historical gaps. No
missing row, completion state or doctor UUID is invented to repair it.

The initial state has no generated timestamps or random IDs. Later store mutations
use crypto.randomUUID and new Date; those outputs are generated demonstration state,
not baseline records. Existing application/backend/auth/browser-proof test fixtures
are later synthetic test data, not original seeds. Arbitrary saved localStorage
contents have unknown provenance and are excluded.

Any mutation changes the pinned hash and fails tests. There is no normal regeneration
that overwrites this baseline. An owner-authorized future baseline revision needs a
new artifact/version and explicit provenance/hash review, retaining V1.
