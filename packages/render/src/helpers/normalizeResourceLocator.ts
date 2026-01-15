/**
 * This function normalize relative and protocol-relative URLs to absolute
 * URLs as per {@link https://tools.ietf.org/html/rfc1808 | RFC1808}.
 *
 * @param url - The URL to normalize.
 * @param baseUrl - The base URL to resolve relative and protocol-relative URLs.
 */
export default function normalizeResourceLocator(
  url: string,
  baseUrl?: string
) {
  try {
    if (!baseUrl) {
      // Try to parse as absolute URL
      return new URL(url).href;
    }
    // Resolve relative URL against base URL
    return new URL(url, baseUrl).href;
  } catch {
    // If URL parsing fails, return original URL
    return url;
  }
}
