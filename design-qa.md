# Velnaura Homepage Design QA

## Reference sources
- User-supplied Shopify scroll recording and screenshots: rounded section transition, solid-color editorial field, asymmetric three-card rhythm, and nested commerce panel.
- Approved Velnaura wordmark SVG and Mugtea tube photography supplied by the user.
- Brand direction from the supplied brief: evidence-led, restrained, transformative, and rooted in Skin Beyond Genetics.

## Desktop review
- Hero hierarchy is clear at first glance: belief system, stable supporting claim, and capsule CTA.
- Dynamic expression has a fixed-height, bottom-anchored line box with descender allowance, so neither “Beyond” nor the conversion block shifts between phrases and letters such as `y` and `p` remain fully visible.
- Navigation and announcement remain legible; buttons use the brand capsule geometry.
- The evidence section overlaps the final hero edge while the hero extends by the same amount, giving the first screen a clean endpoint and eliminating cream corner gaps around the curved panel.
- Three media placeholders use the requested wide / narrow / wide rhythm and intentionally become an inset, scrollbar-free horizontal rail on narrow viewports.
- Mugtea module uses an approved product render and remains visually distinct from the editorial field.
- No horizontal overflow observed at the rendered preview width.

## Responsive and accessibility review
- Mobile keeps the hero within the available viewport before the following section enters, while the media cards retain their proportions in a swipeable rail.
- Focus states are visible on interactive templates and the menu traps focus, closes with Escape, and restores focus.
- Reduced-motion mode suppresses animations and transitions.
- Product imagery has useful alt text; structural headings and landmarks are present.
- Text/background combinations use high-contrast cream, ink, and muted sage roles.

## Final result
Blocked for this iteration: the local browser-automation surface could not load its request-header policy, so a rendered-browser capture was unavailable. Unit tests and the production build pass; the next visual QA pass should specifically inspect the horizon word reveal, the mobile three-column footer navigation, and the one-line brand/social row.
