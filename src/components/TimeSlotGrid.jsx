import React from "react";

const TimeSlotGrid = ({ appointments }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div style={{ display: "grid", gridTemplateRows: "repeat(24, 1fr)", height: "calc(100vh - 100px)", border: "1px solid #ddd" }}>
      {hours.map((h) => (
        <div key={h} style={{ borderBottom: "1px solid #eee", padding: "0.25rem 0.5rem" }}>
          <strong>{h}:00</strong>
          {appointments
            .filter(app => parseInt(app.time.split(":")[0], 10) === h)
            .map(app => (
              <div key={app.id} style={{ background: app.color || "#007bff", color: "#fff", margin: "2px 0", padding: "2px 4px", borderRadius: "3px" }}>
                {app.title} ({app.category})
              </div>
            ))
          }
        </div>
      ))}
    </div>
  );
};

export default TimeSlotGrid;
