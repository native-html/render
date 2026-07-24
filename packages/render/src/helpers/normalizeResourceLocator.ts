/**
 * Matches a URL that already carries a scheme, e.g. `https://`, `ftp://`.
 * Protocol-relative URLs (`//host/path`) are intentionally excluded so they
 * still get resolved against the base URL.
 */
const ABSOLUTE_URL_REGEX = /^[a-z][a-z0-9+.-]*:\/\//i;

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
    // If the URL is already absolute, return it untouched. We deliberately
    // avoid round-tripping through the URL constructor here because React
    // Native's URL polyfill appends a trailing slash to a path-bearing URL
    // (e.g. `https://example.com/file.pdf` -> `https://example.com/file.pdf/`),
    // corrupting otherwise-valid links. See issue #47.
    if (ABSOLUTE_URL_REGEX.test(url)) {
      return url;
    }
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
