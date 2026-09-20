# GharKaBazar Storefront UI & Architecture Design Specification

**Date:** 2026-09-19  
**Status:** Approved by User  
**Theme Foundation:** Shopify Horizon Theme  
**Brand Concept:** Multi-category Modern DTC E-Commerce ("GharKaBazar")  

---

## 1. Executive Summary

GharKaBazar is a versatile, high-converting, multi-category Shopify store built on top of the Shopify Horizon theme architecture. It rejects generic dropshipping aesthetics (such as neon banners, intrusive badges, repetitive animations, and clutter) in favor of a timeless, clean, editorial DTC design language (reminiscent of modern luxury brands and premium consumer marketplaces).

The storefront is engineered to gracefully accommodate any product category—from home essentials and kitchen gadgets to tech accessories and lifestyle products—without visual friction.

---

## 2. Core Architectural & Code Quality Principles

1. **Shopify Horizon Compatibility**:
   - Integrates cleanly into Horizon's theme layout, block schema, and JSON template systems.
   - Reuses Horizon's design conventions without breaking existing theme settings or creating duplicate global scripts.

2. **Web Component Standard (`WC_MODE`)**:
   - Every interactive element is an isolated custom HTML element inheriting from `HTMLElement`.
   - Strictly implements `connectedCallback()` for initialization and `disconnectedCallback()` for event listener cleanup.
   - Component-scoped DOM traversal using `this.querySelector()` instead of global document queries.
   - Absolutely zero inline styles and zero CSS embedded inside JavaScript.

3. **Zero `id` Attribute Policy**:
   - In accordance with global constraints, the `id` attribute is never used in rendered HTML elements.
   - All styling and DOM lookups rely on semantic BEM classes (`.gkb-*`) and data attributes (`data-variant-id`, `data-action`).

4. **100% Conditional Liquid Rendering**:
   - Every heading, subtitle, image, badge, and CTA button in Liquid is wrapped in a conditional block (`{% if ... != blank %}`).
   - Never renders empty tags or causes layout shift.

5. **Anti-Gravity Layouts & Fluid CSS**:
   - Layouts are composed using CSS Grid and Flexbox with relative/fluid units (`fr`, `rem`, `%`, `minmax()`).
   - Desktop-first responsive design naturally adapting to tablet and mobile with minimal media query overhead.
   - All colors, typography, radii, and spacing are defined exclusively via CSS Custom Properties (`var(--gkb-*)`). No hardcoded hex codes or `!important`.

6. **Accessibility (WCAG 2.1 AA)**:
   - Full keyboard accessibility with visible focus rings (`:focus-visible`).
   - Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<figcaption>`, `<button>`).
   - Accessible ARIA labels and screen reader announcements (`.visually-hidden`) for price changes and cart actions.

---

## 3. Design System & Design Tokens (`assets/gharkabazar-design-system.css`)

### Color Palette (Warm Minimalist Luxe)
- Canvas Background: `var(--gkb-color-canvas, #FBFBFA)`
- Card / Modal Surface: `var(--gkb-color-surface, #FFFFFF)`
- Primary Text / Headings: `var(--gkb-color-text-primary, #121212)`
- Secondary Text: `var(--gkb-color-text-secondary, #6B7280)`
- Muted / Border Lines: `var(--gkb-color-border, #EAEAE6)`
- Subtle Surface Border: `var(--gkb-color-border-subtle, #F3F3F0)`
- Refined Slate Accent: `var(--gkb-color-accent, #1E293B)`
- Accent Hover: `var(--gkb-color-accent-hover, #0F172A)`
- Sale Discount Pill: `bg: #FEF2F2`, `text: #991B1B`
- Trust / In-Stock Badge: `bg: #F0FDF4`, `text: #166534`

### Typography & Spacing Scale
- Fluid font sizes: `xs (0.75rem)`, `sm (0.875rem)`, `base (1rem)`, `lg (1.125rem)`, `xl (1.25rem)`, `2xl (1.75rem)`, `3xl (2.25rem)`, `4xl (3rem)`
- Spacing rhythm: `2xs (0.25rem)`, `xs (0.5rem)`, `sm (0.75rem)`, `md (1rem)`, `lg (1.5rem)`, `xl (2rem)`, `2xl (3rem)`, `3xl (4.5rem)`
- Radii: `sm (4px)`, `md (8px)`, `lg (12px)`
- Shadows: Soft ambient micro-shadows (`0 1px 3px rgba(0,0,0,0.04)`)

---

## 4. Component & Section Specifications

### 4.1 Reusable Snippets
- **`snippets/gkb-product-card.liquid`**:
  - Primary image with optional secondary hover flip image.
  - Category / Vendor pill (conditional).
  - Product title linked to product URL.
  - Price block comparing regular price against `compare_at_price` with discount percentage calculation.
  - Reusable `<gkb-quick-add>` integration for single-variant items or direct navigation.
  - Zero duplicate markup across home, collection, or search.
- **`snippets/gkb-collection-card.liquid`**:
  - Image preview with subtle hover zoom effect.
  - Collection title, product count badge, and clean call-to-action arrow.
- **`snippets/gkb-trust-badge.liquid`**:
  - Lightweight SVG icons representing secure checkout, fast dispatch, money-back guarantee, and verified reviews.
- **`snippets/gkb-cart-drawer.liquid`**:
  - Slide-out drawer with backdrop overlay.
  - Real-time line item list, dynamic quantity adjustment, instant removal, free-shipping meter indicator, and checkout button.

### 4.2 Modular Homepage Sections
1. **`sections/gkb-hero.liquid`**:
   - High-impact editorial hero with desktop and mobile image options.
   - Trust badge pill, high-contrast headline, supporting subtext.
   - Primary and secondary CTA buttons.
2. **`sections/gkb-categories.liquid`**:
   - Multi-category showcase grid highlighting 4-8 popular categories (e.g. Smart Home, Gadgets, Kitchen Essentials, Daily Living).
3. **`sections/gkb-featured.liquid`**:
   - Dynamic collection grid (3-4 columns on desktop, 2 on mobile) rendering `gkb-product-card`.
   - Configurable product limit and collection picker.
4. **`sections/gkb-benefits.liquid`**:
   - 4-column value proposition blocks (Shipping, Protection, Quality, Support) with customizable icons and copy.
5. **`sections/gkb-story.liquid`**:
   - Editorial brand narrative section with image-left or image-right layout toggle.
6. **`sections/gkb-reviews.liquid`**:
   - Customer review cards with 5-star ratings, verified customer badge, and review commentary.
7. **`sections/gkb-faq.liquid`**:
   - Semantic `<details>` and `<summary>` accordion with smooth disclosure styling. Zero JS overhead.
8. **`sections/gkb-cta.liquid`**:
   - High-converting conversion banner driving visitors to full catalog exploration.

### 4.3 Web Components (`assets/gharkabazar-components.js`)
- **`<gkb-quick-add>`**:
  - Methods: `init()`, `handleSubmit(event)`, `showLoading()`, `resetButton()`, `handleSuccess(item)`, `handleError(err)`.
  - Triggers Shopify's `/cart/add.js`.
  - Dispatches `gkb:cart-updated` custom event on `document`.
- **`<gkb-cart-drawer>`**:
  - Methods: `init()`, `open()`, `close()`, `onKeyDown(event)`, `handleCartUpdate()`, `updateQuantity(line, qty)`, `removeItem(line)`.
  - Listens for `gkb:cart-updated` and cart trigger clicks.
  - Fetches `/cart.js` or renders updated drawer contents dynamically.
  - Traps keyboard focus when open and restores focus on close.
- **`<gkb-variant-selector>`**:
  - Methods: `init()`, `onOptionChange(event)`, `resolveVariant()`, `updatePrice()`, `updateButton()`.
  - Updates selection state, price display, and availability without page reloads.

---

## 5. Performance & Quality Guarantees

- **No Unnecessary Loops**: Every Liquid iteration produces distinct UI items without duplicate passes.
- **Vanilla JavaScript Only**: Zero jQuery, zero external libraries.
- **CSS Architecture**: Scoped `.gkb-*` classes, fluid layout calculations, no hardcoded dimensions, no `!important`.
- **Theme Editor Ready**: Rich schema settings allowing merchants to customize all images, copy, colors, and layout presets without touching code.

---

## 6. Verification Plan

1. **Markup & Schema Validation**:
   - Confirm all section schemas conform to Shopify standards.
   - Verify every Liquid content element has a conditional wrapper.
   - Confirm zero occurrences of `id="..."` attributes.
2. **Interactive Component Verification**:
   - Test `<gkb-quick-add>` and ensure items are seamlessly added to cart without reload.
   - Test `<gkb-cart-drawer>` open/close lifecycle, quantity increments, and item removal.
   - Test `<details>` FAQ keyboard accessibility (Space/Enter to toggle).
3. **Responsive & Visual Check**:
   - Validate desktop grid, tablet breakpoint, and mobile single/double column transitions.
   - Verify color contrast and typography hierarchy.
