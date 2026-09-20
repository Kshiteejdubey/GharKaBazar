# GharKaBazar Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade, highly conversion-focused, multi-category storefront for GharKaBazar on Shopify Horizon with Web Components, modular sections, reusable snippets, and anti-gravity CSS.

**Architecture:** Approach 1 (Modular Custom Sections & Native Horizon Blocks). Extends Horizon via clean modular Liquid sections, atomic snippets, WCAG 2.1 accessible Web Components, and CSS custom properties.

**Tech Stack:** Shopify Horizon Theme, Liquid, Vanilla CSS (Custom properties, Grid, Flexbox), Vanilla JS (Web Components: `<gkb-quick-add>`, `<gkb-cart-drawer>`, `<gkb-variant-selector>`).

## Global Constraints

- Never use the `id` attribute in rendered HTML elements.
- No inline CSS (never use `style=""` attribute; all styles live in stylesheet files).
- No `!important` in CSS.
- Use CSS variables for all colors, typography, and spacing.
- Every text, heading, button, image, and all other content elements in Liquid must be wrapped in a condition (`{% if ... != blank %}`).
- Every Web Component must implement `connectedCallback()` for initialization and `disconnectedCallback()` for cleanup (`WC_MODE`).
- Web Components must be broken into small, focused, single-responsibility functions.
- CSS must never be embedded inside Web Components.
- No jQuery (vanilla JS only).
- Semantic HTML tags (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `figure`, `figcaption`).
- Grid and Flex as primary layout system; desktop-first but naturally responsive.
- No unnecessary loops in Liquid or JS.
- Do not open cmd/powershell, and do not open the browser.

---

### Task 1: Design System Tokens & Asset Pipeline

**Files:**
- Create: `assets/gharkabazar-design-system.css`
- Modify: `snippets/stylesheets.liquid`

**Interfaces:**
- Consumes: Horizon theme font and layout variables.
- Produces: Global `--gkb-*` CSS custom properties for palette, typography, spacing, shadows, and radii.

- [ ] **Step 1: Create `assets/gharkabazar-design-system.css`**
Define root variables for canvas (`#FBFBFA`), surface (`#FFFFFF`), text-primary (`#121212`), text-secondary (`#6B7280`), borders (`#EAEAE6`), accent (`#1E293B`), spacing scale (`2xs` to `3xl`), typography scale, and fluid containers.

- [ ] **Step 2: Link `gharkabazar-design-system.css` in `snippets/stylesheets.liquid`**
Add `{{ 'gharkabazar-design-system.css' | asset_url | stylesheet_tag: preload: true }}` and `{{ 'gharkabazar-components.css' | asset_url | stylesheet_tag: preload: true }}`.

- [ ] **Step 3: Verification**
Inspect `snippets/stylesheets.liquid` and verify syntax correctness and preload tags.

---

### Task 2: Web Components Runtime (`WC_MODE`)

**Files:**
- Create: `assets/gharkabazar-components.js`
- Modify: `snippets/scripts.liquid`

**Interfaces:**
- Consumes: Shopify `/cart/add.js`, `/cart.js`, `/cart/change.js`.
- Produces: `<gkb-quick-add>`, `<gkb-cart-drawer>`, `<gkb-variant-selector>` custom elements, and `gkb:cart-updated` custom events.

- [ ] **Step 1: Implement `<gkb-quick-add>` Web Component**
Define class extending `HTMLElement`. Implement `connectedCallback()` and `disconnectedCallback()`. Add `submit()`, `setLoading()`, `resetButton()`, and dispatch `gkb:cart-updated`. Scoped DOM queries only.

- [ ] **Step 2: Implement `<gkb-cart-drawer>` Web Component**
Define class extending `HTMLElement`. Implement `connectedCallback()` to listen for `gkb:cart-updated` and backdrop clicks. Implement `open()`, `close()`, `trapFocus()`, `fetchCart()`, and quantity change handlers. Scoped DOM queries only.

- [ ] **Step 3: Implement `<gkb-variant-selector>` Web Component**
Define class extending `HTMLElement`. Implement `connectedCallback()` and `disconnectedCallback()`. Listen for variant change events, parse embedded product JSON, update price and button states.

- [ ] **Step 4: Register Custom Elements and link in `snippets/scripts.liquid`**
Register custom elements via `customElements.define(...)` with safety checks (`if (!customElements.get(...))`). Append script tag in `snippets/scripts.liquid`.

- [ ] **Step 5: Verification**
Verify no use of `id` attributes, all queries scoped to `this.querySelector()`, and proper event listener removal in `disconnectedCallback()`.

---

### Task 3: Reusable UI Snippets

**Files:**
- Create: `snippets/gkb-trust-badge.liquid`
- Create: `snippets/gkb-collection-card.liquid`
- Create: `snippets/gkb-product-card.liquid`
- Create: `snippets/gkb-cart-drawer.liquid`

**Interfaces:**
- Consumes: Shopify `product`, `collection`, and `cart` objects.
- Produces: Reusable markup templates for cards, drawer, and trust badges with 100% conditional rendering.

- [ ] **Step 1: Create `snippets/gkb-trust-badge.liquid`**
Support icon types: `shipping`, `shield`, `returns`, `support`, with inline semantic SVGs and conditional label rendering.

- [ ] **Step 2: Create `snippets/gkb-collection-card.liquid`**
Render collection image, title, product count badge, and explore CTA wrapped in `{% if collection != blank %}`.

- [ ] **Step 3: Create `snippets/gkb-product-card.liquid`**
Render primary and secondary hover image, conditional vendor, title, price with compare-at strikethrough, discount pill, and `<gkb-quick-add>` button.

- [ ] **Step 4: Create `snippets/gkb-cart-drawer.liquid`**
Render `<gkb-cart-drawer>` container, drawer panel, header with close button, dynamic line item list, empty state, and checkout action.

- [ ] **Step 5: Verification**
Verify zero `id` attributes across all snippets and confirm every text and image element is wrapped in a conditional statement (`Rule 13`).

---

### Task 4: Component Stylesheet (`assets/gharkabazar-components.css`)

**Files:**
- Create: `assets/gharkabazar-components.css`

**Interfaces:**
- Consumes: `--gkb-*` design tokens from `gharkabazar-design-system.css`.
- Produces: Scoped BEM styles for all `.gkb-*` sections, cards, drawers, and grids.

- [ ] **Step 1: Write Card & Grid Styles**
Implement `.gkb-grid`, `.gkb-card`, `.gkb-card__media`, `.gkb-card__badge`, `.gkb-card__content`, `.gkb-card__title`, `.gkb-card__price` using CSS Grid and Flexbox.

- [ ] **Step 2: Write Cart Drawer Styles**
Implement `.gkb-drawer`, `.gkb-drawer__backdrop`, `.gkb-drawer__dialog`, `.gkb-drawer__items`, `.gkb-drawer__footer` with smooth slide transitions and focus ring styling.

- [ ] **Step 3: Write Section Styles (Hero, Benefits, Story, FAQ, Reviews, CTA)**
Implement styles for `.gkb-hero`, `.gkb-benefits`, `.gkb-story`, `.gkb-reviews`, `.gkb-faq`, `.gkb-cta`. Ensure fluid mobile adaptation without fixed heights.

- [ ] **Step 4: Verification**
Confirm zero hardcoded colors, zero `!important`, zero `id` selectors, and zero inline CSS.

---

### Task 5: Modular Homepage Sections (Part 1: Hero, Categories, Featured Products)

**Files:**
- Create: `sections/gkb-hero.liquid`
- Create: `sections/gkb-categories.liquid`
- Create: `sections/gkb-featured.liquid`

**Interfaces:**
- Consumes: Section settings, block settings, collection objects.
- Produces: High-converting editorial sections with full Shopify theme editor schema presets.

- [ ] **Step 1: Create `sections/gkb-hero.liquid`**
Editorial hero banner with desktop & mobile images, badge, headline, description, primary & secondary CTA. Full schema settings with presets.

- [ ] **Step 2: Create `sections/gkb-categories.liquid`**
Category showcase grid supporting 4-8 collection blocks using `snippets/gkb-collection-card.liquid`. Full schema settings with presets.

- [ ] **Step 3: Create `sections/gkb-featured.liquid`**
Featured products showcase rendering products from a selected collection using `snippets/gkb-product-card.liquid`. Full schema settings with presets.

- [ ] **Step 4: Verification**
Verify valid JSON schema in all three sections and verify 100% conditional wrapping on all content elements.

---

### Task 6: Modular Homepage Sections (Part 2: Benefits, Story, Reviews, FAQ, CTA)

**Files:**
- Create: `sections/gkb-benefits.liquid`
- Create: `sections/gkb-story.liquid`
- Create: `sections/gkb-reviews.liquid`
- Create: `sections/gkb-faq.liquid`
- Create: `sections/gkb-cta.liquid`

**Interfaces:**
- Consumes: Reusable section blocks for trust items, testimonials, and accordion questions.
- Produces: Complete conversion engine for GharKaBazar.

- [ ] **Step 1: Create `sections/gkb-benefits.liquid`**
4-block value proposition grid (Shipping, Warranty, Support, Security) with customizable SVG icons and text.

- [ ] **Step 2: Create `sections/gkb-story.liquid`**
Brand story section featuring split image + text with image alignment toggle (left/right).

- [ ] **Step 3: Create `sections/gkb-reviews.liquid`**
Testimonials section featuring customer reviews, star ratings, and verified buyer badges.

- [ ] **Step 4: Create `sections/gkb-faq.liquid`**
Semantic `<details>` and `<summary>` accordion with accessible keyboard focus and schema blocks for Q&A pairs.

- [ ] **Step 5: Create `sections/gkb-cta.liquid`**
High-impact closing conversion banner with headline, description, and direct shop CTA button.

- [ ] **Step 6: Verification**
Confirm valid JSON schema, presets, semantic markup, and zero `id` attributes.

---

### Task 7: Integration & Verification

**Files:**
- Modify: `layout/theme.liquid` (render `gkb-cart-drawer` snippet inside body)
- Verification check across all created files.

- [ ] **Step 1: Render `snippets/gkb-cart-drawer.liquid` in `layout/theme.liquid`**
Inject `{% render 'gkb-cart-drawer' %}` before closing `</body>` tag so the drawer is universally accessible on all pages.

- [ ] **Step 2: Comprehensive Code Quality & Rule Audit**
  - Verify zero instances of `id="..."` attribute in all created files.
  - Verify zero instances of `style="..."` inline styles.
  - Verify zero instances of `!important` in CSS files.
  - Verify every Liquid element is wrapped in a conditional statement (`Rule 13`).
  - Verify Web Components implement both `connectedCallback()` and `disconnectedCallback()`.
  - Verify valid JSON in all section schemas.

- [ ] **Step 3: Walkthrough & Summary Creation**
Create `walkthrough.md` documenting all components, schema presets, and usage instructions for the theme editor.
