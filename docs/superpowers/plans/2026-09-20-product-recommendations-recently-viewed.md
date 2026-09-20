# Product Recommendations & Recently Viewed Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and integrate dedicated, high-conversion "Product Recommendations" and "Recently Viewed" sections on the GharKaBazar product page on Shopify Horizon, fully responsive and compliant with anti-gravity rules.

**Architecture:** Modular Liquid sections with Shopify Recommendations API integration, client-side localStorage history tracking, Web Components `<gkb-recommendations>` and `<gkb-recently-viewed>`, atomic card reuse via `gkb-product-card.liquid`, and CSS variables.

**Tech Stack:** Shopify Horizon Theme, Liquid, Vanilla CSS (CSS variables, Grid, Flexbox), Vanilla JS (Web Components: `<gkb-recommendations>`, `<gkb-recently-viewed>`, `<gkb-slider>`).

## Global Constraints

- Never use the `id` attribute in rendered HTML elements.
- No inline CSS (never use `style=""` attribute; all styles live in stylesheet files).
- No `!important` in CSS.
- Use CSS variables for all colors, typography, and spacing.
- Every text, heading, button, image, and all other content elements in Liquid must be wrapped in a condition (`{% if ... != blank %}`).
- Master `enable_section` checkbox setting wraps the entire rendered markup in each section.
- Web Components must implement `connectedCallback()` for initialization and `disconnectedCallback()` for cleanup.
- Web Components must be broken into small, focused, single-responsibility functions.
- CSS must never be embedded inside Web Components.
- No jQuery (vanilla JS only).
- Semantic HTML tags (`section`, `article`, `figure`, `nav`, etc.).
- Grid and Flex as primary layout system; desktop-first but naturally responsive.
- Do not open cmd/powershell, and do not open the browser.

---

### Task 1: Product Recommendations Section (`sections/gkb-recommendations.liquid`)

**Files:**
- Create: `sections/gkb-recommendations.liquid`

**Interfaces:**
- Consumes: Shopify `routes.product_recommendations_url`, `recommendations.products`, `snippets/gkb-product-card.liquid`.
- Produces: `<gkb-recommendations>` custom element with slider and grid layout support.

- [x] **Step 1: Write `sections/gkb-recommendations.liquid`**
Implement the complete Liquid section with:
- Top-level `{% if section.settings.enable_section %}` condition.
- Header block with conditional `eyebrow`, `heading`, and `subheading`.
- Navigation prev/next buttons for slider layout.
- Container `<gkb-recommendations class="gkb-recommendations" data-url="{{ routes.product_recommendations_url }}?section_id={{ section.id }}&product_id={{ product.id }}&limit={{ section.settings.products_to_show }}&intent=related" data-section-id="{{ section.id }}" data-product-id="{{ product.id }}">`.
- Recommendation loop rendering `snippets/gkb-product-card.liquid` when `recommendations.performed` is true.
- Fallback loop to `section.settings.fallback_collection.products` if recommendations return zero items.
- Schema definition with settings for toggle, titles, layout style (`slider`/`grid`), product count, vendor toggle, quick add toggle, and fallback collection.

- [x] **Step 2: Verify Liquid Conditions & Schema Syntax**
Verify no `id` attributes exist and all text nodes are wrapped in `{% if ... != blank %}`.

---

### Task 2: Recently Viewed Section (`sections/gkb-recently-viewed.liquid`)

**Files:**
- Create: `sections/gkb-recently-viewed.liquid`

**Interfaces:**
- Consumes: Current product metadata in JSON format, `snippets/gkb-product-card.liquid` classes.
- Produces: `<gkb-recently-viewed>` custom element rendering client-side history into `<div class="gkb-slider__track">` or `.gkb-grid`.

- [x] **Step 1: Write `sections/gkb-recently-viewed.liquid`**
Implement the complete Liquid section with:
- Top-level `{% if section.settings.enable_section %}` condition.
- Hidden JSON script tag containing current product data (`id`, `handle`, `title`, `url`, `image`, `price`, `compare_at_price`, `available`, `variant_id`) for tracker script.
- Header group with conditional `eyebrow`, `heading`, and `subheading`.
- Slider controls (prev/next buttons) and clear history button.
- Container element `<gkb-recently-viewed class="gkb-recently-viewed" data-current-product-id="{{ product.id }}" data-max-items="{{ section.settings.max_items }}" data-layout="{{ section.settings.layout_style }}" data-show-quick-add="{{ section.settings.show_quick_add }}">`.
- Clean empty state container when no history exists yet.
- Schema definition with toggle, titles, layout style (`slider`/`grid`), max items, and quick-add toggle.

- [x] **Step 2: Verify Liquid Conditions & Semantic HTML**
Verify semantic tags (`<section>`, `<article>`), zero `id` attributes, and conditional wraps.

---

### Task 3: Web Components Runtime Extension (`assets/gharkabazar-components.js`)

**Files:**
- Modify: `assets/gharkabazar-components.js`

**Interfaces:**
- Consumes: Shopify `/recommendations/products` API, `localStorage['gkb_recently_viewed']`.
- Produces: `<gkb-recommendations>` and `<gkb-recently-viewed>` custom elements registered on window.

- [x] **Step 1: Implement `<gkb-recommendations>` Component**
- Implement `connectedCallback()` and `disconnectedCallback()`.
- Check if content is already populated; if not, initiate `fetch()` with `AbortController`.
- Parse response HTML, extract recommendations track/grid, and inject into section.
- Initialize `<gkb-slider>` controls if layout is slider.

- [x] **Step 2: Implement `<gkb-recently-viewed>` Component**
- Implement `connectedCallback()` and `disconnectedCallback()`.
- Method `recordCurrentProduct()`: reads current product JSON, prepends to `localStorage['gkb_recently_viewed']`, caps at 12 items.
- Method `renderItems()`: reads stored items, excludes `data-current-product-id`, formats product cards matching `snippets/gkb-product-card.liquid` DOM, and injects into slider track or grid.
- Method `clearHistory()`: empties storage and updates DOM to empty state.

- [x] **Step 3: Register Custom Elements safely**
Verify `customElements.define('gkb-recommendations', GkbRecommendations)` and `customElements.define('gkb-recently-viewed', GkbRecentlyViewed)` are guarded with `!customElements.get()`.

---

### Task 4: Stylesheet Extension (`assets/gharkabazar-components.css`)

**Files:**
- Modify: `assets/gharkabazar-components.css`

**Interfaces:**
- Consumes: `--gkb-*` design system variables.
- Produces: Scoped styling for `.gkb-recommendations` and `.gkb-recently-viewed`.

- [x] **Step 1: Add Recommendation & Recently Viewed Styles**
- Add `.gkb-recently-viewed__empty` styling.
- Add `.gkb-recently-viewed__clear-btn` styling.
- Add `.gkb-recently-viewed[hidden]` and `.gkb-recommendations[hidden]` rules.
- Ensure 100% CSS variable usage, zero `!important`, and zero ID selectors.

---

### Task 5: Template Integration (`templates/product.json`)

**Files:**
- Modify: `templates/product.json`

**Interfaces:**
- Consumes: `gkb-recommendations` and `gkb-recently-viewed` section definitions.
- Produces: Updated product template schema with sections ordered logically.

- [x] **Step 1: Add Sections to `templates/product.json`**
Add:
- `"product_recommendations"`: `{ "type": "gkb-recommendations", "settings": { "enable_section": true, "eyebrow": "Curated For You", "heading": "Recommended Essentials", "subheading": "Thoughtfully matched companion pieces for your home.", "layout_style": "slider", "products_to_show": 6, "show_quick_add": true } }`
- `"recently_viewed"`: `{ "type": "gkb-recently-viewed", "settings": { "enable_section": true, "eyebrow": "Your History", "heading": "Recently Viewed", "subheading": "Pick up right where you left off.", "layout_style": "slider", "max_items": 8, "show_quick_add": true } }`
- Update `"order"` array to include both sections.

- [x] **Step 2: Validate JSON Syntax**
Ensure valid JSON formatting without trailing commas or syntax errors.

---

### Task 6: Comprehensive Verification

**Files:**
- Inspect: `sections/gkb-recommendations.liquid`
- Inspect: `sections/gkb-recently-viewed.liquid`
- Inspect: `assets/gharkabazar-components.js`
- Inspect: `assets/gharkabazar-components.css`
- Inspect: `templates/product.json`

- [x] **Step 1: Code Quality & Constraint Checklist**
- Verify zero `id` attributes.
- Verify zero inline styles (`style=""`).
- Verify zero `!important` declarations.
- Verify 100% conditional Liquid rendering.
- Verify master checkbox toggle conditions.
- Verify clean Web Components with lifecycle methods.
