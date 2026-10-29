/**
 * Application form validation. Shared by the browser and the unit tests so the
 * rules can't drift apart.
 */

export const COMMITMENT_OPTIONS = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'unsure', label: 'Not sure yet' },
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: 'none', label: 'None yet' },
  { value: 'under-1', label: 'Under 1 year' },
  { value: '1-3', label: '1–3 years' },
  { value: '3-plus', label: '3+ years' },
] as const;

export interface ApplicationFields {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  instagram: string;
  currentRole: string;
  commitment: string;
  experienceLevel: string;
  relevantExperience: string;
  whyTrident: string;
  consent: boolean;
}

export type FieldErrors = Partial<Record<keyof ApplicationFields, string>>;

export const LIMITS = {
  fullName: 120,
  email: 254,
  location: 120,
  instagram: 31,
  currentRole: 120,
  relevantExperience: 1500,
  whyTrident: 1500,
  whyTridentMin: 20,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INSTAGRAM_RE = /^@?(?!.*\.\.)(?!.*\.$)[A-Za-z0-9._]{1,30}$/;

/** Returns the 10-digit US number, or null if the input isn't a valid US phone. */
export function normalizeUsPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  if (digits.length !== 10) return null;
  // NANP: area code and exchange can't start with 0 or 1.
  if (/^[01]/.test(digits) || /^[01]/.test(digits.slice(3))) return null;
  return digits;
}

export function formatUsPhone(digits: string): string {
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function normalizeInstagram(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  return '@' + trimmed.replace(/^@/, '');
}

export function validateApplication(f: ApplicationFields): FieldErrors {
  const e: FieldErrors = {};
  const t = (s: string) => s.trim();

  if (!t(f.fullName)) e.fullName = 'Enter your full name.';
  else if (t(f.fullName).length < 2) e.fullName = 'Enter your full name.';
  else if (t(f.fullName).length > LIMITS.fullName) e.fullName = 'That name is too long.';

  if (!t(f.email)) e.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(t(f.email)) || t(f.email).length > LIMITS.email)
    e.email = 'Enter a valid email, like name@example.com.';

  if (!t(f.phone)) e.phone = 'Enter your phone number.';
  else if (!normalizeUsPhone(f.phone)) e.phone = 'Enter a 10-digit US phone number.';

  if (!t(f.location)) e.location = 'Enter your city and state.';
  else if (t(f.location).length > LIMITS.location) e.location = 'Keep this under 120 characters.';

  if (t(f.instagram) && !INSTAGRAM_RE.test(t(f.instagram)))
    e.instagram = 'Use letters, numbers, periods or underscores, like @yourhandle.';

  if (!t(f.currentRole)) e.currentRole = 'Tell us what you do now.';
  else if (t(f.currentRole).length > LIMITS.currentRole) e.currentRole = 'Keep this under 120 characters.';

  if (f.commitment && !COMMITMENT_OPTIONS.some((o) => o.value === f.commitment))
    e.commitment = 'Choose one option.';

  if (f.experienceLevel && !EXPERIENCE_OPTIONS.some((o) => o.value === f.experienceLevel))
    e.experienceLevel = 'Choose one option.';

  if (t(f.relevantExperience).length > LIMITS.relevantExperience)
    e.relevantExperience = `Keep this under ${LIMITS.relevantExperience} characters.`;

  if (!t(f.whyTrident)) e.whyTrident = 'Tell us why you’re interested.';
  else if (t(f.whyTrident).length < LIMITS.whyTridentMin)
    e.whyTrident = 'Give us a sentence or two — at least 20 characters.';
  else if (t(f.whyTrident).length > LIMITS.whyTrident)
    e.whyTrident = `Keep this under ${LIMITS.whyTrident} characters.`;

  if (!f.consent) e.consent = 'Please confirm to submit your application.';

  return e;
}
