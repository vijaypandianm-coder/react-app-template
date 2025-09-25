import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import AppointmentList from "./components/AppointmentList";
import AddAppointmentModal from "./components/AddAppointmentModal";
import OrbitLogo from "./components/OrbitLogo";
import Users from "./components/Users";
import { fetchAppointments, addAppointment, deleteAppointment } from "./api/appointments";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendarOverrides.css";
import "./darkTheme.css";

const themeLight = {
  primary: "#6A1B9A",
  secondary: "#D1C4E9",
  accent: "#FFFFFF",
  background: "#F3E5F5",
};

const themeDark = {
  primary: "#1A1A1A",
  secondary: "#333333",
  accent: "#FFFFFF",
  background: "#121212",
};

const localizer = momentLocalizer(moment);

// Toolbar for calendar
const CustomToolbar = ({ label, onNavigate, onView }) => (
  <div className="rbc-toolbar">
    <div className="rbc-toolbar-navigation">
      <button onClick={() => onNavigate("PREV")}>{"<"}</button>
      <button onClick={() => onNavigate("TODAY")}>Today</button>
      <button onClick={() => onNavigate("NEXT")}>{">"}</button>
    </div>
    <div className="rbc-toolbar-label">{label}</div>
    <div className="rbc-toolbar-view">
      <button onClick={() => onView("day")}>Day</button>
      <button onClick={() => onView("week")}>Week</button>
      <button onClick={() => onView("month")}>Month</button>
    </div>
  </div>
);

const CalendarApp = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState("day");
  const [currentPanel, setCurrentPanel] = useState("appointments");

  const theme = darkMode ? themeDark : themeLight;

  const parseDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    const [hour, minute] = timeStr.split(":").map(Number);
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day, hour, minute, 0);
  };

  const loadAppointments = async () => {
    try {
      const data = await fetchAppointments();
      if (!data) return;
      const enriched = data.map((app) => ({
        ...app,
        id: app.Id ?? app.id,
        start: parseDateTime(app.Date, app.Time),
        end: parseDateTime(app.Date, app.EndTime),
        title: app.Title,
        category: app.Category || "Other",
        color: theme.primary,
        timeZoneId: app.TimeZoneId,
      }));
      setAppointments(enriched);
      setEvents(
        enriched.map((app) => ({
          id: app.id,
          title: app.title,
          start: app.start,
          end: app.end,
          category: app.category,
          color: app.color,
        }))
      );
    } catch (err) {
      console.error(err);
      setAppointments([]);
      setEvents([]);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleAddAppointment = async (appointment) => {
    try {
      const saved = await addAppointment(appointment);
      const start = parseDateTime(saved.Date, saved.Time);
      const end = parseDateTime(saved.Date, saved.EndTime);
      const newApp = {
        ...saved,
        id: saved.Id ?? saved.id,
        start,
        end,
        title: saved.Title,
        category: saved.Category || "Other",
        color: theme.primary,
        timeZoneId: saved.TimeZoneId,
      };
      setAppointments((prev) => [...prev, newApp]);
      setEvents((prev) => [
        ...prev,
        {
          id: newApp.id,
          title: newApp.title,
          start: newApp.start,
          end: newApp.end,
          category: newApp.category,
          color: newApp.color,
        },
      ]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add appointment. See console.");
    }
  };

  const handleDelete = async (id) => {
    const snapshot = [...appointments];
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDeletingIds((prev) => [...prev, id]);
    try {
      await deleteAppointment(id);
      setDeletingIds((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
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
      setDeletingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const buttonBoxStyle = {
    backgroundColor: theme.primary,
    color: theme.accent,
    border: "none",
    borderRadius: "6px",
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: 600,
    minWidth: "60px",
    textAlign: "center",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: theme.background,
        fontFamily: "'Montserrat', sans-serif",
        color: theme.accent,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: theme.primary,
          color: theme.accent,
          padding: "0.5rem 1rem",
        }}
      >
        <button
          onClick={() => setSidebarVisible(!sidebarVisible)}
          style={{
            background: "transparent",
            border: "none",
            color: theme.accent,
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
        <div style={{ display: "flex", alignItems: "center" }}>
          <OrbitLogo />
          <span style={{ marginLeft: "1rem" }}>{user.email}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        {sidebarVisible && (
          <div
            style={{
              width: "20%",
              borderRight: `2px solid ${theme.secondary}`,
              padding: "1rem",
              overflowY: "auto",
              background: theme.secondary,
            }}
          >
            <h3 style={{ color: theme.primary }}>Menu</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button
                onClick={() => setCurrentPanel("appointments")}
                style={{
                  ...buttonBoxStyle,
                  backgroundColor: currentPanel === "appointments" ? theme.primary : "#ccc",
                  color: currentPanel === "appointments" ? theme.accent : "#000",
                }}
              >
                Appointments
              </button>
              <button
                onClick={() => setCurrentPanel("users")}
                style={{
                  ...buttonBoxStyle,
                  backgroundColor: currentPanel === "users" ? theme.primary : "#ccc",
                  color: currentPanel === "users" ? theme.accent : "#000",
                }}
              >
                Users
              </button>
            </div>

            {currentPanel === "appointments" && (
              <>
                <h3 style={{ color: theme.primary, marginTop: "1rem" }}>Upcoming Appointments</h3>
                <AppointmentList
                  appointments={appointments}
                  onDelete={handleDelete}
                  deletingIds={deletingIds}
                />
              </>
            )}
          </div>
        )}

        {/* Main Panel */}
        <div style={{ flexGrow: 1, padding: "1rem", position: "relative" }}>
          {currentPanel === "appointments" ? (
            <>
              <div
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <button onClick={() => setDarkMode(!darkMode)} style={buttonBoxStyle}>
                  DARK
                </button>
                <button onClick={() => setShowModal(true)} style={buttonBoxStyle} title="Add appointment">
                  +
                </button>
              </div>

              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="day"
                views={["day", "week", "month"]}
                onView={(view) => setCurrentView(view)}
                step={60}
                timeslots={1}
                min={new Date(1970, 1, 1, 0, 0, 0)}
                max={new Date(1970, 1, 1, 23, 59, 59)}
                components={{ toolbar: CustomToolbar }}
                className={darkMode ? "disprz-calendar dark-calendar" : "disprz-calendar"}
                style={{
                  height: "100%",
                  borderRadius: "8px",
                  backgroundColor: darkMode ? "#1A1A1A" : "#FFFFFF",
                  color: darkMode ? "#FFFFFF" : "#000000",
                }}
              />

              {showModal && (
                <AddAppointmentModal
                  onClose={() => setShowModal(false)}
                  onSave={handleAddAppointment}
                  theme={theme}
                />
              )}
            </>
          ) : (
            <Users theme={theme} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;
