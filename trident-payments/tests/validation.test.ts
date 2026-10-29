import { describe, expect, it } from 'vitest';
import {
  normalizeInstagram,
  normalizeUsPhone,
  validateApplication,
  type ApplicationFields,
} from '../src/lib/validation';

const valid: ApplicationFields = {
  fullName: 'Jordan Rivera',
  email: 'jordan@example.com',
  phone: '(407) 555-0123',
  location: 'Orlando, FL',
  instagram: '',
  currentRole: 'Outside sales, solar',
  commitment: 'part-time',
  experienceLevel: '1-3',
  relevantExperience: '',
  whyTrident: 'I want to build a book of business I own the relationships in.',
  consent: true,
};

describe('application validation', () => {
  it('accepts a complete application', () => {
    expect(validateApplication(valid)).toEqual({});
  });

  it('requires the required fields', () => {
    const errors = validateApplication({
      ...valid,
      fullName: ' ',
      email: '',
      phone: '',
      location: '',
      currentRole: '',
      whyTrident: '',
      consent: false,
    });
    expect(Object.keys(errors).sort()).toEqual(
      ['consent', 'currentRole', 'email', 'fullName', 'location', 'phone', 'whyTrident'].sort()
    );
  });

  it('keeps optional fields optional', () => {
    expect(
      validateApplication({ ...valid, instagram: '', commitment: '', experienceLevel: '', relevantExperience: '' })
    ).toEqual({});
  });

  it('rejects malformed email, phone and Instagram handles', () => {
    const e = validateApplication({ ...valid, email: 'jordan@', phone: '555-0123', instagram: 'bad handle!' });
    expect(e.email).toBeDefined();
    expect(e.phone).toBeDefined();
    expect(e.instagram).toBeDefined();
  });

  it('rejects unknown option values', () => {
    const e = validateApplication({ ...valid, commitment: 'weekends', experienceLevel: '10' });
    expect(e.commitment).toBeDefined();
    expect(e.experienceLevel).toBeDefined();
  });

  it('asks for a real answer to "Why Trident"', () => {
    expect(validateApplication({ ...valid, whyTrident: 'money' }).whyTrident).toBeDefined();
  });

  it('normalizes US phone numbers', () => {
    expect(normalizeUsPhone('+1 (407) 555-0123')).toBe('4075550123');
    expect(normalizeUsPhone('407.555.0123')).toBe('4075550123');
    expect(normalizeUsPhone('107-555-0123')).toBeNull();
    expect(normalizeUsPhone('12345')).toBeNull();
  });

  it('normalizes Instagram handles', () => {
    expect(normalizeInstagram('trident.rep')).toBe('@trident.rep');
    expect(normalizeInstagram('@trident_rep')).toBe('@trident_rep');
    expect(normalizeInstagram('  ')).toBe('');
  });
});
