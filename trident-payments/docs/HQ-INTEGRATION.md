# Trident HQ integration — staged website bridge

The public recruiting site remains an independent Astro application and retains its existing Apply Now workflow.

**Rep Login** appears in the header and footer *only after* the Vercel build variable `PUBLIC_HQ_URL` is set to a verified HTTPS HQ login URL (e.g. `https://hq.example.com/login`). Until HQ has working Supabase Auth, RLS, and deployment, the public site has no broken links.

The private Trident HQ application will be hosted and sourced separately. It will use Supabase invite-only authentication with CEO, setter, and closer roles, and RLS checks on merchant records. The public recruiting site never stores or proxies merchant documents, identity documents, EINs, or banking information.

## Deployment gate

1. Create a **private** HQ repository and isolated Supabase staging project. Verify actual identity, permissions and RLS in staging.
2. Deploy and test the HQ login. Validate that unauthenticated traffic cannot access the CRM or uploaded files.
3. Confirm the real HQ login URL and Cloudflare DNS.
4. Configure `PUBLIC_HQ_URL` on the public marketing site's Vercel project and redeploy; verify mobile header and footer.
5. Preserve Beacon original legal documents, agent code controlled by the server, and merchant-only DocuSign signing.

No credentials, live merchant data, PDF agreements or draft-only app code are added here. This PR is deliberately limited to the public-site entry point.
