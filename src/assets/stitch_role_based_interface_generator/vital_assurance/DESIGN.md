---
name: Vital Assurance
colors:
  surface: '#f4faff'
  surface-dim: '#cfdce4'
  surface-bright: '#f4faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e9f6fd'
  surface-container: '#e3f0f8'
  surface-container-high: '#ddeaf2'
  surface-container-highest: '#d7e4ec'
  on-surface: '#111d23'
  on-surface-variant: '#5b403d'
  inverse-surface: '#263238'
  inverse-on-surface: '#e6f3fb'
  outline: '#8f6f6c'
  outline-variant: '#e4beba'
  surface-tint: '#ba1a20'
  primary: '#af101a'
  on-primary: '#ffffff'
  primary-container: '#d32f2f'
  on-primary-container: '#fff2f0'
  inverse-primary: '#ffb3ac'
  secondary: '#005faf'
  on-secondary: '#ffffff'
  secondary-container: '#54a0fe'
  on-secondary-container: '#003567'
  tertiary: '#016619'
  on-tertiary: '#ffffff'
  tertiary-container: '#298030'
  on-tertiary-container: '#daffd1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb3ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#930010'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#a5c8ff'
  on-secondary-fixed: '#001c3a'
  on-secondary-fixed-variant: '#004786'
  tertiary-fixed: '#9df898'
  tertiary-fixed-dim: '#82db7e'
  on-tertiary-fixed: '#002204'
  on-tertiary-fixed-variant: '#005312'
  background: '#f4faff'
  on-background: '#111d23'
  surface-variant: '#d7e4ec'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is centered on the concepts of reliability, altruism, and clinical precision. The target audience includes individual blood donors, healthcare administrators, and patients in urgent need of transfusions. 

The aesthetic follows a **Corporate / Modern** approach—prioritizing extreme legibility and structured hierarchy to reduce cognitive load during high-stakes medical coordination. By utilizing a "Soft Clinical" style, the UI balances the urgency of blood donation with a calming, trustworthy atmosphere. Expect generous whitespace, a structured grid system, and a professional finish that instills confidence in both medical professionals and civilian donors.

## Colors

The palette is anchored by **Medical Red**, specifically reserved for blood-related actions, critical alerts, and brand identity. This is balanced by a **Calming Blue** used for secondary navigation and information-heavy modules to provide a sense of stability.

- **Primary (Medical Red):** High-impact calls to action (e.g., "Donate Now", "Emergency Request").
- **Secondary (Calming Blue):** Informational links, secondary buttons, and hospital-facing management tools.
- **Success (Green):** Used for validated donations, successful blood matches, and status indicators.
- **Neutral (Slate & Gray):** Dark slate (#263238) is used for all primary text to ensure high contrast against clean white (#FFFFFF) surfaces and light gray (#F8F9FA) backgrounds.

## Typography

This design system utilizes **Inter** for its exceptional legibility and neutral, professional character. The type scale is strictly functional, using weight and size to differentiate between clinical data (labels/values) and editorial content (onboarding/marketing).

For mobile devices, headlines scale down to prevent text-wrapping issues in data-dense tables. Labels and small body text utilize slightly increased letter spacing to ensure readability on smaller medical handheld devices or in low-light environments.

## Layout & Spacing

The system employs a **Fixed Grid** on desktop (12 columns) and a **Fluid Grid** on mobile (4 columns). An 8px base unit governs all spacing, ensuring a consistent rhythm across the UI.

- **Desktop:** 1280px max-width container with 24px gutters.
- **Mobile:** Full-width liquid layout with 16px side margins.
- **Density:** We prioritize "Room to Breathe." Complex forms (like donor registration or blood stock management) must utilize significant vertical padding (32px+) between sections to prevent user fatigue and errors.

## Elevation & Depth

To maintain a professional healthcare feel, the design system avoids heavy shadows. Depth is primarily communicated through **Tonal Layers** and **Low-Contrast Outlines**.

- **Surface Level 0:** The primary light gray background (#F8F9FA).
- **Surface Level 1:** White cards or containers used for grouping content.
- **Elevation Shadows:** When used (e.g., for modals or floating action buttons), shadows should be extremely subtle: `0 4px 12px rgba(0,0,0,0.05)`. 
- **Borders:** A 1px border (#E0E0E0) is the preferred method for defining card boundaries on white backgrounds rather than a shadow, maintaining a clean, flat aesthetic.

## Shapes

The design system uses a **Rounded** shape language to soften the clinical nature of the application and make it feel more approachable for donors. 

- **Standard Elements:** 8px (0.5rem) corner radius for buttons, input fields, and small cards.
- **Large Containers:** 16px (1rem) corner radius for main dashboard modules and hospital profiles.
- **Icons:** Enclosed in circular or highly rounded containers to mimic the biological "cell" or "drop" aesthetic common in blood-related services.

## Components

### Buttons
- **Primary:** Solid #D32F2F with white text. 8px radius. Used for "Confirm Donation" or "Save."
- **Secondary:** Outlined #1976D2. Used for "Cancel" or "View History."
- **Tertiary:** Text-only buttons for low-priority actions like "Learn More."

### Input Fields
- Clean, 1px bordered boxes with 8px radius. 
- Labels are always persistent above the field in `label-md`. 
- Error states must use a high-contrast red stroke and supporting icon for accessibility.

### Blood Type Chips
- Small, rounded indicators (e.g., A+, O-) using a light background tint of the category (e.g., Light Red for "Urgent Need", Light Blue for "Normal").

### Status Cards
- Used for tracking the "Journey of a Donation." Each step uses a vertical list with clear iconography (e.g., "Tested," "Validated," "Distributed").

### Progress Trackers
- Linear, 4px thick bars using the Secondary Blue to show progress toward a donation goal or the shelf-life of a blood bag.