import React from "react";

const AppointmentList = ({ appointments, onDelete, onUpdate, theme }) => {
  // Filter out nulls and past appointments
  const upcoming = appointments
    .filter(a => a && a.start instanceof Date && a.start.getTime() >= Date.now())
    .sort((a, b) => a.start - b.start);

  if (upcoming.length === 0) {
    return <p>No appointments available</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {upcoming.map(app => (
        <li
          key={app.id}
          style={{
            marginBottom: "0.8rem",
            padding: "0.5rem",
            background: theme.background,
            borderRadius: "8px",
            border: `1px solid ${theme.primary}`
          }}
        >
          <strong>{app.title}</strong>
          <br />
          {app.start.toLocaleString()} - {app.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => onUpdate(app)}
              style={{
                cursor: "pointer",
                padding: "0.3rem 0.5rem",
                background: theme.primary,
                color: "white",
                border: "none",
                borderRadius: "4px"
              }}
            >
              ✎ Update
            </button>
            <button
              onClick={() => onDelete(app.id)}
              style={{
                cursor: "pointer",
                padding: "0.3rem 0.5rem",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "4px"
              }}
            >
              🗑 Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default AppointmentList;
