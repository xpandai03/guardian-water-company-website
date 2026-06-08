# Restoring Email (MX Records) at GoDaddy

## What happened

When we pointed guardianwatercompany.com at the Vercel-hosted 
website, the DNS A records were updated. Email service uses 
separate DNS records called MX records. Whatever MX records 
were configured for your email provider (Google Workspace, 
Outlook, or wherever sales@guardianwatercompany.com is hosted) 
need to be re-added in GoDaddy.

## Steps

1. Log into your GoDaddy account
2. Navigate to: Domain Portfolio → guardianwatercompany.com → 
   DNS Settings
3. Look for existing MX records. If they're gone, you'll need 
   to add them back.

### If you use Google Workspace for email:

Add these MX records:

| Type | Name | Priority | Value |
|------|------|----------|-------|
| MX | @ | 1 | SMTP.GOOGLE.COM |

(Google migrated to a single MX record in early 2023. If your 
account is older, you may need the legacy 5-record setup — 
see https://support.google.com/a/answer/140034)

### If you use Outlook/Microsoft 365 for email:

Add the MX records Microsoft provides in your admin portal:
https://admin.microsoft.com → Setup → Domains → 
guardianwatercompany.com → DNS records

### If you use another provider:

Log into your email provider's admin panel. They will have a 
"set up your domain" or "DNS records" page that shows the 
exact MX records to add at your domain registrar.

## Verifying

After adding MX records, allow 1-24 hours for DNS propagation. 
Test by sending an email from a personal account (Gmail/etc) 
to sales@guardianwatercompany.com. If it lands in your inbox, 
the MX records are working.

## If you get stuck

Forward your email provider's setup instructions to Raunek 
and he can confirm the records you need to add. The actual 
adding has to happen on your GoDaddy account (he doesn't have 
access).

Raunek Pratap — raunek@xpandai.com
