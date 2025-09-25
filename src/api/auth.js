const BASE_CANDIDATES = [
  "https://localhost:7200/api/auth",
  "http://localhost:5200/api/auth"
];

async function fetchWithFallback(path = "", options = {}) {
  let lastError = null;
  for (const base of BASE_CANDIDATES) {
    try {
      const res = await fetch(`${base}${path}`, options);
      return { res, base };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("Unable to reach API.");
}

export const loginUser = async ({ email, password }) => {
  const { res } = await fetchWithFallback("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Login failed (${res.status}): ${text}`);
  }

  return await res.json();
};
