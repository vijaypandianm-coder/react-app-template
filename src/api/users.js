const BASE_CANDIDATES = [
  "https://localhost:7200/api/users",
  "http://localhost:5200/api/users"
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

export const fetchUsers = async () => {
  const { res } = await fetchWithFallback("", { method: "GET" });
  if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
  return await res.json();
};

export const addUser = async (user) => {
  const { res } = await fetchWithFallback("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error(`Add failed (${res.status})`);
  return await res.json();
};

export const deleteUser = async (id) => {
  if (!id && id !== 0) throw new Error("id required");
  const { res } = await fetchWithFallback(`/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Delete failed (${res.status})`);
  return true;
};
