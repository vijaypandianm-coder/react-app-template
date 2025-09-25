// src/components/OrbitLogo.js
import React from "react";

const OrbitLogo = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#6A1B9A", // primary theme color
        borderRadius: "6px",
        padding: "0.25rem 0.5rem",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "4px",
          background:
            "linear-gradient(135deg, #A8D0E6 0%, #9575CD 100%)", // gradient for orbit effect
          marginRight: "0.5rem",
        }}
      ></div>

      {/* Text */}
      <span
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#FFFFFF",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        ORBIT
      </span>
    </div>
  );
};

export default OrbitLogo;
