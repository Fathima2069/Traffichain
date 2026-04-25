import React, { useEffect, useState } from "react";
import axios from "axios";

function PoliceDashboard() {
  const BASE = "http://localhost:8000";

  const [activeTab, setActiveTab] = useState("violations");
  const [violations, setViolations] = useState([]);
  const [reports, setReports] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const [form, setForm] = useState({
    vehicleNumber: "",
    location: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(theme === "dark" ? "light" : "dark");

  const fetchData = async () => {
    try {
      const v = await axios.get(`${BASE}/api/violations`);
      const r = await axios.get(`${BASE}/api/reports`);
      setViolations(v.data);
      setReports(r.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`${BASE}/api/violations/${id}`, { status });
    fetchData();
  };

  const deleteViolation = async (id) => {
    if (!window.confirm("Delete?")) return;
    await axios.delete(`${BASE}/api/violations/${id}`);
    fetchData();
  };

  const filtered = violations.filter((v) =>
    v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "" || v.status === statusFilter) &&
    (locationFilter === "" ||
      (v.location || "").toLowerCase().includes(locationFilter.toLowerCase()))
  );

  return (
    <div style={styles[theme].container}>

      <button onClick={toggleTheme} style={styles.toggle}>
        {theme === "dark" ? "🌙" : "☀️"}
      </button>

      <h1 style={styles.title}>👮 Police Dashboard</h1>

      {/* TABS */}
      <div style={styles.tabs}>
        {["violations", "reports", "add"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={styles.tab(activeTab === tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* FILTER */}
      {activeTab === "violations" && (
        <div style={styles.filter}>
          <input
            placeholder="Search Vehicle"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={styles.input}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.input}
          >
            <option value="">All</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Resolved</option>
          </select>
        </div>
      )}

      {/* VIOLATIONS */}
      {activeTab === "violations" && (
        <div style={styles.grid}>
          {filtered.map((v) => (
            <div key={v._id} style={styles.card(theme)}>

              {v.image && (
                <img
                  src={`${BASE}/uploads/${v.image}`}
                  alt=""
                  style={styles.img}
                />
              )}

              <h3>🚗 {v.vehicleNumber}</h3>
              <p>📍 {v.location}</p>
              <p>{v.description}</p>

              {/* 📍 MAP INSIDE CARD */}
              {v.location && (
                <div style={styles.mapBox}>
                  <iframe
                    title="map"
                    width="100%"
                    height="160"
                    loading="lazy"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      v.location
                    )}&z=15&output=embed`}
                  />
                </div>
              )}

              <select
                value={v.status}
                onChange={(e) => updateStatus(v._id, e.target.value)}
                style={styles.select(v.status)}
              >
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Resolved</option>
              </select>

              <button
                onClick={() => deleteViolation(v._id)}
                style={styles.delete}
              >
                ❌ Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* REPORTS */}
      {activeTab === "reports" && (
        <div style={styles.grid}>
          {reports.map((r) => (
            <div key={r._id} style={styles.card(theme)}>
              <h3>{r.vehicleNumber}</h3>
              <p>{r.location}</p>
              <p>{r.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* ADD */}
      {activeTab === "add" && (
        <form style={styles.form}>
          <input placeholder="Vehicle" />
          <input placeholder="Location" />
          <input placeholder="Description" />
          <input type="file" />
          <button style={styles.add}>Add</button>
        </form>
      )}
    </div>
  );
}

/* 🎨 MODERN UI */
const styles = {
  dark: {
    container: {
      padding: "30px",
      minHeight: "100vh",
      background: "#0f172a",
      color: "#fff",
    },
  },

  light: {
    container: {
      padding: "30px",
      minHeight: "100vh",
      background: "#f1f5f9",
      color: "#000",
    },
  },

  title: { textAlign: "center" },

  toggle: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "10px",
    borderRadius: "50%",
    border: "none",
  },

  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    margin: "20px 0",
  },

  tab: (active) => ({
    padding: "10px",
    background: active ? "#22c55e" : "#334155",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  }),

  filter: { display: "flex", gap: "10px" },

  input: { padding: "10px", borderRadius: "8px" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
    gap: "20px",
  },

  card: (theme) => ({
    background: theme === "dark" ? "#1e293b" : "#fff",
    color: theme === "dark" ? "#fff" : "#000",
    padding: "15px",
    borderRadius: "12px",
  }),

  img: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  mapBox: {
    marginTop: "10px",
    borderRadius: "10px",
    overflow: "hidden",
  },

  select: (status) => ({
    marginTop: "10px",
    padding: "8px",
    borderRadius: "6px",
    background:
      status === "Resolved"
        ? "#16a34a"
        : status === "Confirmed"
        ? "#2563eb"
        : "#f59e0b",
    color: "#fff",
  }),

  delete: {
    marginTop: "10px",
    background: "red",
    color: "#fff",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "400px",
    margin: "auto",
  },

  add: {
    background: "#2563eb",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
  },
};

export default PoliceDashboard;