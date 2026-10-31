import { describe, expect, it } from 'vitest';
import { resolveHqLoginUrl } from '../src/lib/hq-url';

describe('private HQ link on the public recruiting site', () => {
  it('stays hidden until a verified HQ URL is configured', () => {
    expect(resolveHqLoginUrl(undefined)).toBeNull();
    expect(resolveHqLoginUrl('')).toBeNull();
  });
  it('requires a direct https URL', () => {
    for (const invalid of ['http://hq.tridentpayments.com/login','/hq','javascript:alert(1)','bad-url','ftp://example.com']) {
      expect(resolveHqLoginUrl(invalid)).toBeNull();
    }
  });
  it('rejects embedded credentials, query parameters and URL fragments', () => {
    expect(resolveHqLoginUrl('https://user:pass@hq.example.com/login')).toBeNull();
    expect(resolveHqLoginUrl('https://hq.example.com/login?token=secret')).toBeNull();
    expect(resolveHqLoginUrl('https://hq.example.com/login#token')).toBeNull();
  });
  it('permits the verified secure login route', () => {
    expect(resolveHqLoginUrl(' https://hq.example.com/login ')).toBe('https://hq.example.com/login');
    expect(resolveHqLoginUrl('https://hq.example.com:1234/login')).toBeNull();
  });
});
