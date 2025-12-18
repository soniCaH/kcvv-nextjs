# Security Policy

## Image Security

### SVG Handling

**Current Status (2025-01-05):**
- `dangerouslyAllowSVG: true` is enabled in `next.config.ts`
- **Current Risk: LOW** - No user-uploaded SVGs are accepted
- Drupal CMS serves common image formats (JPEG, PNG, GIF, WebP)
- Local SVG files (`public/images/footer-top.svg`) are controlled by developers

**Security Measures:**
1. ✅ `contentDispositionType: 'attachment'` - Forces download instead of inline display
2. ✅ Limited to specific remote patterns (placehold.co, api.kcvvelewijt.be, CloudFront)
3. ✅ Runtime MIME type validation - Schema enforces image MIME types (JPEG/PNG/GIF/WebP only, no SVG)
4. ✅ Automated test coverage - Tests verify PDF/SVG files are rejected at schema level
5. ⚠️ Drupal server-side validation - Relies on Drupal's file upload validation (see below)

### File Upload Security - Defense in Depth

**⚠️ CRITICAL: MIME Type Validation Alone is INSUFFICIENT!**

Our file validation uses a **defense-in-depth approach** with multiple security layers. MIME types can be easily spoofed by attackers, so we implement validation at multiple levels:

#### Layer 1: Schema Validation (Frontend/Runtime)
- **Location:** `src/lib/effect/schemas/file.schema.ts`
- **Purpose:** Type safety and basic MIME type filtering
- **Validates:** Accepts only `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- **⚠️ Limitation:** This is NOT a security control - it's defense-in-depth and type safety

#### Layer 2: Drupal Server-Side Validation (PRIMARY SECURITY CONTROL)
Drupal MUST perform comprehensive validation on all file uploads:

1. **Magic Byte Validation** (File Signature Check)
   ```php
   // Verify file content matches MIME type using magic bytes
   // JPEG: FF D8 FF
   // PNG: 89 50 4E 47 0D 0A 1A 0A
   // GIF: 47 49 46 38 (GIF8)
   // WebP: 52 49 46 46 ... 57 45 42 50 (RIFF...WEBP)
   ```

2. **File Extension Validation**
   - Cross-check file extension with MIME type and magic bytes
   - Reject files where extension, MIME type, and magic bytes don't align

3. **Content Validation**
   - Use GD Library or ImageMagick to attempt to decode the file
   - Reject malformed or malicious files that can't be processed

4. **Drupal Configuration Checklist**
   - [ ] Configure allowed file extensions in file field settings
   - [ ] Enable file validation modules (e.g., `file_entity`, `media`)
   - [ ] Set maximum file size limits
   - [ ] Configure GD/ImageMagick for image processing
   - [ ] Enable file scanning for malware if handling user uploads

**Drupal Configuration Example:**
```php
// In field configuration or settings.php
$config['field.field.node.article.field_media_image']['settings']['file_extensions'] = 'jpg jpeg png gif webp';
$config['field.field.node.article.field_media_image']['settings']['max_filesize'] = '5 MB';
```

#### Layer 3: Next.js Image Optimization
- **Location:** `next.config.ts` `remotePatterns`
- **Purpose:** Restrict which domains can serve images
- **Current allowed domains:** placehold.co, api.kcvvelewijt.be, CloudFront
- Any image from unapproved domains will be rejected

#### Testing File Validation
```bash
# Run schema validation tests
npm test file.schema.test.ts

# Manually test Drupal upload validation:
# 1. Rename a .txt file to .jpg
# 2. Try uploading to Drupal
# 3. Should be rejected by magic byte validation
```

---

**⚠️ IMPORTANT - Before Adding User-Uploaded SVGs:**

If you plan to allow users to upload SVG files in the future, you **MUST** implement these additional security measures:

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
