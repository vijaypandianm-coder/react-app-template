const BASE_CANDIDATES = [
  "https://localhost:7200/api/appointments",
  "http://localhost:5200/api/appointments"
];

// Helper to try multiple API bases
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

// Fetch all appointments
export const fetchAppointments = async () => {
  const { res, base } = await fetchWithFallback("", { method: "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed (${res.status}) from ${base}: ${text}`);
  }
  return await res.json();
};

// Add appointment
export const addAppointment = async (appointment) => {
  const formatTime = (t) => t.length === 5 ? t + ":00" : t;
  const payload = {
    title: appointment.title,
    date: appointment.date,
    time: formatTime(appointment.time),
    endTime: formatTime(appointment.endTime),
    category: appointment.category,
    recurrence: appointment.recurrence,
    color: appointment.color || null,
    timeZoneOffsetMinutes: new Date().getTimezoneOffset()
  };

  const { res, base } = await fetchWithFallback("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Add failed (${res.status}) from ${base}: ${text}`);
  }

  return await res.json().catch(() => true);
};

// Delete appointment
export const deleteAppointment = async (id) => {
  if (!id && id !== 0) throw new Error("id required");
  const { res, base } = await fetchWithFallback(`/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Delete failed (${res.status}) from ${base}: ${text}`);
  }
  return true;
};
