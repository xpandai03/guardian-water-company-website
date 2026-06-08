# Guardian Water Site — Handoff

## You now own:
- This GitHub repository
- The Vercel project (hosting)
- The guardianwatercompany.com domain (pointing at Vercel)

## How to make changes

1. Open your Replit workspace (synced from this GitHub repo)
2. Tell Replit Agent what to change in plain English
3. Review the proposed change, click Accept
4. Commit + Push via Replit's Git panel
5. Wait ~2 minutes — Vercel auto-deploys
6. Change is live on guardianwatercompany.com

## DO NOT modify these yourself — text Raunek first

- /api/leads/route.ts — handles form submissions to Jobber
- /lib/jobber/* — Jobber integration code
- Environment variables in Vercel
- The Jobber app config in Jobber Developer Center
- DNS records on GoDaddy (changing these can take the site 
  or email offline)

## When something breaks

1. Open vercel.com/dashboard
2. Click into your project → Deployments
3. Find the most recent deployment BEFORE the change
4. Click "..." → "Promote to Production"
5. Site rolls back in 30 seconds

## Common asks for Replit Agent

- "Change the headline on [page] from X to Y"
- "Update phone number across the site from X to Y"
- "Add a new blog post titled X with this content: [paste]"
- "Remove the section about Y on the [page]"

## Things Replit Agent struggles with

- Adding new pages with complex layouts
- New integrations (analytics, CRMs, payment systems)
- Structural changes to how the site works
- Database changes

For any of those, text Raunek.

## Email setup (MX records)

When the domain was pointed at Vercel, the DNS A records 
changed. The email-related DNS records (MX) need to be 
re-added in GoDaddy to restore email at sales@guardianwatercompany.com.

See docs/EMAIL_DNS_FIX.md for steps.

## Contact

Raunek Pratap — raunek@xpandai.com
