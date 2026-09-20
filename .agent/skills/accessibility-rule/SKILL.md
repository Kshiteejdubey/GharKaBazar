---
name: accessibility-rule
description: >
  Enforces WCAG 2.1 accessibility requirements and W3C WAI-ARIA Authoring
  Practices for Shopify theme development. Covers semantic HTML, keyboard
  accessibility, focus management, dialogs/modals, accordions, sliders and
  carousels, forms, dynamic content, ARIA states, screen-reader behavior,
  responsive accessibility, contrast, reflow, and status messages. Use when
  the user types "/accessibility-rule", "/accessibility", "/ada", "/wcag", or "/wcag21".
---

# WCAG 2.1 Accessibility Rules

## 1. Accessibility Standard

All accessibility implementation MUST be based on:

* WCAG 2.1
* W3C WAI-ARIA Authoring Practices Guide (APG)
* Native HTML semantics whenever possible

Primary WCAG reference:

https://www.w3.org/TR/WCAG21/

Use WCAG 2.1 Success Criteria as the accessibility baseline.

Important WCAG principles:

```text
Perceivable
Operable
Understandable
Robust
```

Do not treat ARIA attributes as a replacement for semantic HTML.

Prefer:

```text
Native HTML
    ↓
Correct semantics
    ↓
Keyboard support
    ↓
ARIA only when required
```

---

# 2. Core Accessibility Rules

Every interactive component MUST be:

* Keyboard accessible
* Focusable when appropriate
* Operable without a mouse
* Visually focusable
* Screen-reader understandable
* Semantically identifiable
* Operable on mobile/touch devices
* Free from keyboard traps

Follow WCAG:

* 1.3.1 Info and Relationships
* 1.3.2 Meaningful Sequence
* 1.4.3 Contrast (Minimum)
* 1.4.4 Resize Text
* 1.4.10 Reflow
* 1.4.11 Non-text Contrast
* 1.4.12 Text Spacing
* 1.4.13 Content on Hover or Focus
* 2.1.1 Keyboard
* 2.1.2 No Keyboard Trap
* 2.2.2 Pause, Stop, Hide
* 2.4.3 Focus Order
* 2.4.4 Link Purpose
* 2.4.6 Headings and Labels
* 2.4.7 Focus Visible
* 3.2.1 On Focus
* 3.2.2 On Input
* 3.3.1 Error Identification
* 3.3.2 Labels or Instructions
* 4.1.2 Name, Role, Value
* 4.1.3 Status Messages

---

# 3. Semantic HTML First

Always prefer native HTML elements.

Use:

```html
<button>
<a href="">
<input>
<select>
<textarea>
<details>
<summary>
<h1>
<h2>
<h3>
<nav>
<main>
<section>
<article>
<header>
<footer>
```

Do NOT turn non-interactive elements into interactive controls unnecessarily.

Avoid:

```html
<div onclick="">
<span onclick="">
<div role="button">
```

when a native `<button>` can be used.

### Rule

```text
If native HTML can provide the required behavior,
use native HTML instead of ARIA.
```

---

# 4. Keyboard Accessibility

All functionality MUST be available through keyboard interaction.

Follow WCAG 2.1:

* 2.1.1 Keyboard
* 2.1.2 No Keyboard Trap
* 2.4.3 Focus Order
* 2.4.7 Focus Visible

Users must be able to:

* Reach the component
* Operate the component
* Understand the current state
* Leave the component

Do not require:

* Mouse-only interaction
* Hover-only interaction
* Drag-only interaction
* Touch-only interaction

---

# 5. Focus Visible

Never remove the browser/theme focus indicator unless an equally visible replacement is provided.

Avoid:

```css
outline: none;
```

unless an accessible replacement is implemented.

Focus MUST remain visually identifiable.

Example:

```css
:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

Use the project's existing focus styles when available.

---

# 6. Focus Order

Keyboard focus order MUST follow the logical reading and interaction order.

Do NOT use positive tabindex values such as:

```html
tabindex="1"
tabindex="2"
tabindex="3"
```

Prefer:

```html
tabindex="0"
```

or:

```html
tabindex="-1"
```

only when programmatic focus is required.

Positive tabindex values are strongly discouraged.

---

# 7. aria-hidden Rule

NEVER make an element `aria-hidden="true"` if it contains a focusable element that can still receive keyboard focus.

Incorrect:

```html
<div aria-hidden="true">
  <button>Next</button>
</div>
```

Correct approach:

```text
Hidden from screen readers
        +
Not keyboard focusable
        +
Not interactable
```

If content is visually hidden and inaccessible, ensure its descendants cannot receive focus.

This is especially important for:

* Sliders
* Carousels
* Modals
* Mobile menus
* Tabs
* Accordions
* Hidden drawers

---

# 8. Dialog / Modal Accessibility

Follow the W3C Dialog Modal Pattern.

A modal dialog MUST:

* Have an accessible name
* Use `role="dialog"` when required
* Use `aria-modal="true"` when it is truly modal
* Move focus into the dialog when opened
* Keep focus within the dialog while open
* Support `Escape`
* Provide a visible close button
* Return focus when closed

W3C APG defines this interaction pattern.

---

## 8.1 Dialog Structure

Preferred structure:

```html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
>
  <h2 id="dialog-title">
    Dialog Title
  </h2>

  <button type="button" aria-label="Close">
    Close
  </button>

  ...
</div>
```

Use `aria-describedby` when a concise description is appropriate.

Do NOT use `aria-describedby` blindly for large structured content.

---

# 9. Modal Focus Management

When a modal opens:

```text
Trigger Button
      ↓
Open Modal
      ↓
Move Focus Into Modal
      ↓
User Interacts Inside Modal
      ↓
Tab stays inside Modal
      ↓
Escape / Close
      ↓
Return Focus to Trigger
```

When the dialog closes, focus should normally return to the element that opened it, unless that element no longer exists or the workflow logically requires another destination.

---

# 10. Modal Focus Trap

While a modal dialog is open:

* Background content must not be interactive.
* Keyboard focus must not escape the modal.
* `Tab` cycles through focusable elements inside the modal.
* `Shift + Tab` cycles backwards.
* `Escape` closes the modal when appropriate.

Do NOT create a keyboard trap that prevents the user from exiting the component.

The modal's focus containment is different from an accidental keyboard trap: users must always have a clear way to close/leave the modal. WCAG 2.1 requires that users can move focus away from components using keyboard interaction.

---

# 11. Modal Background

When a modal is truly modal:

```text
Modal
  ↓
Interactive

Background
  ↓
Inert / Non-interactive
```

Do not use:

```html
aria-modal="true"
```

unless the implementation actually prevents interaction with the content outside the dialog and visually indicates the modal state.

W3C specifically warns that incorrectly applying `aria-modal="true"` can cause serious problems for assistive technology users.

---

# 12. Modal Close Button

Every modal should provide a clear visible close mechanism.

Preferred:

```html
<button type="button" aria-label="Close">
  ...
</button>
```

Do not rely only on:

* Clicking the overlay
* Escape
* Browser back
* A visual X with no accessible name

The W3C APG strongly recommends including a visible button that closes the dialog in the dialog's tab sequence.

---

# 13. Accordion Accessibility

Follow the W3C Accordion Pattern.

Accordion headers MUST use an interactive button.

Preferred structure:

```html
<h3>
  <button
    type="button"
    aria-expanded="false"
    aria-controls="panel-1"
  >
    Section Title
  </button>
</h3>

<div id="panel-1">
  ...
</div>
```

W3C APG defines `aria-expanded` and `aria-controls` on the accordion button.

---

# 14. Accordion aria-expanded

`aria-expanded` MUST be placed on the actual interactive control.

Correct:

```html
<button
  aria-expanded="true"
  aria-controls="accordion-panel-1"
>
```

Incorrect:

```html
<div aria-expanded="true">
  <button>Title</button>
</div>
```

State synchronization is mandatory.

```text
Panel Visible
    ↓
aria-expanded="true"

Panel Hidden
    ↓
aria-expanded="false"
```

Never allow the visual state and ARIA state to disagree.

---

# 15. Accordion aria-controls

The accordion button's:

```html
aria-controls="panel-id"
```

MUST reference the actual ID of the controlled panel.

Example:

```html
<button
  aria-expanded="false"
  aria-controls="faq-panel-1"
>
```

```html
<div id="faq-panel-1">
```

Do not reference non-existent IDs.

---

# 16. Accordion Keyboard Interaction

At minimum:

```text
Enter → Expand / Collapse
Space → Expand / Collapse
Tab → Next focusable element
Shift + Tab → Previous focusable element
```

Do not require mouse interaction.

W3C APG specifies Enter/Space for accordion header activation and normal Tab/Shift+Tab behavior.

---

# 17. Accordion Panel Accessibility

When a panel is hidden:

* Its interactive descendants must not remain keyboard reachable.
* Its hidden content must not be announced incorrectly by screen readers.
* Its state must correspond to the accordion button.

When visible:

* Content must become available to keyboard and assistive technologies.

Do not leave focusable hidden controls inside collapsed panels.

---

# 18. Accordion Heading Structure

Accordion headers should maintain the page's heading hierarchy.

Example:

```html
<h2>Frequently Asked Questions</h2>

<h3>
  <button>Question 1</button>
</h3>

<h3>
  <button>Question 2</button>
</h3>
```

Do not use heading levels merely for visual styling.

---

# 19. Slider / Carousel Accessibility

Follow the W3C WAI carousel pattern.

A carousel MUST provide accessible controls for:

* Previous
* Next

If auto-rotation exists, provide:

* Pause/stop control
* Start/restart control

W3C recommends stopping automatic rotation when keyboard focus enters the carousel and not restarting it unless the user explicitly requests it.

---

# 20. Auto-Rotating Slider

Auto-rotation MUST NOT create an inaccessible experience.

When focus enters the carousel:

```text
Auto Rotation
      ↓
STOP
```

When the user explicitly starts it:

```text
User activates Start
      ↓
Rotation starts
```

Do not automatically restart rotation when focus leaves unless the implementation explicitly supports an accessible user-controlled model.

---

# 21. Slider Controls

Previous and Next controls MUST be keyboard accessible.

Preferred:

```html
<button type="button" aria-label="Previous slide">
  ...
</button>

<button type="button" aria-label="Next slide">
  ...
</button>
```

Do not use clickable `<div>` or `<span>` elements.

---

# 22. Current Slide

The currently displayed slide must be understandable to assistive technology.

The implementation should expose:

* Current slide
* Slide name when available
* Slide position when useful
* Available navigation controls

W3C's carousel pattern provides accessible naming and slide semantics for this purpose.

---

# 23. Hidden Slider Slides

This is critical.

If a slide is visually hidden and should not be available to assistive technology:

```text
Hidden Slide
     ↓
Not visually available
     +
Not focusable
     +
Not incorrectly exposed to screen readers
```

Never leave focusable elements inside an inaccessible hidden slide.

Avoid situations such as:

```html
<div aria-hidden="true">
  <a href="#">Focusable Link</a>
</div>
```

This can create contradictory accessibility states.

---

# 24. Slider Focus Management

Changing slides should NOT unexpectedly move keyboard focus unless the interaction requires it.

Previous/Next controls should normally retain focus after activation.

Users should be able to repeatedly activate:

```text
Next
Next
Next
Previous
```

without unexpected focus movement.

This follows the W3C carousel interaction pattern.

---

# 25. Slider Screen Reader Announcements

When slide content changes:

* Screen reader users should understand that the displayed content changed.
* Do not create excessive announcements.
* Use appropriate live-region behavior based on whether the carousel automatically rotates or is user controlled.

W3C APG notes that live-region behavior differs depending on whether the carousel automatically rotates.

---

# 26. Slick / Swiper / Third-Party Slider Rule

When using a third-party slider such as Slick or Swiper:

DO NOT assume the library is automatically accessible.

Verify:

* Hidden slides
* Focusable elements
* `aria-hidden`
* `tabindex`
* Current slide state
* Previous/next controls
* Pagination controls
* Screen-reader announcements
* Auto-rotation
* Focus behavior

If a library creates:

```html
aria-hidden="true"
```

on a slide containing focusable elements, verify that those elements cannot receive focus while the slide is inaccessible.

---

# 27. Status Messages

Dynamic status messages MUST be accessible to screen readers.

Examples:

* Add to cart success
* Add to cart error
* Product unavailable
* Loading state
* Search results updated
* Filter results updated
* Form submission result

Use an appropriate live region/status mechanism.

Example:

```html
<div role="status" aria-live="polite">
  Product added to cart.
</div>
```

Do not repeatedly announce the same message unnecessarily.

WCAG 2.1 includes Status Messages under 4.1.3.

---

# 28. Loading States

When an interaction causes asynchronous loading:

```text
User Action
    ↓
Loading
    ↓
Result
```

The user should receive an appropriate accessible indication of the state.

Do not rely only on:

* Spinner animation
* Color change
* Visual movement

Provide meaningful accessible status where required.

---

# 29. Form Accessibility

Every form control MUST have an accessible label.

Prefer:

```html
<label for="email">
  Email
</label>

<input id="email" type="email">
```

Do not rely only on:

```html
placeholder="Email"
```

Placeholder text is not a replacement for a proper label.

---

# 30. Error Messages

Errors MUST be understandable to users.

When validation fails:

* Identify the field
* Communicate the error
* Associate the error with the relevant field
* Make the error available to assistive technologies

Example:

```html
<input
  id="email"
  aria-invalid="true"
  aria-describedby="email-error"
>

<p id="email-error">
  Enter a valid email address.
</p>
```

Follow WCAG:

* 3.3.1 Error Identification
* 3.3.2 Labels or Instructions
* 3.3.3 Error Suggestion

---

# 31. Color and Contrast

Do not communicate information using color alone.

Example:

```text
❌ Red = Error
```

must not be the only indication.

Use:

* Text
* Icons
* Labels
* State information

Also verify required contrast requirements under WCAG 2.1.

---

# 32. Reflow and Zoom

Do not break accessibility when users zoom or resize text.

Follow WCAG 2.1:

* 1.4.4 Resize Text
* 1.4.10 Reflow

Do NOT:

* Disable browser zoom
* Use restrictive viewport settings
* Create horizontal overflow unnecessarily
* Hide important content at increased zoom

Never use:

```html
<meta
  name="viewport"
  content="user-scalable=no"
>
```

or equivalent restrictions that prevent users from zooming.

---

# 33. Text Spacing

Content should remain usable when users apply increased:

* Line height
* Paragraph spacing
* Letter spacing
* Word spacing

Do not create fixed-height containers that clip text.

---

# 34. Hover and Focus Content

Do not make important functionality available only on hover.

If hover/focus reveals additional content, it should follow WCAG 1.4.13 requirements:

* Dismissible
* Hoverable
* Persistent

Keyboard users must also be able to access the information.

---

# 35. Touch and Pointer Interaction

Do not make functionality dependent on complex pointer gestures when a simpler interaction can be provided.

Provide keyboard-accessible alternatives.

Buttons and controls should have a usable interactive target.

---

# 36. Heading Structure

Maintain logical heading hierarchy.

Preferred:

```text
H1
 ├── H2
 │    ├── H3
 │    └── H3
 └── H2
      └── H3
```

Do not use headings only for visual styling.

Do not create multiple H1 elements unless the specific page architecture intentionally supports it.

---

# 37. Link vs Button

Use:

```html
<a href="">
```

when the action navigates somewhere.

Use:

```html
<button type="button">
```

when the action changes state or performs an operation.

Examples:

```text
Navigate → <a>

Open Modal → <button>

Open Accordion → <button>

Next Slide → <button>

Add to Cart → <button>

Submit Form → <button>
```

Do not use clickable `<div>` elements for these interactions.

---

# 38. ARIA Rules

Use ARIA only when necessary.

Follow this priority:

```text
Native HTML
    ↓
Semantic HTML
    ↓
Existing accessible pattern
    ↓
ARIA
```

Do not add ARIA attributes merely to increase the number of accessibility attributes.

Incorrect ARIA can make an otherwise accessible component inaccessible.

---

# 39. ARIA State Synchronization

Whenever ARIA represents UI state, it MUST match the actual visual/functional state.

Examples:

```text
Accordion:
aria-expanded ↔ panel visibility

Dialog:
aria-modal ↔ actual modal behavior

Slider:
current slide ↔ exposed slide state

Form:
aria-invalid ↔ actual validation state
```

Never allow stale ARIA values.

---

# 40. DOM Mutation Rule

When JavaScript dynamically changes accessibility state, update the relevant ARIA/state attributes at the same time.

Example:

```javascript
button.setAttribute(
  'aria-expanded',
  String(isExpanded)
);
```

Do not update only CSS classes while leaving ARIA state unchanged.

---

# 41. Focus After Dynamic Updates

Whenever JavaScript changes or replaces DOM content:

Check whether the user's current focus remains:

* Valid
* Visible
* Logical
* Accessible

Do not unexpectedly move focus.

For components such as:

* Dialogs
* Drawers
* Filters
* Search results
* Accordions
* Sliders

implement intentional focus management where required.

---

# 42. Accessibility Testing

Every accessibility implementation MUST be tested with:

### Keyboard

```text
Tab
Shift + Tab
Enter
Space
Escape
Arrow Keys
Home
End
```

as appropriate for the component.

### Screen Reader

Verify:

* Accessible name
* Role
* State
* Value
* Dynamic announcements
* Hidden content
* Focus movement

### Responsive

Test:

* Desktop
* Tablet
* Mobile
* Zoom
* Increased text size

---

# 43. Component-Specific Testing

## Dialog

```text
[ ] Opens with keyboard
[ ] Focus enters dialog
[ ] Focus remains inside dialog
[ ] Tab cycles correctly
[ ] Shift+Tab cycles correctly
[ ] Escape closes
[ ] Visible close button exists
[ ] Accessible name exists
[ ] Background is inert
[ ] Focus returns correctly
```

## Accordion

```text
[ ] Header is a button
[ ] Enter works
[ ] Space works
[ ] aria-expanded is correct
[ ] aria-controls points to correct panel
[ ] Hidden panel is not incorrectly focusable
[ ] Heading hierarchy is correct
```

## Slider / Carousel

```text
[ ] Previous button works
[ ] Next button works
[ ] Controls are keyboard accessible
[ ] Current slide is identifiable
[ ] Hidden slides are not incorrectly focusable
[ ] Auto-rotation can be stopped
[ ] Rotation stops when focus enters
[ ] Screen reader behavior is understandable
[ ] Focus does not unexpectedly move
```

---

# 44. Mandatory Accessibility Checklist

Before completing any accessibility task:

```text
[ ] Semantic HTML used
[ ] Keyboard accessibility verified
[ ] No keyboard trap
[ ] Focus visible
[ ] Focus order logical
[ ] No positive tabindex
[ ] No incorrect aria-hidden
[ ] ARIA state synchronized
[ ] Dialog behavior verified
[ ] Modal focus trap verified
[ ] Modal focus restoration verified
[ ] Accordion keyboard behavior verified
[ ] Accordion aria-expanded verified
[ ] Accordion aria-controls verified
[ ] Slider keyboard controls verified
[ ] Hidden slider content verified
[ ] Auto-rotation behavior verified
[ ] Status messages verified
[ ] Form labels verified
[ ] Error messages verified
[ ] Heading hierarchy verified
[ ] Link/button semantics verified
[ ] Color is not the only means of conveying information
[ ] Contrast checked
[ ] Zoom/reflow checked
[ ] Hover/focus content checked
[ ] Mobile behavior checked
[ ] Screen-reader behavior checked
```

---

# 45. Most Important Rule

When fixing or developing an accessible component:

```text
DO NOT JUST ADD ARIA
```

Instead:

```text
Understand Component
        ↓
Use Semantic HTML
        ↓
Define Correct Interaction
        ↓
Implement Keyboard Support
        ↓
Implement Focus Management
        ↓
Synchronize UI State
        ↓
Add ARIA Only Where Required
        ↓
Test With Screen Reader
        ↓
Test With Keyboard
```

Accessibility is not achieved by adding `aria-label`, `aria-hidden`, or `role` randomly.

The implementation MUST behave accessibly for both:

* Visual users
* Keyboard users
* Screen-reader users
* Touch users
* Users who zoom or resize text

---

# 46. Source References

Primary standard:

https://www.w3.org/TR/WCAG21/

W3C WAI-ARIA Authoring Practices:

https://www.w3.org/WAI/ARIA/apg/patterns/

Dialog Modal Pattern:

https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

Accordion Pattern:

https://www.w3.org/WAI/ARIA/apg/patterns/accordion/

Carousel Pattern:

https://www.w3.org/WAI/ARIA/apg/patterns/carousel/

---

# 47. Final Rule

**Always implement accessibility based on the actual behavior of the component, not merely on the presence of ARIA attributes.**

For every Dialog, Modal, Accordion, Slider, Carousel, Drawer, Dropdown, Tab, Form, and dynamically updated component:

```text
Semantic
   +
Keyboard Accessible
   +
Focus Accessible
   +
Screen Reader Accessible
   +
Correct ARIA State
   +
Correct Visual State
   +
Responsive
   =
Accessible Component
```

---

### WCAG 2.1 Reference

This rule is derived from the official W3C WCAG 2.1 Recommendation and W3C WAI-ARIA APG patterns. WCAG 2.1 defines the normative success criteria; the APG provides implementation guidance for common UI patterns.
