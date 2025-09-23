import React, { useState, useEffect } from "react";
import { getAppointments } from "../api/appointments";
import TimeSlotGrid from "./TimeSlotGrid";
import AppointmentList from "./AppointmentList";
import AppointmentForm from "./AppointmentForm";

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchAppointments = async () => {
    const data = await getAppointments(date.toISOString().split("T")[0]);
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, [date]);

  const prevDay = () => setDate(new Date(date.setDate(date.getDate() - 1)));
  const nextDay = () => setDate(new Date(date.setDate(date.getDate() + 1)));

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevDay}>&lt;</button>
        <h2>{date.toDateString()}</h2>
        <button onClick={nextDay}>&gt;</button>
        <button onClick={() => setShowForm(true)}>+</button>
      </div>
      <TimeSlotGrid appointments={appointments} />
      <AppointmentList appointments={appointments} />
      {showForm && (
        <AppointmentForm
          date={date}
          onClose={() => { setShowForm(false); fetchAppointments(); }}
        />
      )}
    </div>
  );
};

export default Calendar;
