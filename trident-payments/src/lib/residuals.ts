/**
 * Hypothetical residual projection used by the earnings calculator.
 *
 * Model (kept deliberately simple and consistent):
 * - `accountsPerMonth` new merchant accounts are signed at the start of every month.
 * - An annual retention rate R is converted to an equivalent monthly survival
 *   rate m = R^(1/12), and every cohort decays by m each month after signing.
 *   After 12 months a cohort keeps exactly R of its accounts.
 * - Every active account pays the same flat `residualPerAccount` each month.
 *
 * Active accounts in month n:  A × (1 + m + m² + … + m^(n−1))
 * Monthly residual in month n: active(n) × residualPerAccount
 *
 * This illustrates how a book of accounts can compound. It is NOT a forecast and
 * says nothing about Trident's actual compensation terms.
 */

export interface ProjectionInput {
  accountsPerMonth: number;
  residualPerAccount: number;
  /** Annual retention, 0–100. */
  annualRetentionPct: number;
  months: number;
}

export interface ProjectionPoint {
  month: number;
  /** Fractional expected active accounts (kept unrounded for accuracy). */
  activeAccounts: number;
  /** Total accounts signed to date. */
  signedToDate: number;
  monthlyResidual: number;
}

export function monthlySurvival(annualRetentionPct: number): number {
  const r = Math.min(Math.max(annualRetentionPct, 0), 100) / 100;
  return r === 0 ? 0 : Math.pow(r, 1 / 12);
}

export function project(input: ProjectionInput): ProjectionPoint[] {
  const accounts = Math.max(0, input.accountsPerMonth);
  const residual = Math.max(0, input.residualPerAccount);
  const months = Math.max(0, Math.floor(input.months));
  const m = monthlySurvival(input.annualRetentionPct);

  const points: ProjectionPoint[] = [];
  let active = 0;
  for (let month = 1; month <= months; month++) {
    // Existing book decays by one month, then this month's signings are added.
    active = active * m + accounts;
    points.push({
      month,
      activeAccounts: active,
      signedToDate: accounts * month,
      monthlyResidual: active * residual,
    });
  }
  return points;
}

/** Rounds a chart maximum up to a clean number (1, 2, 2.5, 5 × 10^n). */
export function niceCeil(value: number): number {
  if (value <= 0) return 1000;
  const exp = Math.pow(10, Math.floor(Math.log10(value)));
  const f = value / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * exp;
}

export function pointAt(points: ProjectionPoint[], month: number): ProjectionPoint | undefined {
  return points.find((p) => p.month === month);
}

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatUsd(value: number): string {
  return usd.format(Math.round(value));
}

export function formatCompactUsd(value: number): string {
  if (Math.abs(value) >= 1000) {
    const k = value / 1000;
    return `$${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return formatUsd(value);
}
