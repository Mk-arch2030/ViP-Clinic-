# ROBY Local Artifacts Preservation — 2026-10-13

STATUS: HISTORICAL PRESERVATION ONLY
IMPLEMENTATION_AUTHORIZATION: NONE
PRODUCTION_AUTHORIZATION: NONE

These four snapshots were copied byte-for-byte from the
owner's Termux working tree.

## Preserved artifacts

- index.css.local-snapshot
  Local CSS state; removes earlier certified prescription
  print rules. Not approved as production CSS.

- VISUAL-THEME-IMPLEMENTATION-AUTHORIZATION-REVIEW-V1.md
  Theme authorization review; final decision remains pending.

- register-new-patient-route.js.snapshot
  Patient registration route fragment. Not wired into
  runtime by this archive.

- PatientIntake.tsx.pre-light-migration
  Historical intake component before later integration changes.

## Boundaries

- Do not import these files into active application code.
- Do not register an additional POST /patients route.
- Do not replace active prescription print styling.
- Do not treat this archive as clinical or theme authorization.
- Do not infer clinical E2E or PostgreSQL proof from preservation.
- Original owner working-tree files remain untouched.

## Verification

The four snapshot SHA-256 values are recorded in SHA256SUMS.
