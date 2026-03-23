# Design System Specification: Emerald & Slate Editorial

## 1. Overview & Creative North Star: "The Precision Naturalist"
This design system rejects the "SaaS template" aesthetic in favor of a **High-End Editorial** experience. We move beyond generic layouts by embracing the "Precision Naturalist" North Star—an aesthetic that marries the rigid, technical excellence of a code editor with the fluid, organic breathability of a premium architectural magazine.

The system breaks the standard grid through **intentional asymmetry** and **tonal depth**. We do not use lines to define space; we use light and shadow. By leveraging deep Slate foundations and vibrant Emerald accents, we create a high-contrast environment that feels authoritative yet living.

## 2. Color & Surface Architecture
The palette is built on a hierarchy of "Dark Matter" (Slates) and "Bioluminescent" accents (Emeralds). 

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or layout containment. Boundaries must be defined solely through background color shifts or tonal transitions.
- Use `surface-container-low` for large section backgrounds.
- Use `surface-container-highest` for nested interactive modules.
- Transitions must feel like tectonic plates shifting, not boxes drawn on a page.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use the Material surface tiers to create "stacked" depth:
- **Base Level:** `surface` (#0b1326) – The infinite canvas.
- **Section Level:** `surface-container-low` (#131b2e) – Large structural areas.
- **Component Level:** `surface-container-high` (#222a3d) – Cards and interactive zones.
- **Active Level:** `surface-container-highest` (#2d3449) – Hover states and elevated priority.

### The "Glass & Gradient" Rule
To inject "soul" into the technical layout, floating elements (modals, dropdowns, navigation) must utilize **Glassmorphism**:
- **Background:** `secondary-container` at 60% opacity.
- **Effect:** `backdrop-blur` (12px to 20px).
- **CTAs:** Use a subtle linear gradient from `primary` (#4edea3) to `primary-container` (#10b981) at a 135-degree angle to provide a sense of curvature and light source.

## 3. Typography: Technical Authority
We use **Inter** exclusively, but we treat it with editorial weight. The hierarchy relies on extreme scale contrast to guide the eye.

*   **Display (The Hook):** `display-lg` (3.5rem) and `display-md` (2.75rem). Use tight tracking (-0.02em) and SemiBold weight. These are your "billboard" moments.
*   **Headlines (The Narrative):** `headline-md` (1.75rem). Use Medium weight. These should feel like news headers—clear, functional, and bold.
*   **Body (The Utility):** `body-lg` (1rem). Set with generous line-height (1.6) for maximum readability. 
*   **Labels (The Metadata):** `label-md` (0.75rem) in Medium weight. Always use `on-surface-variant` (#bbcabf) for a technical, "muted" metadata feel.

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often "dirty." In this system, depth is clean and atmospheric.

*   **The Layering Principle:** To lift a card, do not add a shadow first. Instead, place a `surface-container-lowest` card on a `surface-container-low` background. The subtle shift in hex code creates a "soft lift."
*   **Ambient Shadows:** If a floating element (like a context menu) requires a shadow, use a large blur (32px+) with 6% opacity. The shadow color must be `on-primary-fixed` (#002113) to ensure the shadow feels like it belongs to the emerald-tinted environment.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke, use `outline-variant` (#3c4a42) at **15% opacity**. A 100% opaque border is a failure of the design system.

## 5. Component Guidelines

### Buttons & Chips
*   **Primary Button:** Gradient fill (`primary` to `primary-container`), `DEFAULT` (4px) roundedness, white-hot text (`on-primary`).
*   **Secondary/Ghost:** No background. Use `on-surface` text with a 10% opacity `outline` only on hover.
*   **Chips:** Use `secondary-container` backgrounds with `label-md` typography. No borders.

### Inputs & Forms
*   **Text Fields:** Fill with `surface-container-highest`. Use `sm` (2px) roundedness for a sharper, technical look.
*   **Error States:** Use `error` (#ffb4ab) only for text and icons. The input box should remain `surface-container-highest` with an `error_container` glow (soft 4px outer blur).

### Cards & Lists
*   **The "No-Divider" Mandate:** Forbid 1px horizontal lines. Separate list items using `spacing-4` (1rem) of vertical white space or by alternating background tones between `surface-container-low` and `surface-container-high`.

### Specialized SaaS Components
*   **The "Status Beacon":** A small 8px circle using `primary` with a 4px `primary_fixed` outer glow to indicate "Live" or "Active" states.
*   **The Code Block:** Use `surface-container-lowest` with `on-secondary-container` text. This creates a "recessed" look, making technical data feel protected and prioritized.

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical padding (e.g., more padding on the left than the right in hero sections) to create an editorial feel.
*   **Do** use `primary` (#4edea3) sparingly as a "laser pointer" to direct attention.
*   **Do** allow elements to overlap (e.g., a card bleeding 20px over a section transition) to break the "boxed" feel.

### Don't
*   **Don't** use pure black (#000000) or pure white (#FFFFFF). Use the provided Slate and Emerald tokens to maintain tonal harmony.
*   **Don't** use "Standard" 12-column grids rigidly. Offset columns by `spacing-8` to create visual tension.
*   **Don't** use high-contrast borders. If the eye sees a line, the "Physical Layering" illusion is broken.