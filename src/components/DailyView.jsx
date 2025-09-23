// src/components/DailyView.jsx
import React, { useState, useEffect } from "react";
import { fetchAppointments, deleteAppointment } from "../api/appointments";
import AppointmentForm from "./AppointmentForm";
import "./DailyView.scss";

const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

export default function DailyView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Format date to yyyy-mm-dd for API
  const formatDate = (date) => date.toISOString().split("T")[0];

  // Load appointments whenever date changes
  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAppointments(formatDate(currentDate));
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, [currentDate]);

  // Navigation
  const prevDay = () => setCurrentDate((d) => new Date(d.setDate(d.getDate() - 1)));
  const nextDay = () => setCurrentDate((d) => new Date(d.setDate(d.getDate() + 1)));

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete appointment: " + err.message);
    }
  };

  return (
    <div className="daily-view">
      <header className="header">
        <button onClick={prevDay}>←</button>
        <h2>{currentDate.toDateString()}</h2>
        <button onClick={nextDay}>→</button>
      </header>

      <button className="add-btn" onClick={() => setShowForm(true)}>+</button>

      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="time-grid">
          {timeSlots.map((time) => {
            const appt = appointments.find((a) => a.time.startsWith(time));
            return (
              <div key={time} className="slot">
                <span className="time">{time}</span>
                {appt ? (
                  <div className="appointment">
                    <span>{appt.title}</span>
                    <button onClick={() => handleDelete(appt.id)}>🗑</button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <AppointmentForm
          date={formatDate(currentDate)}
          onClose={() => setShowForm(false)}
          onCreated={(newAppt) => setAppointments((prev) => [...prev, newAppt])}
        />
      )}
    </div>
  );
}
