---
name: accessibility
description: >
  Enforces accessibility (a11y), focus management, ARIA semantic rules, and live regions. Use when the user types "/accessibility" or "/a11y".
---

# Accessibility Guidelines

1. Hidden content must never be keyboard or screen reader accessible.
2. Hidden accordion, drawer, modal, tab, and dropdown content must be removed from the accessibility tree.
3. Focus must not move to status messages unless required.
4. aria-live announcements must not steal focus.
5. Cart updates must use live regions.
6. aria-hidden elements must never contain focusable descendants.
7. All ARIA references must point to valid elements.
8. Never create orphaned ARIA relationships.
9. Prefer native HTML over ARIA.
10. ARIA roles must not conflict with native semantics.
11. Every form control requires an accessible name.
12. Required fields must expose required state.
13. Validation errors must be properly announced.
14. Error messages must be adjacent to fields.
15. Quantity controls must be accessible.
16. Placeholder text must never replace labels.
17. Maintain logical heading hierarchy.
18. Every content region must have headings or landmarks.
19. Avoid duplicate headings.
20. Use semantic landmarks.
21. DOM order must match visual order.
22. Hidden content must not affect reading order.
23. Focus order must remain logical.
24. Prevent duplicate screen reader content.
25. Responsive duplicate UI must expose only one version.
26. Drawers must behave as accessible dialogs.
27. Opening drawers moves focus inside.
28. Closing drawers returns focus.
29. Background content must not be focusable.
30. Cart updates announce additions, removals, quantity, and errors.
31. Success and error messages announce without interrupting navigation.
32. Test keyboard navigation.
33. Pass Axe critical and serious issues.
34. Pass Lighthouse accessibility.
35. Test with a screen reader when accessibility code changes.
36. Accessibility fixes must not introduce hidden focus or duplicate announcements.
