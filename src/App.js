// App.js
import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import LoginPage from "./components/LoginPage";
import AddAppointmentModal from "./components/AddAppointmentModal";
import OrbitLogo from "./components/OrbitLogo";

import {
  fetchAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  setAuthToken,
} from "./api/appointments";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendarOverrides.css";
import "./darkTheme.css";

const localizer = momentLocalizer(moment);

const App = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null); // for 3-dot menus

  const themeLight = {
    primary: "#6A1B9A",
    secondary: "#F8F6FC",
    accent: "#1A1A1A",
    background: "#F3E5F5",
    cardBg: "#FFFFFF",
    scrollbarThumb: "#B39DDB",
    scrollbarTrack: "#EDE7F6",
  };

  const themeDark = {
    primary: "#8E24AA",
    secondary: "#1F1F1F",
    accent: "#FFFFFF",
    background: "#121212",
    cardBg: "#2C2C2C",
    scrollbarThumb: "#6A1B9A",
    scrollbarTrack: "#2A2A2A",
  };

  const theme = darkMode ? themeDark : themeLight;
  const dropdownRef = useRef();

  // Fetch appointments from backend
  const loadAppointments = async () => {
    if (!user) return;
    try {
      const data = await fetchAppointments();

      const now = new Date();
      const futureAppointments = data.filter((app) => {
        const start = new Date(`${app.Date}T${app.Time}`);
        return start >= now;
      });

      const enriched = futureAppointments
        .map((app) => {
          const start = new Date(`${app.Date}T${app.Time}`);
          const end = new Date(`${app.Date}T${app.EndTime}`);
          if (isNaN(start) || isNaN(end)) return null;

          return {
            id: app.Id,
            title: app.Title,
            start,
            end,
            category: app.Category,
            recurrence: app.Recurrence,
            color: app.Color || theme.primary,
            userId: app.UserId,
            timezone: app.TimeZoneId || Intl.DateTimeFormat().resolvedOptions().timeZone,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.start - b.start);

      setAppointments(enriched);
      setEvents(
        enriched.map((a) => ({
          id: a.id,
          title: a.title,
          start: a.start,
          end: a.end,
          category: a.category,
          color: a.color,
        }))
      );
    } catch (err) {
      console.error("Load failed", err);
      alert("Failed to load appointments.");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [darkMode, user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
      if (!e.target.closest(".menu-container")) {
        setOpenMenuId(null); // close 3-dot menus if clicked outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddOrUpdateAppointment = async (appointment, isUpdate) => {
    try {
      let newApp;
      if (isUpdate) {
        newApp = await updateAppointment(appointment.id, appointment);
        setAppointments((prev) =>
          prev.map((a) => (a.id === appointment.id ? newApp : a))
        );
      } else {
        newApp = await addAppointment(appointment);
        setAppointments((prev) => [...prev, newApp]);
      }

      const start = new Date(`${newApp.Date}T${newApp.Time}`);
      const end = new Date(`${newApp.Date}T${newApp.EndTime}`);

      setEvents((prev) => {
        const filtered = prev.filter((e) => e.id !== newApp.id);
        return [
          ...filtered,
          {
            id: newApp.id,
            title: newApp.Title,
            start,
            end,
            category: newApp.Category,
            color: newApp.Color || theme.primary,
          },
        ];
      });

      setShowModal(false);
      setEditingAppointment(null);
    } catch (err) {
      console.error(err);
      alert("Save failed: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    const snapshot = [...appointments];
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setEvents((prev) => prev.filter((e) => e.id !== id));
    try {
      await deleteAppointment(id);
    } catch (err) {
      alert("Delete failed");
      setAppointments(snapshot);
      setEvents(
        snapshot.map((a) => ({
          id: a.id,
          title: a.title,
          start: a.start,
          end: a.end,
          category: a.category,
          color: a.color,
        }))
      );
    }
  };

  if (!user) {
    return (
      <LoginPage
        onLoginSuccess={(data) => {
          setUser(data);
          setAuthToken(data.token);
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: theme.background,
        color: theme.accent,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: theme.primary,
          padding: "0.5rem 1rem",
        }}
      >
        <OrbitLogo />
        <div ref={dropdownRef} style={{ position: "relative", cursor: "pointer" }}>
          <span
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            style={{ fontWeight: 600 }}
          >
            {user.username} ▼
          </span>
          {showUserDropdown && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                background: theme.secondary,
                color: theme.accent,
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                marginTop: "0.25rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                zIndex: 100,
              }}
            >
              <div
                onClick={() => {
                  setUser(null);
                  setAuthToken(null);
                }}
                style={{ cursor: "pointer", fontWeight: 600 }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        {sidebarVisible && (
          <div
            style={{
              width: "22%",
              borderRight: `2px solid ${theme.secondary}`,
              padding: "1rem",
              background: theme.secondary,
              overflowY: "auto",
              height: "100%",
            }}
            className="custom-scrollbar"
          >
            <h3 style={{ color: theme.primary, marginBottom: "1rem" }}>
              Upcoming Appointments
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  style={{
                    background: theme.cardBg,
                    padding: "1rem",
                    borderRadius: "12px",
                    boxShadow:
                      "0 3px 6px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.2)",
                    transition: "all 0.3s ease",
                    position: "relative",
                  }}
                  className="menu-container"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 12px rgba(0,0,0,0.25), inset 0 2px 3px rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 3px 6px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.2)";
                  }}
                >
                  {/* Appointment Info */}
                  <h4 style={{ margin: 0, fontWeight: "600", color: theme.primary }}>
                    {appt.title}
                  </h4>
                  <p style={{ margin: "4px 0", fontSize: "0.9rem", color: theme.accent }}>
                    {moment(appt.start).format("MMMM D, YYYY")}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: theme.primary }}>
                    {moment(appt.start).format("hh:mm A")} -{" "}
                    {moment(appt.end).format("hh:mm A")}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: theme.accent }}>
                    {appt.timezone}
                  </p>

                  {/* 3-dot menu */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                      color: theme.primary,
                    }}
                    onClick={() =>
                      setOpenMenuId(openMenuId === appt.id ? null : appt.id)
                    }
                  >
                    ⋮
                  </div>
                  {openMenuId === appt.id && (
                    <div
                      style={{
                        position: "absolute",
                        top: "35px",
                        right: "10px",
                        background: theme.secondary,
                        borderRadius: "8px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        zIndex: 200,
                        padding: "0.5rem",
                        minWidth: "100px",
                      }}
                    >
                      <div
                        style={{
                          padding: "0.3rem 0.5rem",
                          cursor: "pointer",
                          color: theme.accent,
                          fontWeight: 500,
                        }}
                        onClick={() => {
                          setEditingAppointment(appt);
                          setShowModal(true);
                          setOpenMenuId(null);
                        }}
                      >
                        Update
                      </div>
                      <div
                        style={{
                          padding: "0.3rem 0.5rem",
                          cursor: "pointer",
                          color: "red",
                          fontWeight: 500,
                        }}
                        onClick={() => {
                          handleDelete(appt.id);
                          setOpenMenuId(null);
                        }}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar */}
        <div style={{ flexGrow: 1, padding: "1rem", position: "relative" }}>
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
            }}
          >
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: "0.5rem 1rem",
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: "6px",
                border: "none",
                background: theme.secondary,
                color: theme.accent,
              }}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={() => {
                setEditingAppointment(null);
                setShowModal(true);
              }}
              style={{
                padding: "0.5rem 1rem",
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: "6px",
                border: "none",
                background: theme.primary,
                color: theme.accent,
              }}
            >
              + Add Appointment
            </button>
          </div>

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="day"
            views={["day", "week", "month"]}
            step={60}
            timeslots={1}
            style={{
              height: "80vh",
              borderRadius: "8px",
              backgroundColor: darkMode ? "#1A1A1A" : "#FFFFFF",
              color: darkMode ? "#FFFFFF" : "#000000",
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.color,
                color: theme.accent,
                borderRadius: "6px",
                padding: "2px",
                border: "none",
              },
            })}
          />

          {showModal && (
            <AddAppointmentModal
              onClose={() => {
                setShowModal(false);
                setEditingAppointment(null);
              }}
              onSave={handleAddOrUpdateAppointment}
              appointment={editingAppointment}
              theme={theme}
              user={user}
            />
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme.scrollbarTrack};
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: ${theme.scrollbarThumb};
          border-radius: 8px;
          border: 2px solid ${theme.scrollbarTrack};
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: ${darkMode ? "#9C27B0" : "#7E57C2"};
        }
      `}</style>
    </div>
  );
};

export default App;
