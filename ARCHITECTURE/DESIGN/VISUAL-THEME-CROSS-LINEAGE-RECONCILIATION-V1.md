# VISUAL THEME CROSS-LINEAGE RECONCILIATION V1

STATUS = RECONCILIATION
CROSS_LINEAGE_RECONCILIATION = SUPPORTED
SHARED_SEMANTIC_VISUAL_VOCABULARY = SUPPORTED
THEME_DEPENDENT_PRESENTATION = SUPPORTED
DR_ROBY_LIGHT_DIRECTION = SUPPORTED
DR_ROBY_DARK_DIRECTION = SUPPORTED
IMPLEMENTATION_AUTHORIZED = NO
PRODUCTION_AUTHORIZATION = NONE

PURPOSE

This artifact records the reconciled visual relationship between the historical Dr.Roby visual DNA and the current VIP visual contribution.

RECONCILIATION_SCOPE = PRESERVED → CHANGED → RECONCILE → TOKENIZE

IMPLEMENTATION = NOT AUTHORIZED
FAIL = 0

PRESERVED

- Clinical-first visual language
- Dense structured hierarchy
- Clinical cards and panels
- Slate structural hierarchy
- Rounded clinical containers
- Controlled borders and shadows
- Technical identifiers with monospaced presentation
- RTL/LTR support
- Responsive/mobile-first behavior
- Doctor Authority surface
- Patient → Case → Encounter → Clinic Day continuity
- Clinical status signaling
- Focus and disabled states
- Structured max-width clinical layout

PRESERVED_STATUS = SUPPORTED

CHANGED

- Primary accent presentation: Dr.Roby blue vocabulary → VIP teal vocabulary
- Base canvas presentation: Dr.Roby clinical light surfaces → VIP predominantly dark shell
- Surface recipes and contrast levels differ between the lineages
- Informational accent presentation differs
- Typography presentation includes distinct Doctor signature styling in VIP

CHANGED_STATUS = SUPPORTED

RECONCILE

- Color hue is presentation; semantic meaning must remain stable
- Blue and teal are not authority by themselves
- Doctor Authority is represented structurally, not chromatically
- Primary action becomes a semantic token independent of hue
- Status meanings remain stable while presentation may vary by theme
- Dark surfaces are not exclusive to VIP; Dr.Roby also contains dark authority and technical surfaces
- Shell, panel, nested-panel and input surfaces become presentation mappings
- Identifier and status chip recipes are normalized through semantic roles
- Theme variation must preserve clinical hierarchy, authority semantics and workflow meaning

RECONCILIATION_STATUS = SUPPORTED

TOKENIZE

SURFACE:
- canvas
- shell
- panel
- panel-nested
- input

TEXT:
- primary
- secondary
- muted
- technical

BORDER:
- structural
- focus

ACTION:
- primary
- secondary
- destructive

STATUS:
- success
- warning
- danger
- info
- active

AUTHORITY:
- clinical-authority
- doctor-signature
- verified-badge

IDENTITY:
- technical-identifier
- selection-active

LAYOUT:
- rtl
- ltr
- responsive

SHAPE:
- radius
- shadow

TOKENIZATION_STATUS = SUPPORTED
