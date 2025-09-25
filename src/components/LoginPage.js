import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://localhost:7200/api/users";

const LoginPage = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState("google");
  const [manualUsername, setManualUsername] = useState("");
  const [manualPassword, setManualPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleGoogleLogin = () => {
    onLoginSuccess({
      username: "Google User",
      token: "fake-google-token",
    });
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!manualUsername || !manualPassword) return alert("Fill all fields");
    try {
      const res = await axios.post(`${API_BASE}/login`, {
        username: manualUsername,
        password: manualPassword,
      });
      onLoginSuccess(res.data); 
    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return alert("Fill all fields");
    try {
      await axios.post(`${API_BASE}/register`, {
        username: newUsername,
        password: newPassword,
      });
      alert("User created! Please login.");
      setActiveTab("manual");
      setManualUsername(newUsername);
      setManualPassword("");
    } catch (err) {
      alert(err.response?.data || "User creation failed");
    }
  };

  const tabButtonStyle = (tab) => ({
    flex: 1,
    padding: "0.5rem",
    cursor: "pointer",
    fontWeight: 600,
    borderBottom: activeTab === tab ? "3px solid #6A1B9A" : "1px solid #ccc",
    background: "#fff",
    textAlign: "center",
  });

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    margin: "0.25rem 0 0.75rem 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    background: "#6A1B9A",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: 600,
    width: "100%",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#F3F3F3",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "2rem",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Login</h2>

        <div style={{ display: "flex", marginBottom: "1rem" }}>
          <div style={tabButtonStyle("google")} onClick={() => setActiveTab("google")}>Google</div>
          <div style={tabButtonStyle("manual")} onClick={() => setActiveTab("manual")}>Manual</div>
          <div style={tabButtonStyle("create")} onClick={() => setActiveTab("create")}>New User</div>
        </div>

        {activeTab === "google" && (
          <button
            onClick={handleGoogleLogin}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: "#4285F4",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 600,
              width: "100%",
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              alt="Google"
              style={{ width: "20px", height: "20px" }}
            />
            Login with Google
          </button>
        )}

        {activeTab === "manual" && (
          <form onSubmit={handleManualLogin}>
            <label>Username</label>
            <input
              type="text"
              value={manualUsername}
              onChange={(e) => setManualUsername(e.target.value)}
              style={inputStyle}
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={manualPassword}
              onChange={(e) => setManualPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" style={buttonStyle}>Login</button>
          </form>
        )}

        {activeTab === "create" && (
          <form onSubmit={handleCreateUser}>
            <label>Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              style={inputStyle}
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" style={buttonStyle}>Create Account</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
