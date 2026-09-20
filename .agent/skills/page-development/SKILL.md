---
name: page-development
description: >
  Enforces middle-page scope, modular file separation (Liquid, CSS, JS), HTML-file-driven page development, brand CSS variable and typography reuse, Web Component JavaScript, Shopify customization settings, and icon/image rules. Use when the user types "/page-development" or "/page-rules", or provides an HTML file to implement as a Shopify page or section.
---

# Page Development Rules & Standards

## 1. HTML File as the Primary Reference

When the user provides an HTML file, the HTML file MUST be inspected and analyzed before implementation.

The provided HTML file is the primary reference for:

* Page structure
* Layout
* Content structure
* Typography
* Colors
* Spacing
* Images
* Icons
* Buttons
* Components
* Interactions
* Responsive behavior
* JavaScript functionality

### Mandatory Process

Follow this order:

```text
HTML File
    ↓
Read Complete HTML
    ↓
Analyze Structure & Components
    ↓
Check Existing Shopify Theme Architecture
    ↓
Check Existing Variables
    ↓
Check Existing Fonts
    ↓
Check Existing Icons
    ↓
Check Existing Components
    ↓
Convert HTML → Shopify Liquid
    ↓
Convert CSS → Separate CSS File
    ↓
Convert JS → Web Component
    ↓
Add Shopify Customizer Settings
    ↓
Test Against Original HTML
```

### Important

* Read the complete HTML file before writing implementation code.
* Do NOT implement the page based on only a partial HTML snippet.
* Do NOT blindly copy static HTML into a Liquid file.
* Preserve the original design and functionality.
* Do NOT redesign the page unless explicitly requested.
* Reuse existing Shopify theme functionality whenever possible.

---

# 2. Page & Feature Development Rules

## 2.1 Middle Page Scope Only

When creating new pages or sections, build ONLY the middle content area (`<main>` / section content).

Do NOT create or duplicate:

* Header
* Announcement bar
* Navigation
* Mega menu
* Footer
* Existing global layout components

If the provided HTML contains a header or footer, use the existing Shopify theme header/footer instead of recreating them.

---

# 3. HTML Structure Conversion

Analyze the HTML and map each major part to the appropriate Shopify structure.

Example:

```text
HTML
├── Hero
├── Content Section
├── Feature Cards
├── CTA
└── Footer
```

Shopify:

```text
Shopify Page
├── Existing Header
├── Dedicated Page Section
│   ├── Hero
│   ├── Content
│   ├── Feature Cards
│   └── CTA
└── Existing Footer
```

Do not create unnecessary sections if the existing theme architecture already provides a suitable structure.

---

# 4. Modular File Structure

Always separate implementation into dedicated files.

### Liquid

Use:

```text
sections/<feature-name>.liquid
```

or, when appropriate:

```text
snippets/<feature-name>.liquid
```

### CSS

Use:

```text
assets/<feature-name>.css
```

### JavaScript

Use:

```text
assets/<feature-name>.js
```

### Template

If a dedicated page template is required, follow the theme's existing template architecture.

For JSON-template themes, prefer:

```text
templates/page.<template-name>.json
```

Do NOT create unnecessary template files if an existing template can be reused safely.

---

# 5. Existing Theme Architecture

Before creating new code, inspect the existing Shopify theme.

Search for:

* Similar sections
* Similar snippets
* Existing components
* Existing Web Components
* Existing CSS files
* Existing JavaScript
* Existing icon system
* Existing typography system
* Existing color variables
* Existing responsive breakpoints

### Rule

```text
Check Existing Code
        ↓
Reuse Existing Code
        ↓
Extend Existing Code if Appropriate
        ↓
Create New Code Only When Necessary
```

Do NOT duplicate existing functionality.

---

# 6. CSS Variable & Typography Reuse

First inspect:

```text
snippets/head-styles.liquid
```

before creating any new color or typography variables.

Look for existing variables such as:

```css
var(--font-heading-family)
var(--font-body-family)
var(--brand-primary-color)
var(--black-color)
var(--white-color)
var(--border-light)
```

If an appropriate variable already exists:

**Reuse it.**

Do NOT create a duplicate variable.

### Priority

```text
Existing Theme Variable
        ↓
Existing Brand Variable
        ↓
Existing CSS Variable
        ↓
Create New Variable Only If Required
```

All font families MUST strictly follow the existing brand font variables.

Do NOT introduce arbitrary fonts.

---

# 7. Brand Typography

Inspect the existing theme typography before converting the HTML.

Check:

* Heading font
* Body font
* Font weights
* Font sizes
* Letter spacing
* Line heights

If the HTML uses a font that is already available in the Shopify theme, reuse the existing theme variable.

If the HTML specifies a different font, do NOT automatically add it.

First determine whether the font is part of the approved brand system.

---

# 8. Web Components for JavaScript

All interactive client-side logic MUST be implemented using native Web Components.

Use:

```javascript
class ComponentName extends HTMLElement {
  connectedCallback() {
    this.init();
  }

  init() {
    // Component logic
  }
}

if (!customElements.get('component-name')) {
  customElements.define('component-name', ComponentName);
}
```

Do NOT create unnecessary global functions.

Do NOT attach page-specific functionality to `window` unless absolutely required by the existing theme architecture.

---

# 9. HTML JavaScript Conversion

When the provided HTML contains JavaScript:

Analyze all functionality before converting it.

Check for:

* Click events
* Tabs
* Accordions
* Sliders
* Carousels
* Modals
* Dropdowns
* Forms
* Validation
* API calls
* AJAX
* Dynamic DOM updates
* State changes
* Event listeners

Convert the functionality into appropriately scoped Web Components.

### Example

HTML:

```html
<div class="accordion">
  ...
</div>
```

JavaScript:

```javascript
class CustomAccordion extends HTMLElement {
  connectedCallback() {
    this.init();
  }

  init() {
    // Accordion logic
  }
}

if (!customElements.get('custom-accordion')) {
  customElements.define('custom-accordion', CustomAccordion);
}
```

---

# 10. Theme Customizer Integration

All user-facing content that should be editable MUST come from Shopify section schema settings.

Use:

```liquid
{{ section.settings.heading }}
```

instead of hard-coded content when appropriate.

This includes:

* Headings
* Subheadings
* Paragraphs
* Labels
* Button text
* Button links
* Helper text
* Messages
* Customizable colors
* Images

---

# 11. Shopify Schema Settings

Use appropriate Shopify setting types.

Examples:

```json
{
  "type": "text",
  "id": "heading",
  "label": "Heading"
}
```

```json
{
  "type": "textarea",
  "id": "description",
  "label": "Description"
}
```

```json
{
  "type": "url",
  "id": "button_link",
  "label": "Button link"
}
```

```json
{
  "type": "color",
  "id": "background_color",
  "label": "Background color"
}
```

```json
{
  "type": "image_picker",
  "id": "image",
  "label": "Image"
}
```

Use blocks when content is repeatable.

---

# 12. Icons & Media Handling

Standard SVG icons MUST use the existing icon system.

First check:

```text
snippets/icon.liquid
```

If the required icon already exists:

**Reuse it.**

Render it using the existing theme syntax, for example:

```liquid
{% render 'icon', icon: 'icon-name' %}
```

Do NOT duplicate SVG markup throughout the page.

If the icon does not exist, add it to the existing icon system following the same structure and naming convention.

---

# 13. Image Handling

Any customizable image MUST use an `image_picker` setting.

Do NOT hard-code image URLs when the image is intended to be editable through Shopify Customizer.

Use:

```liquid
{{ section.settings.image }}
```

or the existing theme's preferred image-rendering pattern.

Always provide appropriate alt text.

---

# 14. CSS Implementation

HTML styles MUST be moved into the dedicated CSS file.

Do NOT keep a large `<style>` block inside the Liquid section.

Preserve the original HTML:

* Layout
* Spacing
* Typography
* Colors
* Borders
* Shadows
* Responsive behavior
* Hover states
* Active states

Use existing theme variables wherever possible.

Scope page-specific styles to prevent affecting unrelated theme components.

---

# 15. JavaScript & CSS File Loading

Load the dedicated CSS and JavaScript according to the existing Shopify theme architecture.

Do NOT unnecessarily load the page's CSS or JS globally on every page.

Prefer loading assets only when the corresponding section/page is present, when compatible with the theme architecture.

---

# 16. Responsive Design

Analyze the responsive behavior from the provided HTML/CSS.

Implement the same behavior for:

* Desktop
* Tablet
* Mobile
* Small mobile

Use existing theme breakpoints whenever possible.

Do NOT introduce unnecessary breakpoints.

---

# 17. Accessibility

Preserve and improve accessibility during conversion.

Check:

* Semantic HTML
* Heading hierarchy
* Keyboard navigation
* Focus states
* Button semantics
* Link semantics
* Image alt text
* Form labels
* ARIA attributes
* Screen reader behavior
* Modal accessibility
* Dynamic content announcements

Do NOT use ARIA when native semantic HTML already provides the required behavior.

---

# 18. Hard-Coding Restrictions

Do NOT hard-code values that should be customizable.

Avoid hard-coding:

* Marketing text
* Headings
* Button labels
* URLs
* Images
* Customizable colors
* Repeatable content

Structural HTML may remain hard-coded.

---

# 19. Preserve HTML Functionality

Nothing from the original HTML should be silently removed.

Before completing the implementation, compare:

```text
Original HTML
      ↓
Shopify Implementation
```

Verify:

* Same sections
* Same content structure
* Same interactions
* Same visual behavior
* Same responsive behavior
* Same important functionality

If a feature cannot be directly converted, identify the limitation instead of silently removing it.

---

# 20. No Unnecessary Refactoring

When implementing the HTML page:

* Do NOT modify unrelated theme files.
* Do NOT rename unrelated classes.
* Do NOT refactor existing components unnecessarily.
* Do NOT change global styles unnecessarily.
* Do NOT change existing functionality unrelated to the requested page.

Keep the implementation focused.

---

# 21. Final Verification

Before declaring the page complete, verify:

* [ ] Complete HTML file was read.
* [ ] HTML structure was analyzed.
* [ ] Existing Shopify architecture was checked.
* [ ] `head-styles.liquid` was checked.
* [ ] Existing color variables were reused.
* [ ] Existing typography variables were reused.
* [ ] Brand fonts are being used.
* [ ] Header was not duplicated.
* [ ] Footer was not duplicated.
* [ ] Liquid is separated from CSS.
* [ ] Liquid is separated from JavaScript.
* [ ] JavaScript uses Web Components.
* [ ] Existing icons were checked.
* [ ] Icons use `icon.liquid`.
* [ ] Images use `image_picker` where appropriate.
* [ ] User-facing content uses Shopify settings where appropriate.
* [ ] CSS is properly scoped.
* [ ] JavaScript is properly scoped.
* [ ] Responsive behavior was implemented.
* [ ] Accessibility was checked.
* [ ] Original HTML functionality was preserved.
* [ ] No unnecessary dependencies were added.
* [ ] No unrelated files were modified.
* [ ] Shopify Customizer settings work correctly.
* [ ] Final page was compared against the original HTML.

---

# 22. Mandatory Rule

Whenever an HTML file is provided, ALWAYS follow this sequence:

```text
READ HTML
   ↓
ANALYZE HTML
   ↓
CHECK SHOPIFY THEME
   ↓
CHECK head-styles.liquid
   ↓
REUSE VARIABLES
   ↓
CHECK ICON SYSTEM
   ↓
CHECK EXISTING COMPONENTS
   ↓
CREATE/MODIFY LIQUID
   ↓
CREATE SEPARATE CSS
   ↓
CREATE SEPARATE WEB COMPONENT JS
   ↓
ADD SHOPIFY SETTINGS
   ↓
TEST
   ↓
COMPARE WITH ORIGINAL HTML
```

**Never skip the HTML analysis step.**

**Never blindly copy HTML into Shopify.**

**Never create duplicate theme variables when an existing variable can be reused.**

**Never duplicate the existing header or footer.**

## **Always preserve the original HTML design and functionality unless the user explicitly requests changes.**
