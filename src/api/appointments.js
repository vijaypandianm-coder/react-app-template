const BASE_CANDIDATES = [
  "https://localhost:7200/api/appointments",
  "http://localhost:5200/api/appointments"
];

let authToken = null;
export const setAuthToken = (token) => authToken = token;

async function fetchWithFallback(path = "", options = {}) {
  options.headers = {
    ...(options.headers || {}),
    Authorization: authToken ? `Bearer ${authToken}` : "",
    "Content-Type": "application/json"
  };

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

export const fetchAppointments = async () => {
  const { res, base } = await fetchWithFallback("", { method: "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed (${res.status}) from ${base}: ${text}`);
  }
  return await res.json();
};

export const addAppointment = async (appointment) => {
  const start = new Date(`${appointment.date}T${appointment.time}`);
  const end = new Date(`${appointment.date}T${appointment.endTime}`);

  const payload = {
    title: appointment.title,
    category: appointment.category,
    recurrence: appointment.recurrence,
    color: appointment.color || "#9575CD",
    utcStart: start.toISOString(),
    utcEnd: end.toISOString(),
    userId: appointment.userId
  };

  console.log("Adding appointment payload:", payload);

  const { res, base } = await fetchWithFallback("", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Add failed (${res.status}) from ${base}: ${text}`);
  }

  return await res.json();
};

export const updateAppointment = async (id, appointment) => {
  if (!id && id !== 0) throw new Error("id required");

  const start = new Date(`${appointment.date}T${appointment.time}`);
  const end = new Date(`${appointment.date}T${appointment.endTime}`);

  const payload = {
    title: appointment.title,
    category: appointment.category,
    recurrence: appointment.recurrence,
    color: appointment.color || "#9575CD",
    utcStart: start.toISOString(),
    utcEnd: end.toISOString(),
    userId: appointment.userId
  };

  console.log("Updating appointment payload:", payload);

  const { res, base } = await fetchWithFallback(`/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Update failed (${res.status}) from ${base}: ${text}`);
  }

  return await res.json();
};

export const deleteAppointment = async (id) => {
  if (!id && id !== 0) throw new Error("id required");
  const { res, base } = await fetchWithFallback(`/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Delete failed (${res.status}) from ${base}: ${text}`);
  }
  return true;
};
