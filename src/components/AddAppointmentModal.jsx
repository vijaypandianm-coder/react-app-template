import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Categories and recurrences
const categories = ["Meeting", "Call", "Reminder", "Other"];
const recurrences = ["None", "Daily", "Weekly"];
const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

const AddAppointmentModal = ({ onClose, onSave, theme }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [startHour, setStartHour] = useState("09");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("10");
  const [endMinute, setEndMinute] = useState("00");
  const [category, setCategory] = useState(categories[0]);
  const [recurrence, setRecurrence] = useState(recurrences[0]);
  const [timeZoneId, setTimeZoneId] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const timeZones = Intl.supportedValuesOf("timeZone");

  const handleSubmit = () => {
    if (!title || !date || !startHour || !startMinute || !endHour || !endMinute) {
      alert("Please fill all required fields");
      return;
    }

    const start = new Date(date);
    start.setHours(Number(startHour), Number(startMinute));
    const end = new Date(date);
    end.setHours(Number(endHour), Number(endMinute));

    if (start >= end) {
      alert("End time must be after start time");
      return;
    }
    if (start < new Date()) {
      alert("Date/time cannot be in the past");
      return;
    }

    onSave({
      title,
      date: date.toISOString().split("T")[0],
      time: `${startHour}:${startMinute}`,
      endTime: `${endHour}:${endMinute}`,
      category,
      recurrence,
      timeZoneId,
    });
  };

  const inputStyle = {
    width: "100%",
    marginBottom: "0.8rem",
    padding: "0.5rem",
    borderRadius: "8px",
    border: `1px solid ${theme.primary}`,
    fontSize: "0.95rem",
    backgroundColor: theme.accent,
    color: theme.primary,
  };

  const labelStyle = {
    fontWeight: "500",
    marginBottom: "0.25rem",
    display: "block",
    color: theme.primary,
  };

  const timeContainer = {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "0.8rem",
    justifyContent: "space-between",
  };

  const selectWheelStyle = {
    flex: 1,
    padding: "0.5rem",
    borderRadius: "8px",
    border: `1px solid ${theme.primary}`,
    fontSize: "1rem",
    backgroundColor: theme.accent,
    color: theme.primary,
    textAlign: "center",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    overflowY: "scroll",
    height: "40px", // Only 1 value visible
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: theme.background,
          color: theme.primary,
          padding: "2rem",
          borderRadius: "12px",
          width: "380px",
          maxHeight: "90vh",
          overflowY: "auto",
          fontFamily: "'Poppins', sans-serif",
          boxShadow: `0 6px 20px rgba(0,0,0,0.3)`,
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "1rem", color: theme.primary }}>
          Add Appointment
        </h3>

        <label style={labelStyle}>Title</label>
        <input
          type="text"
          value={title}
          maxLength={25}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>Date</label>
        <DatePicker
          selected={date}
          onChange={(d) => setDate(d)}
          dateFormat="yyyy-MM-dd"
          calendarClassName="disprz-calendar"
          wrapperClassName="disprz-date-wrapper"
          style={inputStyle}
        />

        <label style={labelStyle}>Start Time</label>
        <div style={timeContainer}>
          <select
            value={startHour}
            onChange={(e) => setStartHour(e.target.value)}
            style={selectWheelStyle}
          >
            {hours.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          <select
            value={startMinute}
            onChange={(e) => setStartMinute(e.target.value)}
            style={selectWheelStyle}
          >
            {minutes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <label style={labelStyle}>End Time</label>
        <div style={timeContainer}>
          <select
            value={endHour}
            onChange={(e) => setEndHour(e.target.value)}
            style={selectWheelStyle}
          >
            {hours.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          <select
            value={endMinute}
            onChange={(e) => setEndMinute(e.target.value)}
            style={selectWheelStyle}
          >
            {minutes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <label style={labelStyle}>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <label style={labelStyle}>Recurrence</label>
        <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)} style={inputStyle}>
          {recurrences.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <label style={labelStyle}>Time Zone</label>
        <select value={timeZoneId} onChange={(e) => setTimeZoneId(e.target.value)} style={inputStyle}>
          {timeZones.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: `1px solid ${theme.primary}`,
              cursor: "pointer",
              background: theme.accent,
              color: theme.primary,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: theme.primary,
              color: theme.accent,
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
