# Incident Response Runbook

**Version:** 1.0
**Last Updated:** January 2026
**Scope:** www.topostory.com (Marketing Site)

---

## Quick Reference

| Scenario | Severity | Response Time |
|----------|----------|---------------|
| Third-party script compromise | Critical | Immediate |
| Cost overspend alert | High | Within 1 hour |
| Analytics spam/pollution | Medium | Within 24 hours |
| Support chat abuse | Low | Within 48 hours |

---

## 1. Third-Party Script Compromise

### Indicators
- Unexpected JavaScript errors in browser console
- Reports of malicious behavior from users
- Security researcher disclosure
- Vendor security advisory (PostHog, Intercom)

### Immediate Actions

1. **Disable the compromised service** (within minutes)
   ```javascript
   // For PostHog - update consent to block analytics
   // Redeploy with PostHog initialization removed
   ```

2. **Deploy emergency update**
   ```bash
   # Comment out affected script in src/layouts/BaseLayout.astro
   git commit -am "emergency: disable [service] due to security incident"
   git push origin main
   # Vercel will auto-deploy
   ```

3. **Notify stakeholders**
   - Engineering team
   - Security team (if applicable)
   - Legal/compliance (if user data affected)

### Recovery Steps

1. Wait for vendor to confirm fix
2. Review vendor's post-incident report
3. Re-enable service in staging first
4. Monitor for 24 hours before production re-enable
5. Document incident in post-mortem

---

## 2. Cost Overspend (PostHog/Vercel)

### Indicators
- Billing alert email (50%, 75%, 90% thresholds)
- Unusual traffic patterns in analytics
- Vercel dashboard showing spike

### Immediate Actions

1. **Identify source of traffic spike**
   - Check PostHog for unusual event patterns
   - Check Vercel Analytics for traffic source
   - Look for bot signatures (unusual user agents, geographic patterns)

2. **If bot traffic detected**
   - Enable stricter bot filtering in PostHog
   - Consider temporary rate limiting via Vercel Edge Middleware

3. **If legitimate traffic spike**
   - Monitor but don't restrict
   - Increase spending cap if needed
   - Notify finance/leadership of expected overage

### Prevention

- Ensure PostHog bot detection is enabled
- Set conservative spending caps
- Review costs weekly during high-traffic periods

---

## 3. Analytics Spam/Data Pollution

### Indicators
- Unusual event names in PostHog
- Spike in events from single IP/region
- Events with suspicious property values

### Response Steps

1. **Identify polluted data**
   ```
   PostHog → Activity → Filter by unusual patterns
   ```

2. **Create exclusion filters**
   - Filter by IP range
   - Filter by user agent
   - Filter by event properties

3. **Document for cleanup**
   - Note affected date range
   - List exclusion criteria applied
   - Consider data deletion if severe

---

## 4. Intercom/Support Chat Abuse

### Indicators
- High volume of spam messages
- Phishing attempts via chat
- Abusive language from visitors

### Response Steps

1. **Enable Intercom spam filtering**
   - Intercom → Settings → Spam Protection

2. **Block repeat offenders**
   - Use Intercom's block feature for abusive users

3. **Adjust availability if overwhelmed**
   - Temporarily limit chat to business hours
   - Enable email-only mode

---

## 5. Subdomain Takeover Attempt

### Indicators
- DNS record pointing to decommissioned service
- Report of suspicious content on subdomain
- Certificate transparency log alerts

### Response Steps

1. **Verify the subdomain status**
   ```bash
   dig subdomain.topostory.com
   ```

2. **Remove orphaned DNS records**
   - Access DNS provider
   - Delete CNAME/A records for unused subdomains

3. **Audit all subdomains**
   - Document active subdomains and their purposes
   - Set calendar reminder for quarterly review

---

## Contact Information

| Role | Contact |
|------|---------|
| Engineering Lead | [Add contact] |
| Security Contact | [Add contact] |
| Vercel Support | https://vercel.com/support |
| PostHog Support | https://posthog.com/support |
| Intercom Support | https://intercom.com/help |

---

## Post-Incident Template

```markdown
## Incident Report: [Title]

**Date:** YYYY-MM-DD
**Duration:** X hours
**Severity:** Critical/High/Medium/Low

### Summary
Brief description of what happened.

### Timeline
- HH:MM - First indicator noticed
- HH:MM - Response initiated
- HH:MM - Issue resolved

### Root Cause
What caused the incident.

### Impact
- Users affected: X
- Data affected: Y
- Cost impact: $Z

### Action Items
- [ ] Short-term fix
- [ ] Long-term prevention
- [ ] Process improvements
```

---

**Document Maintained By:** Engineering Team
**Review Schedule:** Quarterly
