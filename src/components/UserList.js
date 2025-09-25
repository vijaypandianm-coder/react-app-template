import React from "react";

const UserList = ({ users, onDelete, deletingIds }) => {
  if (!users || users.length === 0) return <p>No users found</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {users.map(u => (
        <li key={u.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", alignItems: "center" }}>
          <span>{u.name} ({u.email})</span>
          <button
            disabled={deletingIds.includes(u.id)}
            onClick={() => onDelete(u.id)}
            style={{ background: "red", color: "#fff", border: "none", borderRadius: "4px", padding: "0.25rem 0.5rem", cursor: "pointer" }}
          >
            {deletingIds.includes(u.id) ? "..." : "Delete"}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
