/**
 * "Straight answers" content. Every statement here must be confirmed by
 * Trident before it goes live. When a policy is finalized, update the
 * matching status row and FAQ answer together.
 */

export type StatusKind = 'confirmed' | 'agreement' | 'pending';

export const statusRows: Array<{ topic: string; detail: string; status: StatusKind }> = [
  { topic: 'Launch timing', detail: 'Full launch planned for January 2027', status: 'confirmed' },
  { topic: 'Where', detail: 'Florida, starting with seven recruiting markets', status: 'confirmed' },
  { topic: 'Rep classification', detail: 'Independent contractors (1099), not employees', status: 'confirmed' },
  { topic: 'Schedule', detail: 'Part-time and full-time applicants welcome', status: 'confirmed' },
  { topic: 'How you earn', detail: 'Upfront commissions plus monthly residuals on qualifying accounts', status: 'confirmed' },
  { topic: 'Commission amounts & residual terms', detail: 'Defined in each representative agreement', status: 'agreement' },
  { topic: 'Equipment coverage', detail: 'Planned: Trident covers terminals and POS equipment', status: 'pending' },
  { topic: 'Onboarding & training details', detail: 'Being finalized ahead of launch', status: 'pending' },
  { topic: 'Territories', detail: 'Focus markets only — not assigned or exclusive', status: 'agreement' },
];

export const statusLabels: Record<StatusKind, string> = {
  confirmed: 'Confirmed',
  agreement: 'Per agreement',
  pending: 'Being finalized',
};

export const faqs: Array<{ q: string; a: string[] }> = [
  {
    q: 'What is Trident Payments?',
    a: [
      'Trident Payments is a merchant payment-processing business preparing for its full launch in January 2027. We help local businesses review how they accept card payments and present processing solutions that may suit them better.',
      'Right now we’re recruiting our first group of independent sales representatives in Florida — the founding sales bench.',
    ],
  },
  {
    q: 'Is this a job? What does 1099 mean?',
    a: [
      'Reps work with Trident as independent contractors and receive a 1099, not a W-2. That means you aren’t an employee and you aren’t paid a salary or an hourly wage — you earn commissions under the terms of your representative agreement.',
      'Independent contractors are generally responsible for their own taxes. If you’re new to 1099 work, it’s worth talking to a tax professional.',
    ],
  },
  {
    q: 'Can I do this part-time?',
    a: ['Yes. Part-time and full-time applicants are both welcome. Tell us which you’re leaning toward in your application — “not sure yet” is a fine answer.'],
  },
  {
    q: 'Do I need payments or merchant-services experience?',
    a: [
      'No. Field sales backgrounds — door-to-door, solar, pest control, alarm and outside sales — translate well, and we welcome motivated applicants with no payments experience at all.',
    ],
  },
  {
    q: 'How much can I earn?',
    a: [
      'There’s no guaranteed amount. Reps can earn upfront commissions on qualifying merchant accounts and monthly residuals on the qualifying processing of merchants they signed. What you earn depends on how many qualifying accounts you sign, how much those merchants process, how long they stay, and the terms of your representative agreement.',
      'The calculator on this page is a hypothetical illustration, not typical earnings and not a projection of what you will make.',
    ],
  },
  {
    q: 'How do monthly residuals work?',
    a: [
      'A residual is an ongoing commission tied to the qualifying processing activity of a merchant you signed. It continues while that merchant remains an active, qualifying account, subject to your representative agreement. Residuals are not lifetime or guaranteed — if a merchant stops processing or leaves, the residual from that account stops too.',
    ],
  },
  {
    q: 'Do I have to buy terminals or POS equipment?',
    a: [
      'The plan is for Trident to cover terminals and POS equipment so reps don’t personally finance hardware. The final equipment policy is still being confirmed before launch.',
    ],
  },
  {
    q: 'What does onboarding and training look like?',
    a: [
      'Onboarding and training details are being finalized ahead of the January 2027 launch. Applicants who move forward will get the specifics as part of the next step.',
    ],
  },
  {
    q: 'Will I get my own territory?',
    a: [
      'The seven cities on this page are recruiting focus markets, not assigned or exclusive territories. How territories work will be set out in your representative agreement. If you’re elsewhere in Florida, apply anyway and tell us where you are.',
    ],
  },
  {
    q: 'What happens after I apply?',
    a: [
      'We review applications ahead of launch and reach out to applicants who look like a fit to talk through the role, the agreement and next steps.',
      'Submitting an application is an expression of interest. It isn’t a job offer, a contract, or a guarantee of a position.',
    ],
  },
];
