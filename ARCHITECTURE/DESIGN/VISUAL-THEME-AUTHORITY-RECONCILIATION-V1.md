# VISUAL THEME AUTHORITY & RECONCILIATION V1

## 1. DOCUMENT IDENTITY

DOCUMENT = VISUAL-THEME-AUTHORITY-RECONCILIATION-V1
PRODUCT = ViP-Clinic-
LINEAGE = Dr_Roby → ViP
DOCUMENT TYPE = VISUAL AUTHORITY / RECONCILIATION DEFINITION
STATUS = DEFINITION
IMPLEMENTATION_AUTHORIZED = NO

## 2. PURPOSE

This artifact establishes the authoritative boundary for the ViP Clinic
visual theme system.

The purpose is to reconcile the inherited Dr.Roby visual DNA with the
current ViP visual contribution and define a controlled Theme System in
which the Doctor may select an approved visual theme without changing
clinical, authority, persistence, security, or workflow semantics.

## 3. PRODUCT LINEAGE PRINCIPLE

The ViP Clinic preserves the historical Dr.Roby visual heritage while
allowing controlled evolution of the current product.

Historical visual implementation is preserved as product lineage evidence.
Current ViP implementation remains the current implementation surface.

The factory does not erase valid historical DNA merely because the current
implementation has evolved.

## 4. AUTHORITY BOUNDARY

A visual theme is PRESENTATION PREFERENCE only.

A theme MUST NOT establish, modify, transfer, infer, or revoke:

- Doctor Authority
- Main Admin status
- System Ownership
- Actor identity
- Actor lifecycle
- Patient identity
- Patient data
- Case state
- Visit state
- Clinic Day state
- Clinical decision authority
- Nurse delegation
- Persistence authority
- API authority
- Authentication
- Authorization
- Security policy
- Data retention
- Audit meaning
- Clinical safety rules

THEME_CHANGE = PRESENTATION_ONLY

THEME_CHANGE != AUTHORITY_CHANGE

THEME_CHANGE != DATA_CHANGE

THEME_CHANGE != WORKFLOW_CHANGE

THEME_CHANGE != SECURITY_CHANGE

## 5. IMPLEMENTATION GATE

No frontend source modification, Theme Engine implementation, persistence
of theme preference, or new UI behavior is authorized by this artifact alone.

Required sequence:

DEFINE → RECONCILE → PROVE → AUTHORIZE → BUILD → PROVE → CLOSE

FAIL = 0
## 6. INHERITED DR.ROBY VISUAL DNA

The inherited Dr.Roby visual DNA is the historical visual reference for
the current ViP Clinic product line.

The visual DNA includes, but is not limited to:

- Clinical-first presentation
- Dense structured information hierarchy
- Calm technical visual language
- Responsive mobile-first behavior
- RTL/LTR support
- Structured cards and panels
- Rounded clinical containers
- Light borders and controlled shadows
- Technical identifiers using monospaced typography
- Clear status signaling
- Doctor Authority surface
- Patient → Case → Encounter → Clinic Day continuity
- Clinical and architectural status markers

The historical visual DNA is a REFERENCE AUTHORITY for visual reconciliation.
It is not by itself implementation authorization.

## 7. CURRENT VIP VISUAL CONTRIBUTION

The current ViP implementation contains an additional visual direction
centered on a dark technical presentation.

Current observed contribution includes:

- Dark slate surfaces
- High-contrast white text
- Slate structural borders
- Teal technical accent
- Technical status emphasis
- Dense structured presentation
- Monospaced technical identifiers

This contribution MUST be preserved as current product lineage unless
explicitly reconciled and replaced by an authorized decision.

## 8. VISUAL RECONCILIATION PRINCIPLE

The Theme System MUST NOT treat the historical Dr.Roby visual DNA and the
current ViP visual contribution as mutually exclusive product histories.

Both are preserved.

The Theme System provides a controlled mechanism for expressing approved
visual variants while preserving the common Dr.Roby clinical visual DNA.

Historical DNA = PRESERVED

Current ViP CONTRIBUTION = PRESERVED

VISUAL RECONCILIATION = REQUIRED

UNAUTHORIZED VISUAL DELETION = PROHIBITED

## 9. INITIAL APPROVED THEME BASELINES

The initial Theme System SHALL define two baseline theme presets:

THEME_01 = DR_ROBY_LIGHT

THEME_02 = DR_ROBY_DARK

DR_ROBY_LIGHT represents the light/white clinical presentation.

DR_ROBY_DARK represents the dark/black technical presentation.

Both themes MUST share the same semantic visual vocabulary and product
identity.

A theme MUST NOT introduce a new clinical capability merely because the
theme exists.

## 10. FUTURE THEME EXTENSION

Additional themes MAY be defined in the future.

Future themes require their own explicit definition/reconciliation and
authorization.

No additional theme preset is implicitly authorized by this artifact.

FUTURE_THEME = NOT_AUTHORIZED_BY_DEFAULT

FAIL = 0
## 11. SHARED VISUAL TOKEN MODEL

The Theme System SHALL use shared semantic visual tokens rather than
allowing individual components to define independent theme semantics.

Shared tokens MAY represent:

- Background surfaces
- Elevated surfaces
- Primary text
- Secondary text
- Muted text
- Borders
- Primary action
- Secondary action
- Success
- Warning
- Danger
- Informational status
- Focus state
- Disabled state
- Clinical authority emphasis
- Technical identifier presentation

Theme presets MAY provide different visual values for these tokens.

The semantic meaning of a token MUST remain stable across themes.

TOKEN_MEANING = STABLE

TOKEN_PRESENTATION = THEME_DEPENDENT

## 12. THEME ENGINE BOUNDARY

The Theme Engine is a presentation-layer mechanism.

Its responsibility is limited to:

1. Resolving the currently selected approved theme.
2. Applying the corresponding visual token values.
3. Preserving the semantic meaning of shared tokens.
4. Allowing authorized theme switching.
5. Maintaining visual consistency across supported surfaces.

The Theme Engine MUST NOT become an authority engine, workflow engine,
clinical rules engine, persistence authority, authentication mechanism,
or authorization mechanism.

THEME_ENGINE = PRESENTATION_LAYER_ONLY

## 13. DOCTOR THEME SELECTION

The Doctor SHALL be able to select an approved theme from the available
Theme Presets.

Initial selectable presets:

- DR_ROBY_LIGHT
- DR_ROBY_DARK

The selection represents the Doctor's presentation preference.

Changing the selected theme MUST NOT change the Doctor's role, authority,
identity, clinical state, or application capabilities.

DOCTOR_THEME_CHOICE = PRESENTATION_PREFERENCE

## 14. ACTIVE THEME

At any point in the user interface, one approved theme SHALL be treated
as the active presentation theme.

Conceptually:

ACTIVE_THEME = SELECTED_APPROVED_THEME

If no explicit theme preference exists, the default behavior SHALL be
defined by a later authorized implementation decision.

This artifact does NOT authorize a specific persistence mechanism,
browser storage mechanism, server-side preference, or system-preference
integration.

DEFAULT_THEME_BEHAVIOR = DEFERRED

THEME_PREFERENCE_PERSISTENCE = DEFERRED

## 15. CROSS-THEME INVARIANTS

The following MUST remain invariant regardless of the selected theme:

- Same Doctor Authority
- Same Main Admin identity
- Same Actor identity
- Same Patient identity
- Same Patient data
- Same Case data
- Same Visit data
- Same Clinic Day data
- Same clinical decisions
- Same workflow state
- Same delegation boundaries
- Same persistence semantics
- Same API semantics
- Same authentication semantics
- Same authorization semantics
- Same security controls
- Same audit meaning
- Same data preservation behavior

LIGHT = SAME SEMANTICS

DARK = SAME SEMANTICS

THEME_SWITCH = NO_DOMAIN_MUTATION

FAIL = 0
## 16. RECONCILIATION DECISION

The historical Dr.Roby visual DNA and the current ViP visual contribution
are reconciled as two preserved parts of the same product lineage.

The Theme System is the controlled architectural direction for expressing
approved visual variants without fragmenting product identity.

RECONCILIATION_STATUS = DEFINED

DR_ROBY_VISUAL_DNA = PRESERVED

VIP_VISUAL_CONTRIBUTION = PRESERVED

THEME_SYSTEM_DIRECTION = ACCEPTED_FOR_DEFINITION

## 17. INITIAL THEME DECISION

The initial Theme System consists of two approved baseline definitions:

DR_ROBY_LIGHT
DR_ROBY_DARK

DR_ROBY_LIGHT preserves the clinical light presentation.

DR_ROBY_DARK preserves the technical dark presentation.

Neither baseline is superior in authority or clinical meaning.

THEME_AUTHORITY = EQUAL

LIGHT_AUTHORITY = SAME

DARK_AUTHORITY = SAME

## 18. PROOF REQUIREMENTS

Before Theme System implementation is authorized, the following MUST be
proven:

1. Shared semantic tokens are defined consistently.
2. Light and Dark themes map to the same semantic token vocabulary.
3. Theme switching does not mutate domain data.
4. Theme switching does not mutate authority.
5. Theme switching does not alter workflow state.
6. Theme switching does not alter authentication or authorization state.
7. Theme switching does not alter persistence semantics.
8. Existing Dr.Roby visual DNA remains identifiable.
9. Current ViP visual contribution remains represented or explicitly
   reconciled.
10. Responsive and RTL/LTR behavior remain preserved.
11. Clinical status meanings remain visually distinguishable in both themes.
12. Accessibility and readability are not degraded by either baseline.
13. Theme selection remains limited to approved presets.

THEME_PROOF_REQUIRED = YES

## 19. AUTHORIZATION GATE

This reconciliation artifact establishes the visual Theme System direction
but does NOT authorize implementation.

Implementation requires a separate explicit authorization decision after
the reconciliation and proof requirements are reviewed.

Until that decision exists:

FRONTEND_THEME_IMPLEMENTATION = NOT_AUTHORIZED

THEME_ENGINE_IMPLEMENTATION = NOT_AUTHORIZED

THEME_SELECTOR_IMPLEMENTATION = NOT_AUTHORIZED

THEME_PREFERENCE_PERSISTENCE = NOT_AUTHORIZED

NEW_THEME_CREATION = NOT_AUTHORIZED

## 20. SAFETY AND DATA PRESERVATION INVARIANT

No theme operation may become a destructive operation.

Changing a theme MUST NOT delete, overwrite, transform, migrate, reset,
duplicate, or otherwise alter clinical or identity data.

Theme presentation MUST remain orthogonal to product data preservation.

DATA_PRESERVATION = INVARIANT

THEME_DATA_MUTATION = PROHIBITED

## 21. FINAL DECISION

VISUAL_THEME_AUTHORITY = DEFINED

VISUAL_THEME_RECONCILIATION = DEFINED

DR_ROBY_LIGHT = DEFINED

DR_ROBY_DARK = DEFINED

DOCTOR_THEME_SELECTION = DEFINED

SHARED_VISUAL_TOKENS = DEFINED

CROSS_THEME_INVARIANTS = DEFINED

PROOF_REQUIREMENTS = DEFINED

IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED

PRODUCTION_AUTHORIZATION = NONE

REAL_USE_AUTHORIZATION = NONE

VIBE_CODING_AUTHORITY = NONE

NEXT_GATE = THEME_RECONCILIATION_PROOF_AND_AUTHORIZATION

FAIL = 0
