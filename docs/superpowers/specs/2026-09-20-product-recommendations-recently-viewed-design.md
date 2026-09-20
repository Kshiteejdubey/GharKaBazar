# Design Specification: Product Recommendations & Recently Viewed Sections

**Date:** 2026-09-20  
**Project:** GharKaBazar Storefront (Shopify Horizon Theme)  
**Status:** Approved  

---

## 1. Overview & Purpose

The product page requires two distinct, modular conversion sections:
1. **Product Recommendations (`gkb-recommendations`)**: Dynamically suggests relevant and related items using Shopify's native recommendation engine with fallback collection support.
2. **Recently Viewed Products (`gkb-recently-viewed`)**: Captures and renders items recently browsed by the customer using client-side `localStorage`, excluding the current product, with zero latency and smooth slider/grid presentation.

Both sections adhere strictly to GharKaBazar global constraints:
- Zero `id` attributes.
- No inline CSS (`style=""`).
- No `!important`.
- Fully conditional Liquid rendering (`{% if ... != blank %}`).
- Entire section output wrapped in a master `enable_section` checkbox setting.
- Clean Web Components (`connectedCallback` / `disconnectedCallback`, scoped DOM queries).
- Semantic HTML tags (`section`, `article`, `figure`, `nav`).
- Fluid CSS variables, Grid, and Flexbox layouts.

---

## 2. Architecture & Components

### 2.1 Section: `sections/gkb-recommendations.liquid`
- **Container**: `<section class="gkb-section gkb-recommendations">`
- **Dynamic Fetching**: Implemented via custom element `<gkb-recommendations>` targeting `routes.product_recommendations_url` with parameters `section_id={{ section.id }}&product_id={{ product.id }}&limit={{ section.settings.products_to_show }}&intent=related`.
- **Server Rendering Phase**: When `recommendations.performed` is true, renders recommended products using `snippets/gkb-product-card.liquid`.
- **Fallback Mechanism**: If no recommendations are returned by Shopify's recommendation engine, the section gracefully falls back to a curated collection defined in `section.settings.fallback_collection`.
- **Layout Modes**: Supports `slider` (via `<gkb-slider>`) and `grid` (`.gkb-grid`).
- **Settings Schema**:
  - `enable_section` (boolean, default: `true`)
  - `eyebrow` (text, default: `"Curated For You"`)
  - `heading` (text, default: `"Recommended Essentials"`)
  - `subheading` (textarea, default: `"Thoughtfully matched companion pieces for your home."`)
  - `layout_style` (select: `slider` / `grid`, default: `slider`)
  - `products_to_show` (range: 4 to 12, default: 6)
  - `show_vendor` (boolean, default: `false`)
  - `show_quick_add` (boolean, default: `true`)
  - `fallback_collection` (collection picker)

### 2.2 Section: `sections/gkb-recently-viewed.liquid`
- **Container**: `<section class="gkb-section gkb-recently-viewed">`
- **Tracker Behavior**: On product page load, appends `{ id, handle, title, url, image, price, compare_at_price, available, variant_id }` to `localStorage['gkb_recently_viewed']` (max 12 items, unshifted, duplicates removed).
- **Component**: `<gkb-recently-viewed>` Web Component.
  - Reads `localStorage['gkb_recently_viewed']`.
  - Filters out current `data-current-product-id`.
  - Renders cards matching `snippets/gkb-product-card.liquid` structure into the slider track or grid.
  - If array is empty, section cleanly hides (`display: none` or hidden attribute) without causing layout shift.
- **Settings Schema**:
  - `enable_section` (boolean, default: `true`)
  - `eyebrow` (text, default: `"Your History"`)
  - `heading` (text, default: `"Recently Viewed"`)
  - `subheading` (textarea, default: `"Pick up right where you left off."`)
  - `layout_style` (select: `slider` / `grid`, default: `slider`)
  - `max_items` (range: 4 to 12, default: 8)
  - `show_quick_add` (boolean, default: `true`)

### 2.3 Web Components Runtime (`assets/gharkabazar-components.js`)
- **`<gkb-recommendations>`**:
  - `connectedCallback()`: Checks if already hydrated. If not, fetches recommended HTML from `routes.product_recommendations_url` and replaces inner HTML.
  - Re-initializes slider navigation buttons after DOM update.
  - `disconnectedCallback()`: Aborts pending fetch controller if unmounted.
- **`<gkb-recently-viewed>`**:
  - `connectedCallback()`: Records current product if on product page, reads stored history, generates sanitized card markup, injects into container, and attaches slider listeners.
  - `disconnectedCallback()`: Unbinds any local click handlers.

### 2.4 Stylesheet (`assets/gharkabazar-components.css`)
- Reuses existing `.gkb-section`, `.gkb-container`, `.gkb-slider`, `.gkb-card`, and `.gkb-grid` rules.
- Adds dedicated utility classes:
  - `.gkb-recently-viewed[hidden]` / `.gkb-recommendations[hidden]`
  - Scoped loading skeleton indicator for asynchronous recommendations fetch.

### 2.5 Template Integration (`templates/product.json`)
- Adds `product_recommendations` (`type: "gkb-recommendations"`)
- Adds `recently_viewed` (`type: "gkb-recently-viewed"`)
- Positions them intuitively in the page `order` array:
  - `main_product`
  - `related_products`
  - `product_recommendations`
  - `product_reviews`
  - `product_faq`
  - `recently_viewed`

---

## 3. Verification Plan

1. **Liquid Syntax & Compliance**:
   - Verify every text, heading, and block has an enclosing `{% if ... != blank %}` condition.
   - Verify master `enable_section` toggle wraps output.
   - Verify zero occurrences of `id="..."` attributes.
2. **Vanilla JS & Web Components**:
   - Verify all elements implement `connectedCallback()` and `disconnectedCallback()`.
   - Verify zero jQuery dependencies and zero inline CSS.
3. **Template Validation**:
   - Verify `templates/product.json` parses as valid JSON with new sections correctly referenced.
