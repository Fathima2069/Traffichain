import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

function UserDashboard() {
  const BASE = "http://localhost:8000";
  const username = localStorage.getItem("username");

  const [activeTab, setActiveTab] = useState("violations");
  const [reports, setReports] = useState([]);
  const [violations, setViolations] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [vehicle, setVehicle] = useState({
    vehicleNumber: "",
    vehicleType: "",
  });

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const isDark = theme === "dark";

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const themeStyles = {
    background: isDark
      ? "linear-gradient(135deg,#0f172a,#1e3a8a)"
      : "linear-gradient(135deg,#e0f2fe,#ffffff)",
    text: isDark ? "#fff" : "#000",
    card: isDark ? "#1e293b" : "#fff",
  };

  /* FETCH */
  const fetchAll = async () => {
    const r = await axios.get(`${BASE}/api/reports/${username}`);
    const v = await axios.get(`${BASE}/api/violations/${username}`);
    const ve = await axios.get(`${BASE}/api/vehicles/${username}`);

    setReports(r.data);
    setViolations(v.data);
    setVehicles(ve.data);
  };

  useEffect(() => {
    fetchAll();

    socket.on("newViolation", (d) => alert(d.message));
    socket.on("paymentSuccess", (d) => alert(d.message));

    return () => {
      socket.off("newViolation");
      socket.off("paymentSuccess");
    };
  }, []);

  /* PAYMENT */
  const confirmPayment = async (id) => {
    await axios.put(`${BASE}/api/violation/pay/${id}`);
    alert("Payment Successful");
    fetchAll();
  };

  /* ADD VEHICLE */
  const addVehicle = async (e) => {
    e.preventDefault();
    await axios.post(`${BASE}/api/vehicles`, { ...vehicle, username });
    setVehicle({ vehicleNumber: "", vehicleType: "" });
    fetchAll();
  };

  return (
    <div style={{ ...styles.container, background: themeStyles.background, color: themeStyles.text }}>

      {/* THEME BUTTON */}
      <button style={styles.toggleBtn} onClick={toggleTheme}>
        {isDark ? "🌙" : "☀️"}
      </button>

      <h1 style={{ textAlign: "center" }}>👤 User Dashboard</h1>

      {/* TABS */}
      <div style={styles.tabs}>
        {["violations", "reports", "vehicles"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              background: activeTab === tab ? "#22c55e" : "#334155",
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* VIOLATIONS */}
      {activeTab === "violations" && (
        <div style={styles.grid}>
          {violations.map((v) => (
            <div
              key={v._id}
              style={{ ...styles.card, background: themeStyles.card }}
              className="card-hover"
            >
              {v.image && (
                <img src={`${BASE}/uploads/${v.image}`} style={styles.img} />
              )}

              <h3>🚗 {v.vehicleNumber}</h3>
              <p>📍 {v.location}</p>
              <p>{v.description}</p>

              {/* GOOGLE MAP 📍 */}
              {v.location && (
                <iframe
                  title="map"
                  width="100%"
                  height="160"
                  style={{ border: 0, borderRadius: "10px" }}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    v.location
                  )}&z=15&output=embed`}
                />
              )}

              <span style={styles.status}>{v.status}</span>

              {v.status !== "Paid" && (
                <button onClick={() => confirmPayment(v._id)} style={styles.payBtn}>
                  Pay Fine
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* REPORTS */}
      {activeTab === "reports" && (
        <div style={styles.grid}>
          {reports.map((r) => (
  <div key={r._id} style={styles.reportCard}>

    <div style={styles.imageBox}>
      {r.image ? (
        <img
          src={`http://localhost:8000/uploads/${r.image}`}
          alt="report"
          style={styles.reportImg}
        />
      ) : (
        <div style={styles.noImage}>No Image</div>
      )}
    </div>

    <div style={styles.reportBody}>
      <h3 style={styles.vehicle}>🚗 {r.vehicleNumber || "N/A"}</h3>

      <p style={styles.info}>📍 {r.location || "N/A"}</p>

      <p style={styles.desc}>📝 {r.description || "No description"}</p>

      <span style={{
        ...styles.status,
        background:
          r.status === "Approved"
            ? "#22c55e"
            : r.status === "Rejected"
            ? "#ef4444"
            : "#f59e0b"
      }}>
        {r.status}
      </span>
    </div>

  </div>
))}

      {/* VEHICLES */}
      {activeTab === "vehicles" && (
        <>
          <form onSubmit={addVehicle} style={styles.form}>
            <input
              placeholder="Vehicle Number"
              value={vehicle.vehicleNumber}
              onChange={(e) =>
                setVehicle({ ...vehicle, vehicleNumber: e.target.value })
              }
            />
            <input
              placeholder="Vehicle Type"
              value={vehicle.vehicleType}
              onChange={(e) =>
                setVehicle({ ...vehicle, vehicleType: e.target.value })
              }
            />
            <button style={styles.addBtn}>Add</button>
          </form>

          <div style={styles.grid}>
            {vehicles.map((v) => (
              <div key={v._id} style={{ ...styles.card, background: themeStyles.card }}>
                🚗 {v.vehicleNumber} ({v.vehicleType})
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  container: { padding: "30px", minHeight: "100vh" },

  toggleBtn: {
    position: "fixed",
    top: 20,
    right: 20,
    padding: "10px",
    borderRadius: "50%",
    border: "none",
  },

  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    margin: "20px",
  },

  tab: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
    gap: "20px",
  },

  card: {
    padding: "15px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    transition: "0.3s",
  },

  img: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  status: {
    padding: "5px 10px",
    background: "#64748b",
    color: "#fff",
    borderRadius: "10px",
    display: "inline-block",
    marginTop: "10px",
  },

  payBtn: {
    marginTop: "10px",
    background: "#2563eb",
    color: "#fff",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
  },

  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  addBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
  },
};

export default UserDashboard;