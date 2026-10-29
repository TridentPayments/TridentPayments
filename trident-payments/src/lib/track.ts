/**
 * Minimal conversion tracking. Sends events to Plausible when it's configured
 * (PUBLIC_PLAUSIBLE_DOMAIN) and always dispatches a `trident:track` DOM event,
 * so any other tool can listen without touching the page code.
 *
 * Events:
 *   apply_cta_click        — any "Apply" button (props.location says which)
 *   calculator_used        — first interaction with the calculator
 *   application_submitted  — the form endpoint accepted an application (primary conversion)
 *   application_error      — submission failed (network / endpoint error)
 */

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export function track(event: string, props: Props = {}): void {
  try {
    window.plausible?.(event, { props });
    window.dispatchEvent(new CustomEvent('trident:track', { detail: { event, props } }));
  } catch {
    /* analytics must never break the page */
  }
}
