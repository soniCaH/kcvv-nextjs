/**
 * Staging counterpart to `apps/studio/migrations/normalize-article-tag-casing/`.
 *
 * See that file for the full contract — both migrations share the same
 * source in `@kcvv/sanity-studio/migrations`.
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
