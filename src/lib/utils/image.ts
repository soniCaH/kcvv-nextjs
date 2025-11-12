/**
 * Construct Drupal image URL from relative path
 * @param uri - Image URI (can be relative or absolute)
 */
export const getDrupalImageUrl = (uri: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_API_URL || process.env.DRUPAL_API_URL || 'https://api.kcvvelewijt.be'

  // If already absolute URL, return as-is
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri
  }

  // If starts with slash, append to base URL
  if (uri.startsWith('/')) {
    return `${baseUrl}${uri}`
  }

  // Otherwise, append with slash
  return `${baseUrl}/${uri}`
}

/**
 * Get image dimensions with fallback defaults
 * @param width - Image width
 * @param height - Image height
 */
export const getImageDimensions = (width?: number, height?: number) => {
  return {
    width: width || 1200,
    height: height || 800,
  }
}

/**
 * Calculate aspect ratio from width and height
 */
export const calculateAspectRatio = (width: number, height: number): number => {
  return width / height
}
