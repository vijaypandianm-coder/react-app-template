import React, { useState } from "react";

const AddUserModal = ({ onClose, onSave, theme }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSave = () => {
    if (!name || !email) return alert("Please enter name and email");
    onSave({ name, email });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{
        backgroundColor: theme.background,
        padding: "2rem",
        borderRadius: "8px",
        minWidth: "300px",
      }}>
        <h3 style={{ color: theme.primary }}>Add User</h3>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <button onClick={onClose} style={{ padding: "0.5rem 1rem" }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: "0.5rem 1rem", backgroundColor: theme.primary, color: theme.accent }}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
