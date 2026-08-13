/**
 * Collapse case-variant article tags onto one canonical spelling.
 *
 * Production held `A-Ploeg` (76 articles) alongside `A-ploeg` (1). GROQ `in` is
 * case-sensitive, so that one article was invisible to every correctly-cased
 * filter. See `@kcvv/sanity-studio/migrations` for the full contract.
 *
 * Dry-run first:
 *   npx sanity@latest migration run normalize-article-tag-casing --project vhb33jaz --dataset staging --dry-run
 *
 * Apply:
 *   npx sanity@latest migration run normalize-article-tag-casing --project vhb33jaz --dataset staging
 *   npx sanity@latest migration run normalize-article-tag-casing --project vhb33jaz --dataset production
 */
import {normalizeArticleTagCasingMigration} from '@kcvv/sanity-studio/migrations'

export default normalizeArticleTagCasingMigration
