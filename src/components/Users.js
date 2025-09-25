import React, { useState, useEffect } from "react";
import AddUserModal from "./AddUserModal";
import { fetchUsers, addUser, deleteUser } from "../api/users";

const Users = ({ theme }) => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (user) => {
    try {
      const saved = await addUser(user);
      setUsers((prev) => [...prev, saved]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add user. Check console.");
    }
  };

  const handleDelete = async (id) => {
    const snapshot = [...users];
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeletingIds((prev) => [...prev, id]);
    try {
      await deleteUser(id);
      setDeletingIds((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
      setUsers(snapshot);
      setDeletingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const buttonStyle = {
    backgroundColor: theme.primary,
    color: theme.accent,
    border: "none",
    borderRadius: "6px",
    padding: "0.5rem 0.75rem",
    cursor: "pointer",
    marginBottom: "0.5rem",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h3 style={{ color: theme.primary }}>Users</h3>
        <button onClick={() => setShowModal(true)} style={buttonStyle}>+ Add User</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((user) => (
          <li
            key={user.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.5rem",
              marginBottom: "0.25rem",
              backgroundColor: theme.secondary,
              borderRadius: "4px",
              color: theme.accent,
            }}
          >
            <span>{user.name} ({user.email})</span>
            <button
              onClick={() => handleDelete(user.id)}
              disabled={deletingIds.includes(user.id)}
              style={{ ...buttonStyle, backgroundColor: "#d32f2f" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {showModal && (
        <AddUserModal onClose={() => setShowModal(false)} onSave={handleAddUser} theme={theme} />
      )}
    </div>
  );
};

export default Users;
