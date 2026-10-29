import { describe, expect, it } from 'vitest';
import { formatCompactUsd, monthlySurvival, niceCeil, pointAt, project } from '../src/lib/residuals';

const base = { accountsPerMonth: 4, residualPerAccount: 150, annualRetentionPct: 90, months: 24 };

describe('residual projection', () => {
  it('converts annual retention to an equivalent monthly survival rate', () => {
    expect(Math.pow(monthlySurvival(90), 12)).toBeCloseTo(0.9, 10);
    expect(monthlySurvival(100)).toBe(1);
    expect(monthlySurvival(0)).toBe(0);
  });

  it('keeps exactly the annual retention of a cohort after 12 months', () => {
    const solo = project({ ...base, months: 13 });
    // Cohort signed in month 1 has aged 12 months by month 13.
    const m = monthlySurvival(90);
    const cohortOneAtMonth13 = 4 * Math.pow(m, 12);
    expect(cohortOneAtMonth13).toBeCloseTo(3.6, 10);
    expect(solo).toHaveLength(13);
  });

  it('reproduces the default illustration from the model (not hard-coded)', () => {
    const pts = project(base);
    expect(pts).toHaveLength(24);
    expect(Math.round(pointAt(pts, 12)!.monthlyResidual)).toBe(6864);
    expect(Math.round(pointAt(pts, 24)!.monthlyResidual)).toBe(13041);
    expect(pointAt(pts, 24)!.activeAccounts).toBeCloseTo(86.94, 2);
    expect(pointAt(pts, 24)!.signedToDate).toBe(96);
  });

  it('is linear with no churn and grows monotonically with churn', () => {
    const noChurn = project({ ...base, annualRetentionPct: 100 });
    expect(pointAt(noChurn, 24)!.activeAccounts).toBe(96);
    const pts = project(base);
    for (let i = 1; i < pts.length; i++) {
      expect(pts[i].monthlyResidual).toBeGreaterThan(pts[i - 1].monthlyResidual);
    }
  });

  it('never goes negative on bad input', () => {
    const pts = project({ accountsPerMonth: -3, residualPerAccount: -10, annualRetentionPct: 140, months: 3 });
    expect(pts.every((p) => p.monthlyResidual === 0 && p.activeAccounts === 0)).toBe(true);
  });

  it('rounds chart maxima to clean numbers', () => {
    expect(niceCeil(13041)).toBe(20000);
    expect(niceCeil(19562)).toBe(20000);
    expect(niceCeil(21000)).toBe(25000);
    expect(niceCeil(0)).toBe(1000);
  });

  it('formats compact currency for axis ticks', () => {
    expect(formatCompactUsd(0)).toBe('$0');
    expect(formatCompactUsd(5000)).toBe('$5K');
    expect(formatCompactUsd(12500)).toBe('$12.5K');
  });
});
