# Trident Payments — Founding Sales Bench recruiting site

A single-page recruiting site for **independent 1099 sales representatives in Florida**, ahead of Trident Payments' January 2027 launch.

The page has one job: help a field salesperson, often arriving from Instagram on a phone, understand the business and how reps are paid, then **apply to join the founding sales bench**.

> **Not ready for public launch until the items in [Before you go live](#before-you-go-live) are done.** The most important: connect the application form, set the domain, and have the compensation and disclosure copy reviewed.

---

## What's on the page

The visual system is pearl white (`#FAFAF8`) with near-black type and buttons, light-gray cards (`#F3F3F1`), the Apple system font (falling back to self-hosted Inter) and real photography, following the approved reference mockup.

| Section | Purpose |
|---|---|
| Hero | `FLORIDA · FULL LAUNCH JANUARY 2027`, "Build a book. Build recurring income.", black CTA, field-rep photo with a "Real businesses. Real conversations. Recurring income." card |
| Compensation | Three cards with icons: upfront commissions, monthly residuals, the $0 equipment *plan* (pending confirmation) |
| Earnings calculator | "See what's possible.": slider and number inputs, three outputs, a 24-month bar chart shaded light to dark, and a disclaimer |
| The work | "Close. Command. Compound.": four numbered steps with arrows |
| Fit / Markets | "Driven people win here." checklist next to photo tiles for the seven Florida markets |
| Apply | "Put your name on the radar.": a three-column form with a full-width submit button |
| Straight answers | Confirmed-vs-pending status list and FAQ |
| Footer | Wordmark, tagline, links, copyright, earnings and 1099 disclosures |

### Images

| File | Use |
|---|---|
| `src/assets/hero-field-rep.jpg` | Hero photo |
| `src/assets/markets/*.jpg` | Market tiles |
| `public/og.jpg` | Social share card (1200×630) |

Astro converts the `src/assets` images to responsive AVIF and WebP at build time. The hero loads first (`fetchpriority="high"`) and the market tiles lazy-load.

**These photos are AI-generated** (Higgsfield, GPT Image 2.5), recreated from the reference mockup. They are illustrative: the "rep" is not a real Trident employee, and the city scenes are not photographs of the exact locations. The footer says "Photography is illustrative." Replace them with real team and market photos when you have them. Keep the same file names and roughly 3:2 framing and nothing else needs to change.

### Calculator model

Inputs: new accounts per month, residual per active account and annual retention. They start at 4, $150 and 90%.

- Each month's new accounts are signed at the start of the month.
- Annual retention *R* becomes a monthly survival rate *m = R^(1/12)*, so a cohort keeps exactly *R* of its accounts after 12 months.
- Active accounts in month *n* = *A × (1 + m + … + m^(n−1))*. Residual = active × per-account residual.

With the default inputs, the model produces **$6,864/month at month 12** and **$13,041/month at month 24**, about 87 of 96 signed accounts still active. These are calculated, not hard-coded, and they match the figures in the original concept. Unit tests in `tests/residuals.test.ts` lock in this behaviour.

The example inputs are **not** Trident compensation data, and the page says so in several places.

---

## Tech stack

- [Astro 7](https://astro.build) produces static HTML, so no server is required
- TypeScript (strict)
- Tailwind CSS v4
- Apple system font stack, with self-hosted Inter (Fontsource) as the fallback, so there are no Google Fonts requests
- `@astrojs/sitemap` generates the sitemap; `robots.txt` is built from `SITE_URL`
- Vitest for unit tests (calculator model, form validation)

There's no client framework. The calculator and form are small TypeScript modules, and the bar chart is plain HTML with CSS height transitions.

## Commands

Requires Node 22.12+.

```bash
npm install
```

```bash
npm run dev       # local dev server at http://localhost:4321
```

```bash
npm run verify    # type check + unit tests + production build
```

Individual steps: `npm run check`, `npm test`, `npm run build`, `npm run preview`.

---

## Editing content

| What | Where |
|---|---|
| Name, CTA text, launch label, contact email/phone/address, Instagram/LinkedIn, privacy policy link, legal entity name | `src/config/site.ts` |
| Recruiting markets | `src/config/site.ts` → `markets` |
| Calculator starting values and slider ranges | `src/config/site.ts` → `calculatorDefaults` |
| Status table and FAQ answers | `src/config/faq.ts` |
| Section copy | `src/components/*.astro` (one file per section) |
| Logo mark | `src/components/Logo.astro`, `public/favicon.svg`, `public/favicon-32.png`, `public/apple-touch-icon.png` |
| Photos | `src/assets/` (see [Images](#images)) |
| Social share image | `public/og.jpg` (1200×630) |

Anything set to `null` in `site.ts` is **unconfirmed**. The page hides that link or detail rather than showing a made-up value.

When a policy is finalized (equipment coverage, training, commission schedule), update **both** the status row in `src/config/faq.ts` and the matching FAQ answer and section copy.

---

## Environment variables

Copy `.env.example` to `.env` for local work, and add the same variables in your hosting provider for production builds. These values are inlined at build time, so you need to redeploy after changing them.

| Variable | Required | Purpose |
|---|---|---|
| `SITE_URL` | **Yes, before launch** | Final origin, e.g. `https://www.yourdomain.com`. Drives canonical, Open Graph, `robots.txt` and the sitemap. Without it the build uses a placeholder and logs a warning. |
| `PUBLIC_APPLICATION_ENDPOINT` | **Yes, before launch** | The URL the application form POSTs JSON to. Without it the form validates but shows "Online applications aren't connected yet" and **never pretends to submit**. |
| `PUBLIC_PLAUSIBLE_DOMAIN` | Optional | Turns on [Plausible](https://plausible.io) analytics. Leave empty to ship with no analytics script. |

### Connecting the application form

The form sends a `POST` with `Content-Type: application/json` and `Accept: application/json`. Any 2xx response is treated as success; anything else shows a retry message and keeps the applicant's answers. Pick one of:

1. **Formspree (simplest):** create a form at formspree.io and set `PUBLIC_APPLICATION_ENDPOINT=https://formspree.io/f/<id>`. The payload's `_subject` becomes the notification email subject.
2. **n8n, Make or Zapier webhook:** point it at a webhook that accepts JSON and allows CORS from your domain. It can route applicants into a CRM, a Google Sheet or Slack.
3. **Your own endpoint**, e.g. a Cloudflare Worker or Vercel Function.

The endpoint URL ships in the public page by design, so never put a secret in it.

Payload fields:

```
_subject, full_name, email, phone, city_state, instagram, current_role,
commitment, experience_level, relevant_experience, why_trident,
consent_to_contact, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
landing_page, referrer, submitted_at
```

Spam protection is a hidden honeypot field. If you see bot traffic, add your provider's captcha or rate limiting.

### Conversion tracking

`src/lib/track.ts` sends these events to Plausible (when configured) and always dispatches a `trident:track` DOM event:

| Event | When |
|---|---|
| `application_submitted` | **Primary conversion**: the endpoint accepted an application. Props: `commitment`, `experience`, `source` |
| `apply_cta_click` | Any apply button. Prop `location`: header, hero, markets-other |
| `calculator_used` | First interaction with the calculator |
| `application_error` | The submission failed |

**Instagram attribution:** use links like `https://yourdomain.com/?utm_source=instagram&utm_medium=social&utm_campaign=founding-bench` in the bio, stories and DMs. The UTM values are attached to every application, so you can see which posts produce applicants, not just clicks.

---

## Deployment

The build output is static HTML in `dist/`, so any static host works.

### Vercel

1. Import `TridentPayments/TridentPayments` at vercel.com → **Add New → Project**. Vercel detects Astro automatically (build `npm run build`, output `dist`).
2. Under **Settings → Environment Variables**, add `SITE_URL`, `PUBLIC_APPLICATION_ENDPOINT` and optionally `PUBLIC_PLAUSIBLE_DOMAIN`.
3. Deploy, then add your domain under **Settings → Domains**.

### Cloudflare Pages

1. **Workers & Pages → Create → Pages → Connect to Git** and choose the repo.
2. Framework preset **Astro**, build command `npm run build`, output directory `dist`. Set `NODE_VERSION=22`.
3. Add the same environment variables, deploy, then add the domain under **Custom domains**.

### Connecting the custom domain (DNS)

At your registrar, or wherever DNS is hosted:

- **Apex** (`yourdomain.com`): Vercel uses an `A` record → `76.76.21.21`. On Cloudflare Pages, move DNS to Cloudflare and it creates the record for you.
- **www**: `CNAME www → cname.vercel-dns.com` (Vercel) or `CNAME www → <project>.pages.dev` (Cloudflare).
- Pick **one** canonical host (`www` or apex), redirect the other to it in the host's domain settings, and set `SITE_URL` to match exactly.
- HTTPS certificates are issued automatically once DNS resolves, which can take minutes to a few hours.

Always use the exact records your host's dashboard shows; they can differ by account. After DNS resolves, check that `https://yourdomain.com/robots.txt` lists the right sitemap URL.

---

## Before you go live

These are genuine gaps. The site deliberately does **not** invent them.

**Blocking:**

1. **Application endpoint:** set `PUBLIC_APPLICATION_ENDPOINT`. Until then, no application can be received.
2. **Domain:** set `SITE_URL`.
3. **Compensation and disclosure review:** have counsel review the earnings calculator, the footer disclosures (including "some representatives may earn little or nothing") and all commission and residual language. The FTC scrutinizes earnings claims in recruiting, and this page shows hypothetical earnings figures.
4. **Privacy policy:** you'll be collecting names, emails and phone numbers. Publish a policy and set `site.legal.privacyPolicyUrl`.
5. **Contact consent wording:** the form asks for consent to contact by email, phone or text. Confirm the wording meets your SMS/TCPA obligations before texting applicants.

**Needed soon:**

6. **Recruiting contact email** (`site.contact.email`). It's also used as the fallback if the form fails.
7. **Instagram profile URL** (`site.social.instagram`), plus LinkedIn if any.
8. **Logo assets and photography:** the shield mark and wordmark are placeholders, and the photos are AI-generated illustrations. Replace `Logo.astro`, the favicons, `og.jpg` and the images in `src/assets/`.
9. **Legal entity name and business address** for the footer.
10. **Equipment policy:** currently shown as "Pending final confirmation".
11. **Onboarding and training details:** currently "Being finalized".
12. **Commission schedule and representative agreement:** amounts, payout timing, residual eligibility and clawbacks are intentionally not stated anywhere.
13. **Processor and product relationships:** Clover is only mentioned "where authorized". Confirm your authorization before naming it more prominently.
14. **Cost to join:** the page only says *applying* is free. If there are no fees for reps at all, add a FAQ entry saying so, because recruits look for it.

**Copy that must stay accurate:** no exclusive territories, guaranteed signing bonuses, payout dates, processor certifications or merchant savings are claimed. Keep it that way unless they are confirmed in writing.

---

## Project structure

```
src/
  config/site.ts        identity, contact, CTA, markets, calculator defaults
  config/faq.ts         status table + FAQ content
  lib/residuals.ts      projection model (pure, unit-tested)
  lib/validation.ts     form rules shared by browser + tests
  lib/track.ts          conversion events
  components/           one component per section
  assets/               hero + market photos (optimized at build)
  layouts/Base.astro    SEO, Open Graph, JSON-LD (Organization, WebSite, WebPage, FAQPage), fonts, analytics
  pages/index.astro     page assembly, header state, CTA tracking
  pages/robots.txt.ts   generated robots.txt
tests/                  Vitest unit tests
public/                 favicons, og.jpg
```
