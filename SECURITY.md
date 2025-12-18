# Security Policy

## Image Security

### SVG Handling

**Current Status (2025-01-05):**
- `dangerouslyAllowSVG: true` is enabled in `next.config.ts`
- **Current Risk: LOW** - No user-uploaded SVGs are accepted
- Drupal CMS only serves JPEG and PNG files (verified via API)
- Local SVG files (`public/images/footer-top.svg`) are controlled by developers

**Security Measures:**
1. ✅ `contentDispositionType: 'attachment'` - Forces download instead of inline display
2. ✅ Limited to specific remote patterns (placehold.co, api.kcvvelewijt.be, CloudFront)
3. ✅ Runtime MIME type validation - Schema enforces only `image/jpeg` and `image/png`
4. ✅ Automated test coverage - Tests verify PDF/SVG files are rejected

**⚠️ IMPORTANT - Before Adding User-Uploaded SVGs:**

If you plan to allow users to upload SVG files in the future, you **MUST** implement these security measures:

#### 1. Server-Side SVG Sanitization
```typescript
// Install: npm install isomorphic-dompurify
import DOMPurify from 'isomorphic-dompurify'

function sanitizeSVG(svgContent: string): string {
  return DOMPurify.sanitize(svgContent, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use'], // Only if needed
    FORBID_TAGS: ['script', 'foreignObject', 'iframe', 'embed', 'object'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  })
}
```

#### 2. Upload Validation
- Validate MIME type: Only accept `image/svg+xml`
- Check file extension: Only `.svg`
- Scan for dangerous patterns:
  - `<script>` tags
  - `javascript:` URLs
  - Event handlers (`onclick`, `onload`, etc.)
  - `<foreignObject>` tags
  - External references

#### 3. Content Security Policy (CSP)
Add to `next.config.ts` with nonce-based CSP (recommended for Next.js App Router):

```typescript
// Use middleware to generate nonces per request
// See: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy

headers: async () => [{
  source: '/(.*)',
  headers: [{
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "script-src 'self' 'nonce-{NONCE}'",  // Replace {NONCE} with per-request value
      "style-src 'self' 'nonce-{NONCE}'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'"
    ].join('; ')
  }]
}]
```

**Note:** Avoid using `'unsafe-inline'` or `'unsafe-eval'` as they significantly weaken XSS protection.

#### 4. Alternative: Convert SVGs to Raster
```bash
# Install sharp for server-side image conversion
npm install sharp

# Convert SVG to PNG/WebP on upload
const sharp = require('sharp');
await sharp(svgBuffer)
  .png()
  .toFile('output.png');
```

## Reporting Security Issues

If you discover a security vulnerability, please email: kevin@kcvvelewijt.be

**Do NOT create a public GitHub issue for security vulnerabilities.**

## Security Checklist for Developers

### Before Deploying Changes
- [ ] No user-uploaded SVGs without sanitization
- [ ] All remote image domains are explicitly listed in `remotePatterns`
- [ ] No inline `data:` URIs from untrusted sources
- [ ] CSP headers configured if serving user content
- [ ] Dependencies updated (`npm audit`)

### Regular Security Maintenance
- [ ] Monthly: Run `npm audit` and update vulnerable dependencies
- [ ] Quarterly: Review Drupal file upload permissions and MIME types
- [ ] Quarterly: Verify no SVG uploads in production Drupal
- [ ] Annually: Security audit of image handling pipeline

## Dependencies with Security Implications

| Package | Purpose | Security Notes |
|---------|---------|----------------|
| `next/image` | Image optimization | Trusted - Official Next.js package |
| `effect` | Data validation | Schema validation prevents malformed data |
| None yet | SVG Sanitization | **Required if user SVG uploads are added** |

## Last Security Review
- **Date:** 2025-01-05
- **Reviewer:** Claude Code (via AI Code Review)
- **Status:** ✅ Safe - No user-uploaded SVGs
- **Next Review:** 2025-04-05 (or when adding SVG upload feature)
