# CHEDI CSA Website - Section Components

This directory contains HTML component files that document the major sections of the website.

## Purpose
These files serve as:
1. **Documentation** - Reference for section HTML structure
2. **Modular Components** - Reusable section templates
3. **Future Extraction** - Can be used to further modularize main.html

## Current Structure

Each section file contains the HTML markup for that section, extracted from `main.html`.

### Main Sections

- `header.html` - Navigation header
- `hero.html` - ① Hero section
- `stats.html` - ② Stats section
- `testimonials.html` - ③ Token of Love / Welcome Banner
- `membership.html` - ④ Membership Steps
- `your-plot.html` - ⑤ Aerial View / Your Plot Section
- `basket.html` - ⑥ Weekly Basket — Grown with Care
- `seasonal-vegetables.html` - ⑦ Seasonal Vegetables
- `delivery-section.html` - ⑧ Premium Home Delivery Experience
- `pricing.html` - ⑨ Membership Fee + Get Started
- `app-download.html` - ⑩ App Download — What Happens After
- `modals.html` - Modal dialogs and overlays
- `footer.html` - Footer section

## How to Use

### Extracting Sections
To use these as independent components:

1. Copy the HTML from the component file
2. Ensure all related CSS classes are available (from `/css/` files)
3. Include any data attributes or onclick handlers exactly as specified

### Expanding the Architecture
Future refactoring could:
1. Use these files as templates for component-based development
2. Migrate to a build process that assembles components from these files
3. Create separate CSS files for each component (further modularization)
4. Implement component-level JavaScript for enhanced interactivity

## CSS Organization

Corresponding CSS for sections is organized in `/css/`:
- `global.css` - Design tokens, resets, shared utilities
- `styles.css` - All section-specific CSS (can be further broken down)
- `modals.css` - Modal styling

## JavaScript Organization

Component logic is in `/js/`:
- `utils.js` - Shared utility functions
- `components.js` - Component-specific logic (modals, navigation)
- `animations.js` - Scroll animations and effects
- `main.js` - App initialization and global listeners

## Migration Timeline

### Phase 1: ✅ COMPLETE
- Extract CSS into external files
- Create modular JavaScript layer
- Establish folder structure

### Phase 2: FUTURE
- Further break down `styles.css` into component-specific files
- Create build process for component assembly
- Implement template system if needed

### Phase 3: FUTURE
- Migrate to component-based framework if desired
- Create reusable component library
- Implement advanced state management

## Notes

- All sections maintain 100% visual/functional parity with original design
- No changes to visual hierarchy, spacing, animations, or responsiveness
- All inline event handlers preserved exactly
- CSS cascade order maintained to prevent specificity conflicts
