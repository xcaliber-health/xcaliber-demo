import { fhirFetch } from "./fhir";
import { cache } from "./cache";

/**
 * cachedFhirFetch wraps fhirFetch with an in-memory cache.
 * Supports optional TTL and force refresh.
 *
 * @param {string} path - API endpoint path
 * @param {object} options - fetch options (method, headers, body, setLatestCurl, etc.)
 * @param {number} ttl - cache time-to-live in ms (default 5 minutes)
 * @param {boolean} forceRefresh - if true, ignores cache and fetches fresh data
 * @returns {Promise<any>}
 */
export async function cachedFhirFetch(path, options = {}, ttl =  24 * 60 * 60 * 1000 , forceRefresh = false) {
  const { method = "GET", body, headers = {} } = options;

  // Only cache GET requests
  if (method.toUpperCase() !== "GET") {
    return fhirFetch(path, options);
  }

  // Create a unique cache key
  const cacheKey = `${method}:${path}:${JSON.stringify(headers)}:${JSON.stringify(body)}`;

  // Return cached data if available and not forcing refresh
  if (!forceRefresh) {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("⚡ fhirFetch cache hit:", path);
      return cachedData;
    }
  } else {
    console.log("Force refresh enabled, bypassing cache:", path);
  }

  // Otherwise fetch and cache
  const data = await fhirFetch(path, options);
  cache.set(cacheKey, data, ttl);
  return data;
}
