import React from "react";

// Single dark purple color for all appointments
const appointmentColor = "#9575CD"; // dark purple
const hoverGradient = "linear-gradient(90deg, #9575CD, #6A1B9A)";

const AppointmentList = ({ appointments, onDelete, deletingIds }) => {
  if (!appointments || appointments.length === 0) return <p>No appointments</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {appointments.map((app) => {
        const start = new Date(app.start);
        const end = new Date(app.end);

        const startStr = start.toLocaleString([], { dateStyle: "short", timeStyle: "short" });
        const endStr = end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const tz = app.timeZoneId || "Local";

        return (
          <li
            key={app.id}
            style={{
              background: appointmentColor,
              marginBottom: "0.75rem",
              padding: "0.5rem",
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              opacity: deletingIds.includes(app.id) ? 0.5 : 1,
              transition: "transform 0.2s, background 0.3s",
              cursor: "pointer",
              color: "#fff", // text color consistent with dark background
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = hoverGradient;
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = appointmentColor;
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
            }}
          >
            <strong>{app.title}</strong>
            <br />
            <span style={{ fontSize: "0.9rem" }}>
              {startStr} – {endStr} ({tz})
            </span>
            <br />
            <small style={{ fontStyle: "italic" }}>{app.category}</small>
            <br />
            <button
              onClick={() => onDelete(app.id)}
              disabled={!app.id || deletingIds.includes(app.id)}
              style={{
                marginTop: "0.4rem",
                background: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "0.2rem 0.5rem",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              ✕
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default AppointmentList;
