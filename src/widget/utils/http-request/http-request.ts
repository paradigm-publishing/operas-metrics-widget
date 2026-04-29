import { createCache, getCache, isCached, resolveCache } from './utils';

interface HTTPRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  noCache?: boolean;
}

/**
 * Utility function to make HTTP requests
 */
export const HTTPRequest = async <T>(
  options: HTTPRequestOptions
): Promise<T> => {
  const { method, url, noCache } = options;
  const shouldCache = noCache !== true;

  try {
    // Check the cache for the data
    if (shouldCache && isCached(url)) {
      return getCache<T>(url);
    }

    // Create a new cache entry for this request
    if (shouldCache) {
      createCache(url);
    }

    // Make the request. fetch() doesn't throw on 4xx/5xx — only on
    // network errors — so we have to check `ok` ourselves to keep the
    // throw-on-failure contract this function had under axios.
    const response = await fetch(url, { method });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    const data = (await response.json()) as T;

    // Update the cache
    if (shouldCache) {
      resolveCache<T>(url, data);
    }

    // Return the data
    return data;
  } catch {
    // We must resolve the cache, to allow functions waiting for the data to continue
    if (shouldCache) {
      resolveCache<T>(url, { data: [] } as T);
    }

    // Return a rejected promise
    throw new Error('HTTP request failed');
  }
};
