import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CalendarHeader from "./CalendarHeader";
import TimeSlotGrid from "./TimeSlotGrid";
import AddAppointmentModal from "./AddAppointmentModal";
import "./Dashboard.css";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAppointments, setShowAppointments] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");

  // Decode JWT to get username
  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsername(payload.sub);
    }
  }, [token]);

  // Fetch appointments for selected date
  const fetchAppointments = async (date = selectedDate) => {
    if (!token) return;
    try {
      const res = await axios.get(
        `https://localhost:7200/api/appointments?date=${date.toISOString().split("T")[0]}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  // Add new appointment
  const handleAddAppointment = async (appointment) => {
    if (!token) return;
    try {
      await axios.post(
        "https://localhost:7200/api/appointments",
        appointment,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments(selectedDate); // refresh
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data || err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const theme = {
    primary: "#333",
    accent: "#fff",
    background: "#f5f5f5",
  };

  return (
    <div className="dashboard">
      <div className="topbar">
        <button className="hamburger" onClick={() => setShowAppointments(!showAppointments)}>
          &#9776;
        </button>

        {username && (
          <div className="user-dropdown" ref={dropdownRef}>
            <button className="username-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {username}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="main-container">
        {showAppointments && (
          <div className="sidebar">
            <h2>Upcoming Appointments</h2>
            {appointments.length === 0 ? (
              <p>No upcoming appointments</p>
            ) : (
              <ul>
                {appointments.map((a) => (
                  <li key={a.id}>
                    <strong>{a.title}</strong>
                    <div>{a.date} {a.time}-{a.endTime}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="content">
          <CalendarHeader
            selectedDate={selectedDate}
            onPrev={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
            onNext={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
            onAdd={() => setShowModal(true)}
          />
          <TimeSlotGrid appointments={appointments} />
        </div>
      </div>

      {showModal && (
        <AddAppointmentModal
          onClose={() => setShowModal(false)}
          onSave={handleAddAppointment}
          theme={theme}
        />
      )}
    </div>
  );
}
