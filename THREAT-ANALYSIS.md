# TopoStory Marketing Site - Pre-Launch Threat Analysis

**Date:** January 2026
**Scope:** www.topostory.com (Marketing Site)
**Related:** app.topostory.com (Main Application - separate repo)

---

## Executive Summary

This threat analysis covers the TopoStory marketing site before launch. The site is a **static Astro-generated website** hosted on Vercel with integrations to PostHog (analytics), Intercom (support chat), and cross-subdomain cookie sharing with the main application.

**Overall Risk Level: LOW-MEDIUM**

The marketing site itself has a minimal attack surface due to its static nature. However, there are several areas requiring attention around third-party integrations, cost controls, and configuration security.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Security Vulnerabilities](#2-security-vulnerabilities)
3. [Abuse Vectors](#3-abuse-vectors)
4. [Cost & Overspend Risks](#4-cost--overspend-risks)
5. [Privacy & Compliance Risks](#5-privacy--compliance-risks)
6. [Infrastructure Risks](#6-infrastructure-risks)
7. [Third-Party Dependency Risks](#7-third-party-dependency-risks)
8. [Business Logic Risks](#8-business-logic-risks)
9. [Recommendations Summary](#9-recommendations-summary)
10. [Pre-Launch Checklist](#10-pre-launch-checklist)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ www.topostory   │  │  Rewrites/Proxy │  │   SSL/CDN       │  │
│  │     .com        │  │  /__clerk/*     │  │                 │  │
│  │                 │  │  /t/*           │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ PostHog  │    │ Intercom │    │  Clerk   │
    │ (EU)     │    │          │    │ (proxy)  │
    └──────────┘    └──────────┘    └──────────┘
```

**Key Characteristics:**
- Static HTML/CSS/JS (no server-side processing)
- No database or backend APIs
- Cookie-based consent management
- Cross-subdomain cookie sharing with app.topostory.com

---

## 2. Security Vulnerabilities

### 2.1 Cross-Site Scripting (XSS) - LOW RISK

**Status:** ✅ Low Risk

**Analysis:**
- Static Astro site with no user input forms
- No dynamic content rendering from URL parameters
- All content is pre-compiled at build time

**Potential Concerns:**
- PostHog and Intercom inject third-party scripts
- If either service is compromised, malicious scripts could execute

**Mitigation:**
- Consider adding Content Security Policy (CSP) headers via Vercel config
- Monitor third-party script integrity

### 2.2 Cookie Security - MEDIUM RISK

**Current Implementation:**
```javascript
document.cookie = `${COOKIE_NAME}=${value}${domainPart}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
```

**Findings:**
| Attribute | Status | Notes |
|-----------|--------|-------|
| Secure | ✅ Set | Only sent over HTTPS |
| SameSite | ✅ Lax | Protects against CSRF |
| HttpOnly | ❌ Missing | Cookie readable by JavaScript |
| Domain | ⚠️ `.topostory.com` | Shared across all subdomains |

**Risks:**
1. **Cookie tampering**: Since `HttpOnly` is not set, any XSS on any subdomain could read/modify consent state
2. **Subdomain takeover**: If any `*.topostory.com` subdomain is compromised, attacker gains cookie access
3. **Cookie injection**: Malicious subdomains could set cookies that override legitimate ones

**Recommendations:**
- Audit all subdomains regularly for abandoned/vulnerable services
- Consider using a separate cookie domain for sensitive data
- Document which subdomains are authorized

### 2.3 Open Redirect - NOT APPLICABLE

**Status:** ✅ Not Vulnerable

All links are hardcoded to `https://app.topostory.com` - no URL parameters are used for redirects.

### 2.4 Clickjacking - LOW RISK

**Status:** ⚠️ No Protection

The site does not set `X-Frame-Options` or `frame-ancestors` CSP directive. The marketing site could be embedded in malicious iframes.

**Impact:** Low - no sensitive actions on marketing site
**Recommendation:** Add `X-Frame-Options: DENY` via Vercel headers

### 2.5 Information Disclosure - LOW RISK

**Exposed Information:**
- Astro generator meta tag reveals framework version
- PostHog key is public (by design, but visible in source)
- Intercom App ID is public

**Recommendation:** These are acceptable for a marketing site, but ensure no internal/staging URLs are exposed.

---

## 3. Abuse Vectors

### 3.1 Bot Traffic & Scraping - MEDIUM RISK

**Threat:** Automated bots scraping content or inflating analytics

**Impact:**
- Inflated PostHog event counts (cost implications)
- Inaccurate analytics data
- Potential bandwidth costs

**Current Mitigations:** None

**Recommendations:**
- Enable Vercel's bot protection (Speed Insights includes bot filtering)
- Consider rate limiting via Vercel Edge Middleware for `/t/*` proxy
- Add `robots.txt` to control crawler access

### 3.2 Analytics Spam - MEDIUM RISK

**Threat:** Malicious actors sending fake events to PostHog

**How it works:**
```javascript
// Anyone can call this from browser console
posthog.capture('fake_event', { fake: 'data' });
```

**Impact:**
- Polluted analytics data
- Wasted PostHog event quota
- Misleading business decisions

**Recommendations:**
- Use PostHog's built-in bot detection
- Set up anomaly alerts for unusual event volumes
- Consider PostHog's property filters to identify/exclude spam

### 3.3 Intercom Abuse - MEDIUM RISK

**Threat:** Spammers using support chat for malicious purposes

**Attack Scenarios:**
1. **Spam messages**: Flooding support with junk
2. **Phishing attempts**: Sending malicious links via chat
3. **Social engineering**: Impersonating users to extract information

**Current Mitigations:**
- Intercom only loads with marketing consent

**Recommendations:**
- Enable Intercom's spam filtering
- Set up conversation rules to detect abuse patterns
- Consider requiring email verification before support
- Train support staff on social engineering tactics

### 3.4 Denial of Service (DoS) - LOW RISK

**Status:** ✅ Well Protected

Vercel provides:
- Global CDN with automatic DDoS protection
- Edge caching for static assets
- Rate limiting at edge

**Residual Risk:** Targeted application-layer attacks could still cause issues with PostHog/Intercom quotas.

---

## 4. Cost & Overspend Risks

### 4.1 PostHog Costs - HIGH RISK

**Pricing Model:** Event-based billing

**Current Events Tracked:**
| Event | Trigger | Volume Estimate |
|-------|---------|-----------------|
| `$pageview` | Every page load | High |
| `$pageleave` | Every page exit | High |
| `cta_clicked` | CTA button clicks | Medium |
| `style_preview_clicked` | Style card clicks | Low |
| `pricing_plan_viewed` | Scroll to pricing | Medium |

**Risk Scenarios:**

1. **Traffic Spike**
   - Viral content/media coverage could 10-100x traffic
   - Each visitor = 2+ events minimum (pageview + pageleave)
   - Cost impact: Significant

2. **Bot Traffic**
   - Scrapers/bots trigger pageview events
   - No current bot filtering
   - Cost impact: Moderate to High

3. **Replay Recording** (if enabled)
   - Session replay costs significantly more than events
   - Ensure this is disabled or capped

**Recommendations:**
- Set up PostHog billing alerts at 50%, 75%, 90% of quota
- Configure hard spending cap
- Enable bot detection filtering
- Consider sampling for high-volume events
- Use PostHog's "capture: false" for known bot user agents

### 4.2 Intercom Costs - MEDIUM RISK

**Pricing Model:** Per-seat + active contacts

**Risks:**
1. **Contact Accumulation**: Every chat user becomes a contact
2. **Anonymous Contacts**: Marketing site visitors are anonymous (cheaper)
3. **Support Volume**: Viral traffic could overwhelm support capacity

**Recommendations:**
- Monitor active contacts monthly
- Set up auto-archive for inactive conversations
- Consider business hours only for chat availability

### 4.3 Vercel Costs - LOW RISK

**Current Tier:** Likely Pro or Hobby

**Potential Overages:**
| Resource | Limit | Risk |
|----------|-------|------|
| Bandwidth | 1TB/month (Pro) | Low for static site |
| Function Invocations | N/A (static) | None |
| Edge Requests | 10M/month | Low |

**Recommendation:** Enable Vercel spending notifications

### 4.4 Aggregate Cost Risk Assessment

| Service | Monthly Estimate | Spike Risk | Max Potential |
|---------|------------------|------------|---------------|
| PostHog | $0-50 | HIGH | $500+ |
| Intercom | $0-79 | MEDIUM | $200+ |
| Vercel | $0-20 | LOW | $50 |
| **Total** | **$0-149** | - | **$750+** |

---

## 5. Privacy & Compliance Risks

### 5.1 GDPR Compliance - GENERALLY COMPLIANT

**Positive Findings:**
- ✅ Cookie consent banner implemented
- ✅ Granular consent categories (analytics/marketing)
- ✅ "Reject All" option prominently displayed
- ✅ Consent stored with timestamp and version
- ✅ Privacy policy page exists
- ✅ PostHog uses EU region (eu.i.posthog.com)

**Gaps Identified:**

1. **Pre-consent Tracking**
   - Scripts wait for consent before loading ✅
   - No tracking occurs before consent ✅

2. **Consent Withdrawal**
   - Cookie settings accessible via footer ✅
   - However: PostHog/Intercom data already sent cannot be deleted from marketing site

3. **Data Subject Requests**
   - No automated data export mechanism
   - Manual process via `privacy@topostory.com`

4. **Cookie Policy**
   - Privacy page mentions cookies but lacks detailed cookie inventory
   - Consider adding specific cookie names, durations, purposes

### 5.2 Cross-Subdomain Data Sharing

**Configuration:**
```javascript
cookie_domain: '.topostory.com',
cross_subdomain_cookie: true
```

**Implications:**
- User identified across www and app subdomains
- PostHog can correlate pre-signup and post-signup behavior
- **Must be disclosed in privacy policy** (partially covered)

**Recommendation:** Explicitly mention cross-subdomain tracking in privacy policy

### 5.3 Third-Party Data Transfers

| Service | Data Location | Transfer Mechanism |
|---------|--------------|-------------------|
| PostHog | EU (Frankfurt) | First-party proxy |
| Intercom | US | Direct connection |
| Vercel | Global | CDN edge nodes |

**Risk:** Intercom data goes to US servers
**Mitigation:** Consent required before Intercom loads

### 5.4 Children's Privacy (COPPA)

**Status:** ✅ Addressed

Privacy policy states service not intended for children under 16.

---

## 6. Infrastructure Risks

### 6.1 DNS & Domain Security - MEDIUM RISK

**Current Setup:**
- Production: `www.topostory.com`
- Redirect: `topostory.com` → `www.topostory.com`
- App: `app.topostory.com`

**Risks:**

1. **Subdomain Takeover**
   - Any abandoned subdomain pointing to decommissioned services
   - Attacker could claim the subdomain and steal cookies

2. **DNS Hijacking**
   - If DNS provider compromised, all traffic could be redirected

**Recommendations:**
- Enable DNSSEC if supported by registrar
- Audit DNS records regularly
- Remove unused subdomain records
- Use registrar lock to prevent unauthorized transfers

### 6.2 Vercel Rewrite Security - MEDIUM RISK

**Current Rewrites:**
```json
{
  "source": "/__clerk/:path*",
  "destination": "https://clerk.topostory.com/:path*"
},
{
  "source": "/t/:path*",
  "destination": "https://eu.i.posthog.com/:path*"
}
```

**Risks:**

1. **Open Proxy Abuse**
   - The `/t/*` proxy forwards requests to PostHog
   - Could potentially be abused to proxy other requests if misconfigured
   - **Current config is safe** - destination is hardcoded

2. **Clerk Proxy**
   - `/__clerk/*` proxies authentication requests
   - Marketing site shouldn't need this - inherited from app setup?

**Recommendation:**
- Remove `/__clerk/*` rewrite if not needed on marketing site
- Document why each rewrite exists

### 6.3 SSL/TLS Configuration - LOW RISK

**Status:** ✅ Handled by Vercel

- Automatic certificate provisioning and renewal
- HTTPS enforced by default
- TLS 1.2+ supported

### 6.4 Build Pipeline Security - LOW RISK

**Current Setup:**
- GitHub → Vercel auto-deploy
- No custom build scripts with secrets
- No `.env` files in repository

**Recommendations:**
- Enable branch protection on main
- Require PR reviews before merge
- Audit Vercel environment variables access

---

## 7. Third-Party Dependency Risks

### 7.1 NPM Dependencies - LOW RISK

**Production Dependencies:**
```json
{
  "@astrojs/tailwind": "^5.1.4",
  "@astrojs/vercel": "^8.0.4",
  "astro": "^5.1.6",
  "tailwindcss": "^3.4.17"
}
```

**Analysis:**
- Small dependency footprint (good)
- All packages from reputable maintainers
- Using caret ranges (^) - will get minor updates automatically

**Recommendations:**
- Run `npm audit` before launch
- Consider using `package-lock.json` for deterministic builds
- Set up Dependabot or similar for security updates

### 7.2 Client-Side Script Injection - MEDIUM RISK

**Third-Party Scripts Loaded:**

| Script | Source | Loaded When |
|--------|--------|-------------|
| PostHog | `/t/static/array.js` (proxied) | Analytics consent |
| Intercom | `widget.intercom.io/widget/` | Marketing consent |

**Risks:**
1. **Supply Chain Attack**: If PostHog or Intercom is compromised
2. **Script Modification**: CDN compromise could inject malware

**Mitigations:**
- PostHog is proxied through first-party domain (some protection)
- Intercom loaded directly from their CDN

**Recommendations:**
- Consider Subresource Integrity (SRI) if PostHog/Intercom support it
- Monitor for unusual script behavior
- Have an incident response plan for third-party compromise

### 7.3 PostHog Proxy Security

**Current Implementation:**
```json
{
  "source": "/t/:path*",
  "destination": "https://eu.i.posthog.com/:path*"
}
```

**Purpose:** Bypass Safari's Intelligent Tracking Prevention (ITP)

**Security Considerations:**
- Proxied requests appear to come from your domain
- This is a legitimate use case for analytics
- No sensitive data exposed through proxy

---

## 8. Business Logic Risks

### 8.1 Free Tier Abuse (Main App) - INFO ONLY

**Not applicable to marketing site**, but noted for awareness:

The main app offers "3 exports per month" on free tier. Potential abuse:
- Multiple account creation to bypass limits
- Automated export to steal all maps

**This should be addressed in main app threat analysis.**

### 8.2 Pricing Page Manipulation - LOW RISK

**Status:** ✅ Not Vulnerable

Prices are hardcoded in the static build:
```javascript
{ name: 'Pro', price: '3.50', ... }
```

No client-side price modification possible. Actual billing handled by Stripe in main app.

### 8.3 CTA Link Manipulation - LOW RISK

All links point to `https://app.topostory.com` - hardcoded and safe.

---

## 9. Recommendations Summary

### Critical (Do Before Launch)

| # | Issue | Action | Effort |
|---|-------|--------|--------|
| 1 | PostHog cost controls | Set up billing alerts and spending cap | 30 min |
| 2 | Bot protection | Enable Vercel bot protection | 15 min |
| 3 | npm audit | Run and fix any vulnerabilities | 30 min |

### High Priority (Within First Week)

| # | Issue | Action | Effort |
|---|-------|--------|--------|
| 4 | Security headers | Add CSP, X-Frame-Options via vercel.json | 1 hour |
| 5 | Remove unused rewrite | Remove `/__clerk/*` if not needed | 15 min |
| 6 | Intercom abuse prevention | Configure spam filtering | 30 min |
| 7 | DNS audit | Review all subdomain records | 1 hour |

### Medium Priority (Within First Month)

| # | Issue | Action | Effort |
|---|-------|--------|--------|
| 8 | Cookie policy | Add detailed cookie inventory | 2 hours |
| 9 | Monitoring | Set up uptime monitoring | 1 hour |
| 10 | Incident response | Document response plan for third-party compromise | 2 hours |

### Low Priority (Ongoing)

| # | Issue | Action | Effort |
|---|-------|--------|--------|
| 11 | Dependency updates | Enable Dependabot | 30 min |
| 12 | Regular audits | Schedule quarterly security review | Recurring |

---

## 10. Pre-Launch Checklist

### Security
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Add security headers to vercel.json
- [ ] Verify HTTPS redirects work
- [ ] Review and remove unnecessary Vercel rewrites
- [ ] Audit DNS records for unused subdomains

### Cost Controls
- [ ] Set PostHog billing alerts (50%, 75%, 90%)
- [ ] Configure PostHog spending cap
- [ ] Enable PostHog bot detection
- [ ] Set Vercel spending notifications
- [ ] Review Intercom pricing tier

### Privacy & Compliance
- [ ] Verify cookie consent works in all browsers
- [ ] Test "Reject All" truly blocks tracking
- [ ] Review privacy policy for accuracy
- [ ] Confirm PostHog EU region is active
- [ ] Document data processing activities

### Monitoring
- [ ] Set up uptime monitoring (e.g., Better Uptime, Vercel)
- [ ] Configure PostHog anomaly alerts
- [ ] Enable Vercel deployment notifications
- [ ] Set up error tracking (optional)

### Documentation
- [ ] Document all environment variables
- [ ] Document Vercel rewrite purposes
- [ ] Create incident response runbook
- [ ] Document third-party dependencies and their purposes

---

## Appendix A: Security Headers Recommendation

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

**Note:** Content-Security-Policy is complex with PostHog/Intercom and may require testing.

---

## Appendix B: PostHog Billing Alert Setup

1. Go to PostHog → Organization Settings → Billing
2. Set alert thresholds:
   - 50% of monthly limit: Email notification
   - 75% of monthly limit: Email + Slack notification
   - 90% of monthly limit: Email + Slack + consider pausing
3. Configure hard spending cap if available

---

## Appendix C: Threat Model Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              THREAT ACTORS                                  │
├─────────────────┬────────────────┬─────────────────┬──────────────────────┤
│   Competitors   │    Scrapers    │    Spammers     │   Script Kiddies     │
└────────┬────────┴───────┬────────┴────────┬────────┴──────────┬───────────┘
         │                │                 │                   │
         ▼                ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ATTACK VECTORS                                    │
├─────────────────┬────────────────┬─────────────────┬───────────────────────┤
│ Content Scraping│ Bot Traffic    │ Intercom Spam   │ Analytics Injection   │
│ Price Intel     │ Inflate Stats  │ Support Abuse   │ Data Pollution        │
└─────────────────┴────────────────┴─────────────────┴───────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ASSETS AT RISK                                  │
├─────────────────┬────────────────┬─────────────────┬───────────────────────┤
│ Brand/Reputation│ Service Costs  │ Analytics Data  │ User Trust/Privacy    │
└─────────────────┴────────────────┴─────────────────┴───────────────────────┘
```

---

**Document Maintained By:** Security Review
**Next Review Date:** Q2 2026
