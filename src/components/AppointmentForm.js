import React, { useState } from "react";

function AppointmentForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [category, setCategory] = useState("Meeting");
  const [recurrence, setRecurrence] = useState("None");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // simple frontend validation
    if (title.length > 25) {
      alert("Title cannot exceed 25 characters.");
      return;
    }

    if (!date || !time || !endTime) {
      alert("Please select date, start time and end time.");
      return;
    }

    if (endTime <= time) {
      alert("End Time must be after Start Time.");
      return;
    }

    const appointment = {
      title,
      date,
      time,
      endTime,
      category,
      recurrence,
      color: "#3b82f6", // default blue, you can randomize
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      onAdd(data);

      // reset form
      setTitle("");
      setDate("");
      setTime("");
      setEndTime("");
      setCategory("Meeting");
      setRecurrence("None");
    } catch (err) {
      console.error("Create failed:", err);
      alert(err.message || "Failed to create appointment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded space-y-3">
      <input
        type="text"
        placeholder="Title (max 25 chars)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={25}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <div className="flex gap-2">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 w-full rounded"
      >
        <option value="Meeting">Meeting</option>
        <option value="Call">Call</option>
        <option value="Reminder">Reminder</option>
        <option value="Other">Other</option>
      </select>
      <select
        value={recurrence}
        onChange={(e) => setRecurrence(e.target.value)}
        className="border p-2 w-full rounded"
      >
        <option value="None">None</option>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Appointment
      </button>
    </form>
  );
}

export default AppointmentForm;
