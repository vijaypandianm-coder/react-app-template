import React, { useState, useEffect } from "react";
import CalendarHeader from "./components/CalendarHeader";
import TimeSlotGrid from "./components/TimeSlotGrid";

import AppointmentList from "./components/AppointmentList";
import AddAppointmentModal from "./components/AddAppointmentModal";
import { getAppointmentsByDate, createAppointment, deleteAppointment } from "./api/appointments";

const App = () => {
  // ⬅ State variables go here
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  // Function to fetch appointments for the selected date
  const fetchAppointments = async (date) => {
    try {
      const data = await getAppointmentsByDate(date.toISOString().split("T")[0]);
      setAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  const handleAddAppointment = async (appointment) => {
    try {
      await createAppointment(appointment);
      fetchAppointments(selectedDate);
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    await deleteAppointment(id);
    fetchAppointments(selectedDate);
  };

  return (
    <div className="app-container">
      <CalendarHeader
        selectedDate={selectedDate}
        onPrev={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
        onNext={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
        onAdd={() => setShowModal(true)}
      />

      <TimeSlotGrid appointments={appointments} />


      <AppointmentList appointments={appointments} onDelete={handleDelete} />

      {showModal && <AddAppointmentModal onClose={() => setShowModal(false)} onSave={handleAddAppointment} />}
    </div>
  );
};

export default App;
