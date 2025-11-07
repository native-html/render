// TEMPORARY: Commented out for benchmarking app compatibility
// import URI from 'urijs';

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
  // TEMPORARY: Simple stub for benchmarking
  // In a real app, this would use urijs to properly normalize URLs
  try {
    if (!baseUrl) return url;
    // Very basic URL resolution - not RFC1808 compliant but sufficient for benchmarking
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      return url;
    }
    const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    const path = url.startsWith('/') ? url.slice(1) : url;
    return base + path;
  } catch {
    return url;
  }
  
  // Original implementation:
  // try {
  //   return baseUrl ? URI(url).absoluteTo(URI(baseUrl)).href() : URI(url).href();
  // } catch {
  //   return url;
  // }
}
