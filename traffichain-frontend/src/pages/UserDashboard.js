import React, { useEffect, useState } from "react"; 
import axios from "axios";
import socket from "../socket";
import html2canvas from "html2canvas";
import { FaCar, FaMapMarkerAlt, FaMoneyBillWave, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const BASE = "http://localhost:8000";
  const username = localStorage.getItem("username");

  const [activeTab, setActiveTab] = useState("violations");
  const [reports, setReports] = useState([]);
  const [violations, setViolations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    vehicleNumber: "",
    vehicleType: "",
    ownerName: "",
    model: "",
    color: "",
  });

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const isDark = theme === "dark";

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    console.log("Vehicles from API:", vehicles);
  }, [vehicles]);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const handleHover = (e, type) => {
    const card = e.currentTarget;
    const img = card.querySelector("img");

    if (type === "enter") {
      card.style.transform = "translateY(-10px) scale(1.02)";
      card.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
      if (img) img.style.transform = "scale(1.05)";
    } else {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
      if (img) img.style.transform = "scale(1)";
    }
  };

  const themeStyles = {
    background: isDark
      ? "radial-gradient(circle at 20% 20%, #1e293b, #020617)"
      : "radial-gradient(circle at 20% 20%, #e0f2fe, #ffffff)",
    text: isDark ? "#fff" : "#000",
  };

  const fetchAll = async () => {
    try {
      const r = await axios.get(`${BASE}/api/reports/${username}`);
      const v = await axios.get(`${BASE}/api/violations/${username}`);
      const ve = await axios.get(`${BASE}/api/vehicles/${username}`);

      setReports(r.data || []);
      setViolations(v.data || []);
      setVehicles(ve.data || []);
    } catch (err) {
      console.log(err);
    }
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

  const confirmPayment = async (id) => {
    await axios.put(`${BASE}/api/violation/pay/${id}`);
    alert("Payment Successful");
    fetchAll();
  };

  const addVehicle = async (e) => {
    e.preventDefault();

    await axios.post(`${BASE}/api/vehicles`, {
      ...vehicle,
      username,
    });

    setVehicle({
      vehicleNumber: "",
      vehicleType: "",
      ownerName: "",
      model: "",
      color: "",
    });

    fetchAll();
  };

  const downloadReceipt = async (id) => {
    const element = document.getElementById(`receipt-${id}`);

    if (!element) return alert("Receipt not found");

    const canvas = await html2canvas(element);

    const link = document.createElement("a");
    link.download = `receipt-${id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const [report, setReport] = useState({
  vehicleNumber: "",
  location: "",
  description: "",
  image: null,
});

const submitReport = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("vehicleNumber", report.vehicleNumber);
    formData.append("location", report.location);
    formData.append("description", report.description);
    formData.append("username", username);

    if (report.image) {
      formData.append("image", report.image);
    }

    await axios.post(`${BASE}/api/reports`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Report submitted successfully");

    setReport({
      vehicleNumber: "",
      location: "",
      description: "",
      image: null,
    });

  } catch (err) {
    console.log(err);
    alert("Error submitting report");
  }
};

  return (
  <div
    style={{
      ...styles.container,
      background: themeStyles.background,
      color: themeStyles.text,
    }}
  >
    {/* 👤 PROFILE BUTTON */}
    <button
      onClick={() => navigate("/profile")}
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        padding: "10px",
        borderRadius: "10px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      👤 Profile
    </button>

    {/* THEME BUTTON */}
    <button style={styles.toggleBtn} onClick={toggleTheme}>
      {isDark ? "🌙" : "☀️"}
    </button>

    <h1 style={styles.title}>👤 User Dashboard</h1>

    {/* TABS */}
    <div style={styles.tabs}>
      {["violations", "reports", "vehicles"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={styles.tab(activeTab === tab)}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
    
      {/* VIOLATIONS */}
{activeTab === "violations" && (
  <div style={styles.grid}>
    {violations.map((v) => {

      // 🔥 Match vehicle details
      const vehicleDetails = vehicles.find(
        (veh) =>
          veh.vehicleNumber?.toLowerCase() ===
          v.vehicleNumber?.toLowerCase()
      );

      return (
        <div
          key={v._id}
          style={styles.card}
          onMouseEnter={(e) => handleHover(e, "enter")}
          onMouseLeave={(e) => handleHover(e, "leave")}
        >

          {/* IMAGE */}
          {v.image ? (
            <img
              src={`${BASE}/uploads/${v.image}`}
              alt="violation"
              style={styles.img}
            />
          ) : (
            <div style={styles.noImg}>🚫 No Image</div>
          )}

          {/* BASIC INFO */}
          <h3>
            <FaCar /> {v.vehicleNumber}
          </h3>

          <p>
            <FaMapMarkerAlt /> {v.location}
          </p>

          <p>{v.description}</p>

          {/* 🔥 MAP BUTTON */}
          <a
  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    v.location
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  style={styles.mapBtn}
>
  📍 View on Map
</a>

<br /> {/* ✅ GAP ADDED HERE */}

<span
  style={{
    ...styles.status,
    background:
      v.status === "Paid" ? "#22c55e" : "#f59e0b",
  }}
>
  {v.status}
</span>


          {/* PAYMENT */}
          {v.status !== "Paid" && (
            <button
              onClick={() => confirmPayment(v._id)}
              style={styles.payBtn}
            >
              <FaMoneyBillWave /> Pay Fine
            </button>
          )}

          {/* RECEIPT */}
          {v.status === "Paid" && (
            <>
              <div id={`receipt-${v._id}`} style={styles.receipt}>
                <h3>🧾 Payment Receipt</h3>
                <p><b>Vehicle:</b> {v.vehicleNumber}</p>
                <p><b>Location:</b> {v.location}</p>
                <p><b>Amount:</b> ₹{v.fineAmount}</p>
                <p><b>Status:</b> Paid ✅</p>
              </div>

              <button
                onClick={() => downloadReceipt(v._id)}
                style={styles.downloadBtn}
              >
                <FaDownload /> Download Receipt
              </button>
            </>
          )}
        </div>
      );
    })}
  </div>
)}

      {/* REPORT FORM */}
{activeTab === "reports" && (
  <div style={styles.formCard}>
    <h2 style={{ marginBottom: "15px" }}>🚫 Non-Parking Report</h2>

    <form onSubmit={submitReport} style={styles.form}>
      
      <input
        type="text"
        placeholder="Vehicle Number"
        value={report.vehicleNumber}
        onChange={(e) =>
          setReport({ ...report, vehicleNumber: e.target.value })
        }
        required
      />

      <input
        type="text"
        placeholder="Location"
        value={report.location}
        onChange={(e) =>
          setReport({ ...report, location: e.target.value })
        }
        required
      />

      <textarea
        placeholder="Description"
        value={report.description}
        onChange={(e) =>
          setReport({ ...report, description: e.target.value })
        }
        rows="3"
        required
      />

      {/* IMAGE UPLOAD */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setReport({ ...report, image: e.target.files[0] })
        }
      />

      <button type="submit" style={styles.submitBtn}>
        📤 Submit Report
      </button>
    </form>
  </div>
)}

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

            <input
              placeholder="Owner Name"
              value={vehicle.ownerName}
              onChange={(e) =>
                setVehicle({ ...vehicle, ownerName: e.target.value })
              }
            />

            <input
              placeholder="Model"
              value={vehicle.model}
              onChange={(e) =>
                setVehicle({ ...vehicle, model: e.target.value })
              }
            />

            <input
              placeholder="Color"
              value={vehicle.color}
              onChange={(e) =>
                setVehicle({ ...vehicle, color: e.target.value })
              }
            />

            <button style={styles.addBtn}>Add Vehicle</button>
          </form>

          <div style={styles.grid}>
            {vehicles.map((v) => (
              <div key={v._id} style={styles.card}>
                <h3>🚗 {v.vehicleNumber}</h3>
                <p>Type: {v.vehicleType}</p>
                <p>Owner: {v.ownerName || "N/A"}</p>
                <p>Model: {v.model || "N/A"}</p>
                <p>Color: {v.color || "N/A"}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* STYLES */
/* STYLES */
const styles = {
  container: { padding: "30px", minHeight: "100vh" },

  title: { textAlign: "center" },

  toggleBtn: {
    position: "fixed",
    top: 20,
    right: 20,
    padding: "10px",
    borderRadius: "50%",
  },

  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    margin: "20px",
  },

  tab: (active) => ({
    padding: "10px 18px",
    borderRadius: "999px",
    background: active ? "#2563eb" : "rgba(255,255,255,0.1)",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  }),

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
    gap: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    padding: "16px",
    borderRadius: "20px",
  },

  img: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "12px",
  },

  noImg: {
    height: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  status: {
  display: "inline-block",
  marginTop: "12px", // ✅ increase gap
  padding: "5px 10px",
  borderRadius: "20px",
  background: "#64748b",
  color: "#fff",
},

  payBtn: {
    marginTop: "10px",
    background: "#2563eb",
    color: "#fff",
    padding: "8px",
    border: "none",
    borderRadius: "8px",
  },

  receipt: {
    marginTop: "10px",
    padding: "10px",
    background: "#fff",
    color: "#000",
    borderRadius: "10px",
  },

  downloadBtn: {
    marginTop: "8px",
    background: "#16a34a",
    color: "#fff",
    padding: "6px",
    border: "none",
    borderRadius: "6px",
  },

  addBtn: {
    background: "#22c55e",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  formCard: {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  submitBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  /* ✅ FIXED PART */
  mapBtn: {
  display: "inline-block",
  marginTop: "8px",
  marginBottom: "10px", // ✅ ADD THIS
  color: "#38bdf8",
  textDecoration: "none",
  fontSize: "14px",
},

  vehicleBox: {
    marginTop: "10px",
    padding: "10px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    fontSize: "13px",
  },
};

export default UserDashboard; 