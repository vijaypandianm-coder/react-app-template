// AddAppointmentModal.js
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-timezone";

const categories = ["Meeting", "Call", "Reminder", "Other"];
const recurrences = ["None", "Daily", "Weekly"];
const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
const timezones = moment.tz.names(); // ✅ Full timezone list

const AddAppointmentModal = ({ onClose, onSave, appointment, theme, user }) => {
  const [title, setTitle] = useState(appointment?.title || "");
  const [date, setDate] = useState(appointment ? new Date(appointment.start) : new Date());
  const [startHour, setStartHour] = useState(
    appointment ? String(new Date(appointment.start).getHours()).padStart(2, "0") : "09"
  );
  const [startMinute, setStartMinute] = useState(
    appointment ? String(new Date(appointment.start).getMinutes()).padStart(2, "0") : "00"
  );
  const [endHour, setEndHour] = useState(
    appointment ? String(new Date(appointment.end).getHours()).padStart(2, "0") : "10"
  );
  const [endMinute, setEndMinute] = useState(
    appointment ? String(new Date(appointment.end).getMinutes()).padStart(2, "0") : "00"
  );
  const [category, setCategory] = useState(appointment?.category || categories[0]);
  const [recurrence, setRecurrence] = useState(appointment?.recurrence || recurrences[0]);
  const [timeZoneId, setTimeZoneId] = useState(
    appointment?.timeZoneId || moment.tz.guess()
  );

  const handleSubmit = () => {
    if (!title) {
      alert("Title required");
      return;
    }

    const start = moment.tz(
      `${moment(date).format("YYYY-MM-DD")} ${startHour}:${startMinute}`,
      "YYYY-MM-DD HH:mm",
      timeZoneId
    );

    const end = moment.tz(
      `${moment(date).format("YYYY-MM-DD")} ${endHour}:${endMinute}`,
      "YYYY-MM-DD HH:mm",
      timeZoneId
    );

    if (!start.isValid() || !end.isValid()) {
      alert("Invalid start or end time");
      return;
    }
    if (start.isSameOrAfter(end)) {
      alert("End time must be after start time");
      return;
    }

    const payload = {
      id: appointment?.id || 0,
      title: title.trim(),
      category,
      recurrence,
      color: appointment?.color || "#9575CD",
      utcStart: start.toISOString(),
      utcEnd: end.toISOString(),
      timeZoneId,
      userId: user.id,
    };

    onSave(payload, !!appointment);
  };

  const inputStyle = {
    width: "100%",
    marginBottom: "0.8rem",
    padding: "0.5rem",
    borderRadius: "8px",
    border: `1px solid ${theme.primary}`,
    fontSize: "0.95rem",
    backgroundColor: theme.background, // ✅ fixed theme usage
    color: theme.accent,
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: theme.cardBg,
          padding: "1.5rem",
          borderRadius: "12px",
          width: "400px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        <h3 style={{ marginBottom: "1rem", color: theme.primary }}>
          {appointment ? "Update Appointment" : "Add Appointment"}
        </h3>

        {/* Title */}
        <input
          style={inputStyle}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Date */}
        <div style={{ marginBottom: "0.8rem" }}>
          <DatePicker
            selected={date}
            onChange={setDate}
            dateFormat="yyyy-MM-dd"
            className="react-datepicker-input"
            wrapperClassName="date-picker-wrapper"
          />
        </div>

        {/* Start time */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.8rem" }}>
          <select style={{ ...inputStyle, width: "50%" }} value={startHour} onChange={(e) => setStartHour(e.target.value)}>
            {hours.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
          <select style={{ ...inputStyle, width: "50%" }} value={startMinute} onChange={(e) => setStartMinute(e.target.value)}>
            {minutes.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* End time */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.8rem" }}>
          <select style={{ ...inputStyle, width: "50%" }} value={endHour} onChange={(e) => setEndHour(e.target.value)}>
            {hours.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
          <select style={{ ...inputStyle, width: "50%" }} value={endMinute} onChange={(e) => setEndMinute(e.target.value)}>
            {minutes.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Recurrence */}
        <select style={inputStyle} value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
          {recurrences.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        {/* Timezone */}
        <select style={inputStyle} value={timeZoneId} onChange={(e) => setTimeZoneId(e.target.value)}>
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              background: theme.secondary,
              color: theme.accent,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              background: theme.primary,
              color: theme.accent,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
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
