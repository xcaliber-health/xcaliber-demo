export const cache = {
  get: (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    try {
      const { data, expiry } = JSON.parse(cached);
      if (expiry && Date.now() > expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },
  set: (key, data, ttl = 5 * 60 * 1000) => { // default TTL 5 min
    localStorage.setItem(
      key,
      JSON.stringify({ data, expiry: ttl ? Date.now() + ttl : null })
    );
  },
  clear: (key) => localStorage.removeItem(key),
  clearAll: () => localStorage.clear(),
};
