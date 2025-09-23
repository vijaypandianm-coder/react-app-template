import React from "react";
import { Plus } from "lucide-react";

const CalendarHeader = ({ selectedDate, onPrev, onNext, onAdd }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
      <div>
        <button onClick={onPrev}>← Prev</button>
        <span style={{ margin: "0 1rem" }}>{selectedDate.toDateString()}</span>
        <button onClick={onNext}>Next →</button>
      </div>
      <button
        onClick={onAdd}
        style={{
          backgroundColor: "#007bff",
          border: "none",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "50%",
          cursor: "pointer",
        }}
      >
        <Plus />
      </button>
    </div>
  );
};

export default CalendarHeader;
