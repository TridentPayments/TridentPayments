/**
 * Trident Payments — editable site configuration.
 *
 * Everything an owner is likely to change lives here: identity, contact
 * details, social links, launch timing, recruiting markets and the calculator
 * defaults. Values set to `null` are NOT confirmed yet; the page hides the
 * related link or shows an honest fallback until you fill them in.
 *
 * Environment-specific values (domain, form endpoint, analytics) are set as
 * environment variables instead — see `.env.example`.
 */

export const site = {
  name: 'Trident Payments',
  /** Shown in the browser tab and search results. Keep under ~60 characters. */
  title: 'Build a Book, Build Recurring Income | Trident Payments',
  /** Search/social description. Keep under ~155 characters. */
  description:
    'Join the Trident Payments founding sales bench in Florida. Independent 1099 reps earn upfront commissions plus monthly residuals. Full launch January 2027.',
  /** One-line company description used in the footer and structured data. */
  tagline: 'Modern merchant infrastructure.',

  launch: {
    /** Human-readable launch label used across the page. */
    label: 'January 2027',
    state: 'Florida',
  },

  /** Primary call to action. Used on every apply button. */
  primaryCta: 'Join the founding sales bench',
  /** Short form for the navigation button. */
  primaryCtaShort: 'Apply Now',

  contact: {
    /** Public recruiting inbox, e.g. 'recruiting@yourdomain.com'. NOT CONFIRMED. */
    email: null as string | null,
    /** Public phone number in E.164 format, e.g. '+14075550123'. NOT CONFIRMED. */
    phone: null as string | null,
    /** Business mailing address shown in the footer. NOT CONFIRMED. */
    address: null as string | null,
  },

  social: {
    /** Full Instagram profile URL, e.g. 'https://www.instagram.com/tridentpayments'. NOT CONFIRMED. */
    instagram: null as string | null,
    /** Full LinkedIn company URL. NOT CONFIRMED. */
    linkedin: null as string | null,
  },

  legal: {
    /** Link to a published privacy policy. Strongly recommended before collecting applications. */
    privacyPolicyUrl: null as string | null,
    /** Legal entity name for the footer copyright line, e.g. 'Trident Payments LLC'. NOT CONFIRMED. */
    legalEntity: null as string | null,
  },
} as const;

/** Recruiting focus markets. These are NOT assigned or exclusive territories. */
export const markets = [
  { city: 'Orlando', region: 'Central Florida' },
  { city: 'Daytona / Volusia', region: 'East Coast' },
  { city: 'Melbourne', region: 'Space Coast' },
  { city: 'Jacksonville', region: 'Northeast Florida' },
  { city: 'Tampa', region: 'Tampa Bay' },
  { city: 'Sarasota', region: 'Gulf Coast' },
  { city: 'Miami', region: 'South Florida' },
] as const;

/**
 * Starting values for the residual calculator. These are illustrative inputs,
 * NOT Trident compensation rates. Change only with care — the disclosures on
 * the page assume they are hypothetical.
 */
export const calculatorDefaults = {
  accountsPerMonth: 4,
  residualPerAccount: 150,
  annualRetentionPct: 90,
  months: 24,
  limits: {
    accountsPerMonth: { min: 1, max: 20, step: 1 },
    residualPerAccount: { min: 25, max: 500, step: 5 },
    annualRetentionPct: { min: 50, max: 100, step: 1 },
  },
} as const;
