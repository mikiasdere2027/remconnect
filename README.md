# RemConnect

Static front-end prototype for RemConnect — remote support careers from Ethiopia.

## What's here

| Page | File | What it is |
|---|---|---|
| Website | `index.html` | Landing page: career paths (with mega menu), how it works, agent stories, requirements, FAQ |
| Apply | `apply.html` | Step 1 create account → step 2 application (resume, about you, English check, voice sample, review) |
| Sign in | `apply.html?screen=login` | Returning agents |
| Admin console | `admin/login.html` | Staff dashboard: overview, assessments, learning, network, leads, trends + 12 management screens |

Admin demo login: on the admin login page click **Use demo account**, then **Sign in**.

## Run locally

```bash
python -m http.server 5180
```

Then open http://localhost:5180/ (website) or http://localhost:5180/admin/login.html (admin).

## Structure

```
index.html, styles.css, script.js        website
admin-match.css/.js, readable.css        website look & feel (matches the admin), text sizes
mega.css/.js                             Career paths mega menu
apply.html/.css/.js                      Apply + sign in
admin/                                   admin console (login, dashboard, screens, search, dropdowns)
assets/                                  images
```

## Prototype limits

- No backend: nothing is sent or stored; admin changes reset on reload.
- The admin login is a front-end demo check only — replace it with real authentication before any real use.
- Admin figures are a fixed 30-day snapshot. Applicant and agent names are shortened and personal emails masked.
- Confirm cohort, timing, statistics and testimonials against the live site before production use.
