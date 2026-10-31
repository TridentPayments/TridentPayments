/**
 * Resolve the private HQ login URL from the public site's optional build config.
 * An unavailable HQ deployment must never create a broken login link.
 */
export function resolveHqLoginUrl(raw: unknown): string | null {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:' || !url.hostname || url.username ||
        url.password || url.search || url.hash) return null;
    if (url.port && url.port !== '443') return null;
    return url.toString();
  } catch {
    return null;
  }
}
