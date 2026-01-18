# Subdomain Split Setup Guide

This guide documents all the steps needed to complete the TopoStory subdomain split:

- `www.topostory.com` → Marketing site (this repo)
- `app.topostory.com` → Application (`topostory` repo)

## 1. Vercel Configuration

### Marketing Site (this repo)

1. Create new Vercel project and link `topostory-marketing` repo
2. **Settings → Domains**:
   - Add `www.topostory.com` as production domain
   - Add redirect: `topostory.com` → `www.topostory.com`

### Application (`topostory` repo)

1. In existing Vercel project, go to **Settings → Domains**
2. Remove `topostory.com` and `www.topostory.com`
3. Add `app.topostory.com` as the production domain

## 2. Environment Variables

### Application (`topostory` repo)

Update in Vercel Dashboard → Settings → Environment Variables:

| Variable | Old Value | New Value |
|----------|-----------|-----------|
| `FRONTEND_URL` | `https://topostory.com` | `https://app.topostory.com` |

## 3. Clerk Dashboard

Go to [Clerk Dashboard](https://dashboard.clerk.com/) → Your app

### Settings → Domains

1. Add `app.topostory.com` as an allowed domain
2. Remove `topostory.com` if present (keep `www.topostory.com` for marketing site cookies if needed)

### Settings → Paths

Update redirect URLs if customized:
- After sign-in URL: `https://app.topostory.com`
- After sign-up URL: `https://app.topostory.com`
- After sign-out URL: `https://app.topostory.com`

### Waitlist (if using coming soon mode)

If using the Clerk Waitlist feature, update the redirect URL to `https://app.topostory.com`.

## 4. Stripe Dashboard

Go to [Stripe Dashboard](https://dashboard.stripe.com/)

### Webhooks

1. Go to **Developers → Webhooks**
2. Find the existing webhook endpoint
3. Update the URL from `https://topostory.com/api/webhooks` to `https://app.topostory.com/api/webhooks`

Or create a new endpoint:
- URL: `https://app.topostory.com/api/webhooks`
- Events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

### Customer Portal

1. Go to **Settings → Billing → Customer Portal**
2. Update the default return URL to `https://app.topostory.com`

## 5. DNS Configuration

If managing DNS separately from Vercel:

| Type | Name | Value |
|------|------|-------|
| CNAME | `www` | `cname.vercel-dns.com` |
| CNAME | `app` | `cname.vercel-dns.com` |

Vercel handles SSL certificates automatically.

## 6. Verification Checklist

After making all changes, verify:

- [ ] `www.topostory.com` loads the marketing site
- [ ] `topostory.com` redirects to `www.topostory.com`
- [ ] `app.topostory.com` loads the application
- [ ] Sign in works on `app.topostory.com`
- [ ] Stripe checkout completes and redirects back to `app.topostory.com`
- [ ] Stripe webhooks are received (check Stripe Dashboard → Webhooks → Recent deliveries)
- [ ] Billing portal returns to `app.topostory.com`
- [ ] Marketing site CTAs link to `app.topostory.com`

## Rollback

If issues occur:

1. **Vercel**: Add `topostory.com` back to the app project
2. **Environment**: Revert `FRONTEND_URL` to `https://topostory.com`
3. **Stripe**: Update webhook URL back to `https://topostory.com/api/webhooks`
4. **Clerk**: Remove `app.topostory.com` from allowed domains
