import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profilePic from "../assets/profile.jpg";

function Profile() {
  const navigate = useNavigate();

  // ✅ Load username from localStorage
  const username = localStorage.getItem("username") || "Fathima Mytheen";

  // ✅ Load saved image OR default
  const [image, setImage] = useState(
    localStorage.getItem("profileImage") || profilePic
  );

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ Handle image change + SAVE
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);

      // 🔥 Save image in localStorage
      localStorage.setItem("profileImage", imageURL);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* PROFILE IMAGE */}
        <div style={styles.imageWrapper}>
          <img src={image} alt="profile" style={styles.avatar} />

          {/* upload button */}
          <label style={styles.uploadBtn}>
            📷
            <input type="file" onChange={handleImageChange} hidden />
          </label>
        </div>

        {/* USERNAME */}
        <h2 style={styles.name}>{username}</h2>

        <p style={styles.subText}>👋 Welcome back</p>

        {/* EXTRA INFO */}
        <div style={styles.infoBox}>
          <p>🚗 Traffic Monitoring System User</p>
          <p>📍 Kerala, India</p>
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          style={styles.logoutBtn}
          onMouseEnter={(e) =>
            (e.target.style.background = "#dc2626")
          }
          onMouseLeave={(e) =>
            (e.target.style.background = "#ef4444")
          }
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
    fontFamily: "Arial",
  },

  card: {
    padding: "40px",
    borderRadius: "25px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
    textAlign: "center",
    width: "320px",
    color: "#fff",
    transition: "0.3s",
  },

  imageWrapper: {
    position: "relative",
    display: "inline-block",
  },

  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #60a5fa",
    marginBottom: "10px",
    transition: "0.3s",
  },

  uploadBtn: {
    position: "absolute",
    bottom: "10px",
    right: "5px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "50%",
    padding: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },

  name: {
    fontSize: "22px",
    fontWeight: "bold",
    margin: "10px 0",
  },

  subText: {
    color: "#cbd5e1",
    marginBottom: "10px",
  },

  infoBox: {
    fontSize: "13px",
    color: "#e2e8f0",
    marginBottom: "20px",
    lineHeight: "1.5",
  },

  logoutBtn: {
    background: "#ef4444",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold",
    transition: "0.3s",
  },
};

export default Profile; 