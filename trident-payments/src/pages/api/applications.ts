import type { APIRoute } from 'astro';
import { validateApplication } from '../../lib/validation';

export const prerender = false;

function respond(status: number) {
  return Response.json({ ok: status === 200 }, { status });
}

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return respond(403);
  }

  if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') {
    return respond(415);
  }

  const body = await request.text();
  if (body.length > 16_384) return respond(413);

  let payload: Record<string, unknown>;
  try {
    const parsed = JSON.parse(body);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return respond(400);
    payload = parsed;
  } catch {
    return respond(400);
  }

  const field = (key: string) => {
    const value = payload[key];
    return typeof value === 'string' ? value.trim() : '';
  };
  const selection = (key: string) => field(key) === 'not specified' ? '' : field(key);
  const application = {
    fullName: field('full_name'),
    email: field('email'),
    phone: field('phone'),
    location: field('city_state'),
    instagram: field('instagram'),
    currentRole: field('current_role'),
    commitment: selection('commitment'),
    experienceLevel: selection('experience_level'),
    relevantExperience: field('relevant_experience'),
    whyTrident: field('why_trident'),
    consent: field('consent_to_contact') === 'yes',
  };
  if (Object.keys(validateApplication(application)).length) return respond(400);

  const key = process.env.RESEND_API_KEY;
  if (!key) return respond(503);

  const details = [
    ['Name', application.fullName],
    ['Email', application.email],
    ['Phone', application.phone],
    ['City and state', application.location],
    ['Instagram', application.instagram],
    ['Current role', application.currentRole],
    ['Commitment', application.commitment],
    ['Sales experience', application.experienceLevel],
    ['Relevant experience', application.relevantExperience],
    ['Why Trident Payments', application.whyTrident],
    ['Consent to contact', 'Yes'],
    ['Source', field('utm_source').slice(0, 100)],
    ['Campaign', field('utm_campaign').slice(0, 100)],
  ];

  try {
    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Trident Payments Recruiting <recruiting@trident-payments.com>',
        to: ['info@trident-payments.com'],
        reply_to: application.email,
        subject: 'New Trident Payments recruiting application',
        text: details.map(([label, value]) => label + ': ' + (value || '—')).join('\n'),
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (sent.ok) return respond(200);
    console.error('Resend rejected the recruiting application', sent.status);
  } catch {
    console.error('Resend request failed for a recruiting application');
  }
  return respond(502);
};
