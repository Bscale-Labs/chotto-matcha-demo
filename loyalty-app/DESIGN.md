# Chotto Matcha Global Design System

Date: 2026-07-04
Status: Working design constitution
Applies to: customer PWA, cashier tablet, manager console, shared UI

Live visual reference: `/design-system`

Primary implementation files:

- `app/globals.css` - CSS variables, global surfaces, material utilities
- `tailwind.config.ts` - Tailwind names mapped to CSS variables
- `components/shared/*` - reusable UI primitives
- `components/customer/*`, `components/cashier/*`, `components/manager/*` - role-specific patterns

## Why This Exists

This app serves three very different moments:

- A customer checking rewards one-handed in or near a cafe.
- A cashier moving quickly while a line is forming.
- A manager scanning tables, staff, inventory, and transactions.

The system must feel premium without becoming precious. Chotto Matcha is not a generic SaaS dashboard and not a decorative landing page. It is a calm loyalty product with the sensory cues of matcha, ceramic cups, warm paper, and polished glass.

The visual direction is:

> Warm matcha glass over quiet paper.

That means soft translucency, edge highlights, and green-tinted depth, but only where those effects clarify hierarchy. The design should feel like modern mobile liquid glass translated into Chotto Matcha's brand: warmer, calmer, less futuristic, and more legible.

## Research Basis

This direction is based on current platform and usability guidance, not just taste.

- Apple's Liquid Glass guidance describes glass as a dynamic material for floating controls and navigation, not a blanket card style. It emphasizes lensing, adaptive shadows, tint, legibility, and a separate control layer above content. Source: [Apple WWDC25, Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/).
- Apple's guidance explicitly warns against putting glass everywhere, especially in the content layer or stacked on other glass, because it muddies hierarchy. Source: [Apple Human Interface Guidelines, Materials](https://developer.apple.com/design/human-interface-guidelines/materials).
- Material Design 3 treats elevation as a combination of surface tone and shadow, which maps well to this app's warm paper and matcha-tinted layers. Source: [Android Developers, Material 3 elevation](https://developer.android.com/develop/ui/compose/designsystems/material3#elevation).
- NN/g's glassmorphism guidance identifies opacity, background blur, strokes, and gradients as the core levers, while warning that overuse causes readability and usability problems. Source: [NN/g, Glassmorphism](https://www.nngroup.com/articles/glassmorphism/).
- WCAG 2.2 and WAI guidance make focus visibility, non-text contrast, and focus contrast important for translucent UI. Source: [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [WAI Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html).
- Mobile research consistently points to generous tap targets and spacing. This matters more than visual polish in the customer and cashier surfaces. Sources: [NN/g Touch Targets](https://www.nngroup.com/articles/touch-target-size/) and [Baymard mobile tap targets](https://baymard.com/learn/website-usability).

## The Real Meaning Of "Semi-Gloss Liquid Glass"

Do not interpret "liquid glass" as:

- Transparent cards everywhere
- Frosted blur on every panel
- Blue-tinted iOS imitation
- Decorative shine that makes text harder to read
- Stacking translucent surfaces until the app feels foggy

For this app, it means:

- A distinct floating layer for navigation, sticky controls, high-value CTAs, and modal shells
- Warm translucent fills that still preserve text contrast
- Subtle light on the top edge and rim of controls
- Green-tinted shadows that suggest depth without heaviness
- Content that remains mostly solid, readable, and calm
- Reduced-transparency and high-contrast fallbacks that still look intentional

The shorthand:

> Content is paper. Controls are glass. Primary actions are matcha lacquer.

## North Star

Chotto Matcha should feel like a premium cafe object, not software chrome.

Use these words to judge UI:

- Calm
- Fresh
- Polished
- Tactile
- Legible
- Warm
- Precise

Avoid these qualities:

- Foggy
- Neon
- Plastic
- Overdecorated
- Generic SaaS
- Childish
- Slippery
- Low-contrast

## Experience Principles

1. Clarity first, gloss second.
   No translucency is worth a readability loss. Glass earns its place by improving hierarchy.

2. One floating layer per area.
   A bottom nav, sticky toolbar, modal, or account pill can be glass. The content below should usually stay paper or milk.

3. Let matcha be the brand signal.
   Use matcha green for action, progress, and status. Do not wash entire screens in green.

4. Make touch feel physical.
   Controls need real target size, clear active states, and pressed feedback.

5. Keep customer soft, cashier fast, manager dense.
   The same tokens apply everywhere, but the amount of gloss changes by role.

6. Imagery should be inspectable.
   Rewards and products should show clear, useful imagery. Do not hide real products under dark overlays or decorative blur.

7. Motion confirms state.
   Motion may make a control feel alive, but it must never delay cashier or manager work.

## Layer Model

The app has five conceptual layers. Design decisions should start here.

| Layer | Name | Purpose | Typical Surfaces | Glass Allowed |
| --- | --- | --- | --- | --- |
| 0 | Environment | Route background and atmosphere | `customer-surface`, `cashier-surface`, manager page background | No blur, subtle gradients only |
| 1 | Content | Reading, data, forms, rewards, tables | cards, lists, forms, reward items, ledger rows | Usually no |
| 2 | Control Glass | Navigation and floating controls | bottom nav, top pills, sticky bars, segmented controls | Yes |
| 3 | Focus | Modals, sheets, QR, redemption confirmation | modal panels, QR holder, confirmation panels | Yes, with stronger opacity |
| 4 | Feedback | Toasts, loading, success, error | toast, inline alerts, temporary banners | Light gloss or solid tint |

Key rule:

> Glass belongs mostly to layers 2 and 3. Content belongs to layer 1.

## Material Vocabulary

### Paper

The base content material. Use it for manager tables, customer reward lists, cashier forms, and most readable content.

Traits:

- Opaque or nearly opaque
- Warm cream, rice, milk, or stone
- Fine border
- Minimal shadow
- No backdrop blur

Use for:

- Tables
- Forms
- Reward catalog cards
- Activity rows
- Settings panels
- Manager CRUD screens

### Milk Glass

The default semi-gloss material. It is warm, readable, and slightly translucent.

Traits:

- `0.78` to `0.92` fill opacity
- Soft top highlight
- Border that catches light
- Optional `8px` to `14px` backdrop blur
- Low green-tinted shadow

Use for:

- Customer bottom nav
- Sticky top controls
- Account/session pills
- QR container
- Modal surface
- Floating filter bars

### Clear Glass

The most transparent material. Use rarely.

Traits:

- More visible background
- Needs localized dimming or diffusion underneath
- Works only with bold icons or labels
- Not for paragraphs, data, or forms

Use for:

- Icon-only controls over reward imagery
- Small media overlays
- Temporary preview controls

Do not use for:

- Table containers
- Long text
- Form fields
- Cashier confirmation actions

### Matcha Lacquer

The solid primary action material. It is glossy through edge highlight and shadow, not transparency.

Traits:

- Deep matcha fill
- Cream text
- Pill radius
- Small top highlight or shadow
- Strong pressed state

Use for:

- Primary CTA
- Cashier confirm action
- Customer "Show my QR"
- Manager save action

### Ceramic

A quiet dense material for manager and cashier operational areas.

Traits:

- Stone or cream base
- Clear border
- Little to no blur
- Crisp text
- Stable layout

Use for:

- Manager stat cards
- Data tables
- Cashier customer summary
- Settings panels

## Color System

Use these existing CSS variables before adding new colors.

| Token | Value | Role |
| --- | --- | --- |
| `--matcha-deep` | `#2F4B2E` | Primary actions, active nav, strong headings |
| `--forest` | `#3E5A36` | Hover/pressed depth, dark matcha surfaces |
| `--sage` | `#A8B48A` | Soft accent, progress, secondary visual interest |
| `--sage-tint` | `#DCE3CD` | Pressed state, tier badges, soft active fill |
| `--sage-wash` | `#EEF1E5` | Hover wash, success background, focus wash |
| `--stone` | `#F3F1EC` | Manager/cashier utility background |
| `--cream` | `#FAF7F2` | Main app base |
| `--milk` | `#FFFDF8` | Lifted glossy controls |
| `--rice` | `#F7F1E7` | Customer warmth and page body |
| `--charcoal` | `#2B2B2B` | Primary text |
| `--ink-muted` | `#6B6E66` | Secondary text |
| `--ink-faint` | `#9CA095` | Placeholders and quiet disabled text |
| `--line` | `#E4E1D9` | Standard borders |
| `--line-soft` | `#ECE9E2` | Low-emphasis dividers |
| `--cashier-rail` | `#18381F` | Cashier navigation rail depth |
| `--cashier-rail-2` | `#24492B` | Cashier navigation gradient |

### Color Rules

- Do not introduce cool blues for glass. This brand's glass is warm cream and sage.
- Do not use purple, violet, cyan, or saturated blue gradients.
- Matcha green is for action and meaning, not decoration.
- Sage is the softness layer. It should support, not dominate.
- Cream and rice are the visual breath of the app.
- Charcoal text must remain the default over light surfaces.
- Do not place `ink-muted` text on translucent low-contrast surfaces unless verified.

### Functional Colors

Use functional colors sparingly.

| Need | Recommended |
| --- | --- |
| Error border | `#C56B53` |
| Error text | `#8C3D2A` |
| Warning fill | `#F5E2DA` |
| Success | Prefer matcha/sage tokens |
| Info | Prefer neutral or sage, not blue |

## Proposed Material Tokens

The current app already has strong base tokens. If we codify the glass layer in CSS, use token names like these.

```css
:root {
  --glass-fill: rgba(255, 253, 248, 0.78);
  --glass-fill-strong: rgba(255, 253, 248, 0.90);
  --glass-fill-clear: rgba(255, 253, 248, 0.48);
  --glass-border: rgba(255, 253, 248, 0.62);
  --glass-border-green: rgba(47, 75, 46, 0.12);
  --glass-highlight: rgba(255, 255, 255, 0.58);
  --glass-shadow: 0 18px 42px rgba(47, 75, 46, 0.12);
  --glass-shadow-strong: 0 24px 54px rgba(47, 75, 46, 0.18);
  --glass-blur: 14px;
  --glass-blur-strong: 20px;
  --glass-saturate: 1.14;
}
```

Do not add these until a real component needs them. When added, update `/design-system`.

## Material Recipes

### Paper Surface

Use when readability matters most.

```css
.surface-paper {
  border: 1px solid var(--line-soft);
  background: var(--cream);
  box-shadow: var(--shadow-sm);
}
```

### Milk Glass Surface

Use for floating navigation and sticky controls.

```css
.surface-glass {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 253, 248, 0.62);
  background:
    linear-gradient(180deg, rgba(255, 253, 248, 0.88), rgba(255, 253, 248, 0.72)),
    rgba(250, 247, 242, 0.76);
  box-shadow:
    0 18px 42px rgba(47, 75, 46, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.66);
  backdrop-filter: blur(14px) saturate(1.14);
  -webkit-backdrop-filter: blur(14px) saturate(1.14);
}

.surface-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.42), transparent 38%);
  opacity: 0.48;
}
```

### Strong Focus Glass

Use for modal panels, QR focus surfaces, and redemption confirmation.

```css
.surface-glass-strong {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(47, 75, 46, 0.14);
  background:
    linear-gradient(180deg, rgba(255, 253, 248, 0.94), rgba(255, 253, 248, 0.84)),
    rgba(250, 247, 242, 0.88);
  box-shadow:
    0 24px 54px rgba(47, 75, 46, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(1.12);
  -webkit-backdrop-filter: blur(20px) saturate(1.12);
}
```

### Matcha Lacquer Button

Use for primary actions.

```css
.action-lacquer {
  border: 1px solid rgba(255, 253, 248, 0.16);
  background:
    linear-gradient(180deg, rgba(255, 253, 248, 0.12), transparent 42%),
    var(--matcha-deep);
  color: var(--cream);
  box-shadow:
    0 8px 18px rgba(47, 75, 46, 0.20),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
```

### Scroll Edge Diffusion

Use when content scrolls under a glass nav or sticky header.

```css
.scroll-edge-diffuse {
  background:
    linear-gradient(180deg, rgba(250, 247, 242, 0.94), rgba(250, 247, 242, 0)),
    linear-gradient(180deg, rgba(255, 253, 248, 0.62), rgba(255, 253, 248, 0));
  pointer-events: none;
}
```

Purpose: prevent moving text or images from colliding visually with glass.

## Reduced Transparency And Contrast

Glass must degrade gracefully.

When the user prefers less transparency, or when the browser does not support backdrop filters, use a more opaque material.

```css
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .surface-glass,
  .surface-glass-strong {
    background: rgba(255, 253, 248, 0.96);
  }
}

@media (prefers-reduced-transparency: reduce) {
  .surface-glass,
  .surface-glass-strong {
    background: rgba(255, 253, 248, 0.98);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

@media (prefers-contrast: more) {
  .surface-glass,
  .surface-glass-strong {
    border-color: var(--matcha-deep);
    background: var(--milk);
  }
}
```

If `prefers-reduced-transparency` support is uneven, still keep the fallback pattern. It documents intent and improves support as browsers catch up.

## Typography

Current fonts:

- Display: `Playfair Display`
- Body: `Inter`

This pairing works for Chotto Matcha. Playfair gives ceremony and softness. Inter gives operational clarity. Do not add another font unless the brand direction changes.

### Type Roles

| Role | Font | Use |
| --- | --- | --- |
| Display | Playfair 500 | Customer hero moments, large points moments |
| H1 | Playfair 600-700 or Inter 700 | Page-level title |
| H2 | Playfair 600 on customer, Inter 700 on manager/cashier | Section heading |
| H3 | Playfair 500 or Inter 650 | Card title |
| Body | Inter 400 | Main readable text |
| Strong body | Inter 600 | Important labels and actions |
| Caption | Inter 400 | Metadata, hint text |
| Eyebrow | Inter 600 uppercase | Section labels only |
| Numeric | Inter with tabular numbers | Points, pesos, counts, dates |

### Type Rules

- Do not scale text with viewport width.
- Letter spacing is `0` except `.eyebrow`.
- Use tabular numbers for points, currency, counters, and ledger columns.
- Customer screens can use more Playfair.
- Cashier and manager screens should use mostly Inter.
- Do not use giant display type inside cards, tables, forms, or sidebars.
- Do not use low-contrast muted text on glass.

## Spacing

Use the existing 8px-based scale.

| Token | Value | Use |
| --- | --- | --- |
| `--s-1` | `4px` | Icon/text nudge, compact relationships |
| `--s-2` | `8px` | Tight stack, table cell internals |
| `--s-3` | `12px` | Compact card padding, small gaps |
| `--s-4` | `16px` | Standard internal gap |
| `--s-5` | `24px` | Card padding, page groups |
| `--s-6` | `32px` | Section spacing |
| `--s-7` | `40px` | Large mobile section gap |
| `--s-8` | `48px` | Major page gap |
| `--s-9` | `64px` | Rare, top-level spacious moments |

### Layout Rules

- Customer PWA max width stays narrow and app-like.
- Cashier tablet uses stable split layouts and large controls.
- Manager console uses dense grids, tables, and filters.
- Fixed-format UI must have stable dimensions: bottom nav, QR, action tiles, stat cards, icon buttons, table rows.
- Avoid layout shift from hover, loading, dynamic labels, or changing counts.
- Do not nest full card sections inside other cards.

## Radius

| Token | Value | Use |
| --- | --- | --- |
| `--r-sm` | `8px` | Dense rows, table containers, compact manager UI |
| `--r-md` | `12px` | Inputs, small panels, reward cards |
| `--r-lg` | `16px` | Standard panels and modals |
| `--r-xl` | `24px` | Customer focus panels, QR, premium moments |
| `--r-pill` | `999px` | Buttons, pills, bottom nav items, icon buttons |

Rules:

- Cards should usually be `8px` to `16px`.
- Use `24px` only for intentional customer-facing focus surfaces.
- Pill controls are appropriate for mobile and floating UI.
- Keep concentric radius: inner radius should be smaller than outer radius by the padding amount.

## Elevation

Elevation is created through tone, border, and shadow together.

| Level | Name | Use | Treatment |
| --- | --- | --- | --- |
| 0 | Flat | Page background | No shadow |
| 1 | Resting | Cards, inputs | Border + `--shadow-sm` or none |
| 2 | Raised | Panels, tables | `--shadow-md` |
| 3 | Floating | Sticky nav, account pills | Glass shadow |
| 4 | Focus | Modal, QR, confirmation | Strong glass shadow |

Rules:

- Prefer tonal separation before stronger shadow.
- Use green-tinted shadows, not black-heavy shadows.
- Do not stack multiple Level 4 surfaces in one viewport.
- A surface with strong blur also needs a stronger border or scrim for separation.

## Component Rules

### Buttons

Existing primitive: `components/shared/button.tsx`

Rules:

- One primary button per task area.
- Primary uses Matcha Lacquer.
- Secondary uses milk/cream with border.
- Tertiary is quiet and compact.
- Icon buttons are at least `44px` by `44px`.
- Cashier primary actions may be larger than `44px` because speed matters.
- Button labels use verbs: "Earn points", "Redeem reward", "Save changes".
- Do not use vague labels like "Continue" when a specific action is known.
- Disabled buttons need a visible disabled state and, where possible, nearby reason text.

### Cards

Existing primitive: `components/shared/card.tsx`

Rules:

- Cards are content containers, not the default structure for every page section.
- Use Paper or Ceramic for most cards.
- Use Milk Glass only for cards that float above content or serve as a focus object.
- Avoid card-in-card compositions.
- Reward cards need clear image, cost, stock/availability, and progress/affordability.

### Inputs

Existing primitive: `components/shared/input.tsx`

Rules:

- Every input needs a visible label.
- Use specialized mobile keyboards: `inputMode="numeric"`, `type="email"`, `autoCapitalize="none"` where appropriate.
- Error text should be specific and close to the field.
- Inputs should not be highly transparent.
- Focus should change border and show a visible focus ring.

### Pills And Badges

Existing primitive: `components/shared/pill.tsx`

Rules:

- Use for tier, status, counts, branch/session metadata.
- Keep labels short.
- Use icons only when they improve scan speed.
- Do not use pills as decoration.
- Do not place low-contrast pills over busy glass.

### Tables

Existing primitive: `components/shared/table.tsx`

Rules:

- Tables are manager-first and operational.
- Table containers should use Paper or Ceramic, not Clear Glass.
- Headers should be high contrast and sticky only when useful.
- Numeric cells use tabular numbers.
- Row hover should be subtle and should not shift layout.
- Empty states should include the next action.

### Modals And Sheets

Existing primitive: `components/shared/modal.tsx`

Rules:

- Modal surface may use Strong Focus Glass.
- Backdrop should dim and lightly blur.
- Modal title should state the decision or result.
- Escape and close behavior must remain accessible.
- Keep destructive actions visually distinct but not alarming.

### Toasts

Existing primitive: `components/shared/toast.tsx`

Rules:

- Toasts can use sage wash or light glass.
- Keep copy short and factual.
- Toasts should not block cashier flow.
- Success should not require dismissal unless it covers content.

### Navigation

Rules:

- Customer bottom nav is a prime Milk Glass use case.
- Cashier rail is dark matcha ceramic/glass, with strong contrast.
- Manager nav should be calm, dense, and mostly opaque.
- Current route should not behave like a normal clickable destination.
- Avoid glass-on-glass in nested nav.

## Role-Specific Guidance

### Customer PWA

Tone: personal, calm, reward-forward.

Material balance:

- More Milk Glass than other roles
- Playfair allowed for emotional hierarchy
- Larger whitespace
- Premium QR and points moments

Use glass for:

- Bottom nav
- Points balance focus panel
- QR container
- Sticky reward filters
- Profile/session controls

Avoid:

- Dense tables
- Admin terminology
- Too many tiny pills
- Transparent reward text over images without scrim

Customer screen checklist:

- Can the primary action be reached with one thumb?
- Does the points balance read instantly?
- Are rewards visually inspectable?
- Does every locked reward explain what is missing?
- Does the bottom nav stay readable over scrolling content?

### Cashier Tablet

Tone: fast, sturdy, service-ready.

Material balance:

- Less glass than customer
- More Ceramic and Paper
- Large, stable buttons
- High contrast state and confirmation

Use glass for:

- Session pill
- Sticky action bar
- Scan frame accent
- Success confirmation surface

Avoid:

- Clear Glass for data
- Tiny controls
- Decorative motion
- Ambiguous status language
- Low-contrast text on the dark rail

Cashier screen checklist:

- Can a cashier complete the flow without reading long copy?
- Are points, member name, and action visible at the same time?
- Are confirm buttons impossible to miss?
- Are destructive/reset actions clearly secondary?
- Are tap targets large enough for a busy counter context?

### Manager Console

Tone: operational, scan-friendly, controlled.

Material balance:

- Mostly Paper and Ceramic
- Minimal Milk Glass
- Inter-dominant typography
- Dense tables and filters

Use glass for:

- Top account/session bar
- Filter toolbar if sticky
- Modals
- Toasts

Sticky title rule:

- The first page-level title row in every manager route stays sticky at the top of the manager scroll region.
- Keep that sticky title layer opaque and compact, using the stone manager background with diffusion rather than a full glass card.
- If the title row includes the primary create action, the action sticks with the title.
- Filters may be sticky only when they serve the table immediately below; do not stack a second sticky glass layer under the title unless the workflow needs it.

Avoid:

- Oversized heroes
- Decorative cards for page sections
- Playfair inside data-heavy panels
- Blur behind tables
- Glass-heavy CRUD forms

Manager screen checklist:

- Can the user scan rows quickly?
- Are filters close to the table they affect?
- Are totals and date ranges clear?
- Are empty states actionable?
- Is the primary create/save action obvious but not oversized?

## Screen Pattern Rules

### Points Balance

The points balance is a brand-defining object.

Use:

- Large tabular number
- Playfair or strong Inter depending on role
- Tier progress nearby
- Matcha depth or Milk Glass depending on context

Avoid:

- Small point totals buried in cards
- Multiple competing numbers with same visual weight
- Low-contrast captions near the balance

### QR Screen

QR is a focus mode.

Use:

- Strong Focus Glass or solid milk container
- High contrast QR area
- Brightness-safe layout
- Minimal surrounding controls

Avoid:

- Transparent QR background
- Busy pattern behind QR
- Small QR size
- Decorative overlays crossing the code

### Reward Cards

Rewards are the emotional commerce surface.

Use:

- Clear image area
- Stable aspect ratio
- Cost and affordability visible
- Stock or locked state explicit
- Warm paper/milk content area

Avoid:

- Cropping product beyond recognition
- Text directly over busy product imagery
- Equal emphasis for locked and ready rewards

### Forms

Forms are trust surfaces.

Use:

- Opaque or nearly opaque input backgrounds
- Clear labels
- Close error messages
- Specific submit labels
- Mobile keyboard hints

Avoid:

- Placeholder-only labels
- Glass input fields over texture
- Form sections inside multiple nested cards

### Data Tables

Tables are decision surfaces.

Use:

- High contrast headers
- Row hover
- Empty/loading/error states
- Persistent filters when useful
- Tabular numbers

Avoid:

- Frosted table bodies
- Centered dense text
- Hidden horizontal overflow without cue

## Motion

Motion should make the material feel responsive without slowing work.

Tokens:

- Fast: `120ms`
- Base: `200ms`
- Slow: `240ms`
- Ease: `--ease-out`, `--ease-in-out`

Allowed:

- Hover color and border transitions
- Pressed darkening
- Tiny lift on floating controls
- Modal fade/scale
- Toast entrance
- Progress fill changes

Avoid:

- Bouncy cashier interactions
- Long page transitions
- Repeating ambient animation
- Motion that changes layout
- Parallax behind readable text

Reduced motion:

- Disable elastic transforms.
- Keep opacity changes short.
- Preserve state feedback through color, border, and text.

## Accessibility Rules

Accessibility is part of the material system.

### Contrast

- Body text must meet WCAG AA contrast.
- Focus indicators must contrast against adjacent colors.
- Do not rely on translucency to create contrast.
- Text over imagery needs a scrim or opaque text surface.
- Muted text on glass requires manual verification.

### Focus

- Every interactive element needs visible focus.
- Focus must not be hidden under sticky glass bars.
- Icon-only buttons need accessible labels.
- Current nav items should expose current state.

### Touch

- Minimum interactive target: `44px` by `44px`.
- Prefer larger targets on cashier tablet.
- Keep at least `8px` visual spacing between adjacent touch controls.
- Do not place critical controls at the extreme screen edge without padding.

### Transparency Fallback

- If transparency is reduced, surfaces become opaque milk/cream.
- If contrast is increased, borders get stronger and text remains charcoal or cream.
- If blur is unsupported, the UI must still look intentional.

## Content And Voice

Voice: calm, clear, warm, and useful.

Use:

- "Show my QR"
- "Earn points"
- "Redeem reward"
- "Ready to redeem"
- "Not enough points"
- "End shift"
- "Reset device"
- "Save changes"

Avoid:

- "Submit"
- "Proceed"
- "Execute"
- "Invalid operation"
- "User record"
- "Transaction entity"
- Overly cute reward language that slows comprehension

Rules:

- Customer copy can be warmer.
- Cashier copy should be shortest.
- Manager copy should be precise.
- Error copy should explain what to fix.
- Success copy should confirm what changed.

## Iconography

Use Lucide icons where possible.

Rules:

- Icons support recognition; they do not replace unclear labels except in familiar icon-only controls.
- Use `1.5` to `1.75` stroke width for the current visual weight.
- Icon-only controls need `aria-label`.
- Match icon size to component density:
  - Button icon: `16px`
  - Tertiary icon: `14px`
  - Icon button: `20px`
  - Dense table/action icon: `14px` to `16px`
- Do not introduce custom SVG icons unless Lucide lacks the concept.

## Imagery

Rewards and product imagery should be direct and useful.

Rules:

- Product should be visible and inspectable.
- Avoid dark, blurred, atmospheric images for rewards.
- Use stable aspect ratios.
- Do not put essential text over image detail without a scrim.
- Empty image states should feel intentional, not broken.
- Matcha/tea imagery should feel real, not generic wellness stock.

## Implementation Standards

### Component Priority

Before adding new UI:

1. Use an existing shared component.
2. Extend the shared component if the need is reusable.
3. Add a role-specific component if the behavior belongs only to customer/cashier/manager.
4. Add one-off classes only for genuinely one-off layouts.

### Token Priority

Before hard-coding a value:

1. Use existing Tailwind token names.
2. Use existing CSS variables.
3. Add a semantic CSS variable if the pattern repeats.
4. Hard-code only if it is a one-off asset or edge case.

### Glass Budget

Per viewport, stay roughly within this budget:

- Customer: up to 2 major glass surfaces plus small controls.
- Cashier: 1 major glass surface plus session/action controls.
- Manager: 0 to 1 glass surface, usually top controls or modal.

If everything is glass, nothing is glass.

### Do Not Add

- Gradient orbs
- Decorative blobs
- Purple/blue glass gradients
- Nested cards for page sections
- Transparent data tables
- Glass form fields over textured backgrounds
- Text that depends on background blur to become readable
- Marketing hero layouts inside app surfaces

## QA Checklist

Run this before shipping UI changes.

### Visual

- Uses the correct material for the layer.
- Glass is limited to controls, navigation, focus, or feedback.
- Content remains readable without squinting.
- The page does not read as a single hue.
- Shadows are subtle and green-tinted.
- Radii are consistent and concentric.
- No nested card clutter.
- No text overlap or button label overflow.

### Interaction

- One primary action per task area.
- Touch targets are at least `44px`.
- Hover, active, disabled, loading, empty, and error states exist where needed.
- Focus state is visible and not obscured.
- Reduced motion still communicates state.

### Role Fit

- Customer feels calm and personal.
- Cashier feels fast and obvious.
- Manager feels dense and scannable.
- Copy matches the user's context.

### Technical

- Uses shared components where possible.
- Uses tokens instead of hard-coded values.
- Works with unsupported `backdrop-filter`.
- Has reduced transparency and increased contrast fallbacks when glass is used.
- Updates `/design-system` when a reusable token, material, or component changes.

## Definition Of Done For New UI

A UI change is done when:

- It follows the layer model.
- It uses the smallest amount of glass needed.
- It remains legible with transparency reduced.
- It preserves keyboard and touch accessibility.
- It looks coherent in the role surface where it lives.
- It has stable layout across mobile/tablet/desktop as relevant.
- It does not introduce a new color, radius, shadow, or component pattern without a reason.

## Quick Decision Matrix

| Question | Choose |
| --- | --- |
| Is this readable content? | Paper or Ceramic |
| Is this floating navigation? | Milk Glass |
| Is this a modal, QR, or confirmation focus? | Strong Focus Glass |
| Is this the primary action? | Matcha Lacquer |
| Is this a table or admin form? | Ceramic |
| Is this text over image/media? | Scrim or opaque surface |
| Is this a small icon over rich imagery? | Clear Glass, only with dimming |
| Is this cashier-critical? | Larger, more opaque, less motion |
| Is this manager-dense? | Opaque, compact, Inter-first |
| Is contrast questionable? | Increase opacity, strengthen border, remove blur |

## Current System Map

Existing classes and tokens already support much of this direction:

- `customer-surface` - customer warm page environment
- `matcha-panel` - dark premium matcha focus panel
- `cashier-surface` - cashier operational page environment
- `cashier-panel` - tablet panel surface
- `cashier-rail` - dark matcha navigation rail
- `cashier-points-panel` - cashier dark points focus surface
- `--shadow-panel` - larger green-tinted panel depth
- `--milk` - lifted warm glossy base
- `--rice` - customer warmth

Recommended next system additions, when implementation needs them:

- `.surface-paper`
- `.surface-glass`
- `.surface-glass-strong`
- `.action-lacquer`
- `.scroll-edge-diffuse`

Do not add them just to satisfy the document. Add them when a real component uses them, then reflect them on `/design-system`.
