# RemConnect redesign — audit, strategy, and implementation notes

## Scope

The supplied artifact was a full-page screenshot, not the source repository. I also reviewed the publicly accessible RemConnect homepage at `https://remconnect.io/` to verify the visible business proposition, sections, career paths, and key links. This output is a standalone HTML/CSS/JavaScript prototype; it has not been deployed to or integrated with the live service.

## 1. Audit summary

### What is working

- The core proposition is specific and easy to understand: training, certification, and placement for remote-support careers from Ethiopia.
- The current site covers the essential concerns of applicants: job tracks, how it works, cohort-based intake, profile benefits, outcomes, equipment/eligibility, and FAQs.
- Navy and blue support a credible, professional career-platform direction.
- The application and agent login paths already exist on the public site.

### Highest-impact opportunities

| Priority | Opportunity | Redesign response |
|---|---|---|
| P1 | Main proposition and next step compete with dense visual details | Large headline, short supporting copy, one primary CTA, one secondary path |
| P1 | Role cards are small and visually similar | One featured role plus five supporting roles; filters by experience level |
| P1 | Application journey could be more scannable | Three numbered steps with a clear transition from apply to training to placement |
| P1 | Proof and no-fee commitment should be easy to verify | Proof strip, cohort explanation, profile panel, and focused FAQ answers |
| P2 | Long-page rhythm feels repetitive at thumbnail scale | Alternate white, pale-blue, and navy sections with intentional content density |
| P2 | Small text and low-contrast metadata hurt quick scanning | Larger body sizes, stronger contrast, shorter copy blocks, consistent metadata |
| P2 | Mobile navigation and role discovery need explicit behavior | Keyboard-accessible expandable menu, horizontal filter row, and responsive card layouts |

## 2. Design direction

**Direction:** Clear, confident, human-first career platform. The design keeps RemConnect's navy and blue identity and gives the content more breathing room. Photography focuses on East African professionals and real-feeling remote-work settings. UI decoration is restrained and functional.

### Design tokens

| Token | Value | Intended use |
|---|---|---|
| Deep navy | `#0B1B3A` | Hero, profile benefits, footer |
| Supporting navy | `#102850` | Deep section gradients and overlays |
| Primary blue | `#1674E8` | Main CTAs, links, active filters |
| Pale blue | `#F1F6FF` | Method and FAQ backgrounds |
| Main text | `#12213D` | Headlines and body copy |
| Muted text | `#64748B` | Supporting copy and metadata |
| Lines | `#E4EAF3` | Cards, dividers, field boundaries |
| Success green | `#1B9D75` | Verified/completed states |
| Typography | DM Sans + Manrope | Body and headings, with system fallbacks |
| Radius | 10 / 18 / 28 px | Controls, cards, major panels |
| Spacing | 8 px base rhythm | Padding, card spacing, section layout |

## 3. Information architecture

1. Header: Roles, Method, Stories, FAQ, Log in, Apply for free.
2. Hero: value proposition, primary application action, method explainer link, key program attributes.
3. Proof strip: placement scale, payment currency, typical timing, agent-first support.
4. Role discovery: six career tracks plus experience filters.
5. Method: apply, train/certify, get matched/placed.
6. Cohort explanation: why cohort-based intake is used, with the same primary application route.
7. Career profile benefits: training, pay model, coaching, illustrative skill profile.
8. Stories: three short testimonial blocks with roles and attribution.
9. Journey explainer: directs visitors to the method section rather than presenting a fake video player.
10. Readiness: internet, workspace, equipment, English, time commitment, ID.
11. FAQ: no fees, prior experience, payment, equipment, timing, and placement questions.
12. Closing application CTA and footer.

## 4. Conversion strategy

- Use the same primary action label, **Apply for free**, throughout the page.
- Keep a visually secondary “See how it works” action so visitors can reduce uncertainty before applying.
- Offer role filters before asking visitors to commit. Filters are client-side and require no account or backend.
- Repeat application links after role discovery, process explanation, and readiness guidance.
- Put the no-fee policy and payment details in the main journey and FAQ, avoiding urgency or earning guarantees.
- Avoid a contact/newsletter form because no compatible backend endpoint was provided for the prototype.

## 5. Implementation details

- `index.html`: semantic, single-page website, SEO metadata, Organization JSON-LD, correct landmarks, real application/login routes.
- `styles.css`: design tokens, desktop/tablet/mobile layout, hover/focus states, reduced-motion behavior, contrast-aware surfaces.
- `script.js`: mobile navigation toggle, keyboard Escape handling, role filters, and single-open FAQ behavior.
- `assets/hero-remconnect.webp`: locally stored, optimized generated hero photograph.
- `assets/team-remconnect.webp`: locally stored, optimized generated support-team photograph.
- `README.md`: launch instructions and scope limitations.

The original project's framework and existing components could not be inspected because only a screenshot was supplied. For that reason, this deliverable uses plain HTML, CSS, and JavaScript and intentionally does not claim to replace the existing codebase.

## 6. Validation report

### Checks completed

- `node --check script.js`: passed (JavaScript syntax check).
- HTML parser pass: completed without a parse exception.
- Anchor validation: all local `#section` links have matching IDs; IDs are unique.
- Asset validation: all referenced local image files exist.
- Structure counts: six role cards and six FAQ items present.
- CSS delimiter validation: opening and closing brace counts match.

### Not completed

- Full browser visual review, mobile overflow testing, keyboard walkthrough, and live link clicks were not completed. The available headless browser environment blocked page navigation, so no passing browser-test claim is made.
- The existing repository's routing, application submission, authentication, APIs, analytics, and component conventions were not inspected.
- No deployment or changes to `remconnect.io` were made.

### Before production

1. Apply the visual system to the real project after its source is available, preserving the current framework and integrations.
2. Verify current placement statistics, expected time to placement, cohort availability, payment terms, testimonials, and usage permissions.
3. Replace or connect legal, contact, and analytics destinations to confirmed production endpoints.
4. Test real application and login flows, all breakpoints, keyboard access, accessibility contrast, image delivery, and Core Web Vitals.
