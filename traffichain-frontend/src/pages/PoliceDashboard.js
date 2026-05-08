import React, { useEffect, useState } from "react";
import axios from "axios";

function PoliceDashboard() {
  const BASE = "http://localhost:8000";

  const [activeTab, setActiveTab] = useState("violations");
  const [violations, setViolations] = useState([]);
  const [reports, setReports] = useState([]);
  const [blacklist, setBlacklist] = useState([]);

  const [search, setSearch] = useState("");

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const [form, setForm] = useState({
    vehicleNumber: "",
    location: "",
    description: "",
    fineAmount: "",
    image: null,
  });

  /* THEME */
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(theme === "dark" ? "light" : "dark");

  /* FETCH DATA */
  const fetchData = async () => {
    try {
      const v = await axios.get(`${BASE}/api/violations`);
      const r = await axios.get(`${BASE}/api/reports`);

      const vData = v.data || [];

      setViolations(vData);
      setReports(r.data || []);

      /* ⭐ BLACKLIST LOGIC */
      const countMap = {};

      vData.forEach((v) => {
        if (!v.vehicleNumber) return;

        const num = v.vehicleNumber.toUpperCase();
        countMap[num] = (countMap[num] || 0) + 1;
      });

      const blacklistedVehicles = Object.keys(countMap)
        .filter((num) => countMap[num] >= 3)
        .map((num) => ({
          vehicleNumber: num,
          count: countMap[num],
        }));

      setBlacklist(blacklistedVehicles);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ADD VIOLATION */
  const addViolation = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));

    await axios.post(`${BASE}/api/violation`, fd);

    alert("Violation Added");

    setForm({
      vehicleNumber: "",
      location: "",
      description: "",
      fineAmount: "",
      image: null,
    });

    fetchData();
    setActiveTab("violations");
  };

  /* FILTER */
  const filteredViolations = violations.filter((v) =>
    (v.vehicleNumber || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={styles[theme].container}>
      <div style={styles.layout}>

        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          <h2>🚔 POLICE</h2>

          {["violations", "reports", "blacklist", "add"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={styles.sideBtn(activeTab === tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}

          <button onClick={toggleTheme} style={styles.themeBtn}>
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        {/* MAIN */}
        <div style={styles.main}>

          {/* SEARCH */}
          <div style={styles.topbar}>
            <input
              placeholder="Search vehicle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.search}
            />
          </div>

          {/* VIOLATIONS */}
          {activeTab === "violations" && (
            <div style={styles.grid}>
              {filteredViolations.map((v) => (
                <div key={v._id} style={styles.card}>
                  <h3>🚗 {v.vehicleNumber}</h3>
                  <p>📍 {v.location}</p>
                  <p>{v.description}</p>

                  {v.image && (
                    <img
                      src={`${BASE}/uploads/${v.image}`}
                      style={styles.img}
                    />
                  )}

                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(
                      v.location
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.map}
                  >
                    📍 View Map
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* REPORTS */}
          {activeTab === "reports" && (
            <div style={styles.grid}>
              {reports.map((r) => (
                <div key={r._id} style={styles.card}>
                  <h3>🚗 {r.vehicleNumber}</h3>
                  <p>📍 {r.location}</p>
                  <p>{r.description}</p>

                  {r.image && (
                    <img
                      src={`${BASE}/uploads/${r.image}`}
                      style={styles.img}
                    />
                  )}

                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(
                      r.location
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.map}
                  >
                    📍 View Map
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* ⭐ BLACKLIST */}
          {activeTab === "blacklist" && (
            <div>
              <h2>🚫 Blacklisted Vehicles</h2>

              <div style={styles.grid}>
                {blacklist.length === 0 ? (
                  <p>No blacklisted vehicles</p>
                ) : (
                  blacklist.map((b, i) => (
                    <div key={i} style={styles.blackCard}>
                      🚫 {b.vehicleNumber}
                      <p>{b.count} Violations</p>
                      <b>Status: BLACKLISTED</b>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ADD VIOLATION */}
          {activeTab === "add" && (
            <form onSubmit={addViolation} style={styles.form}>
              <h2>Add Violation</h2>

              <input
                placeholder="Vehicle Number"
                value={form.vehicleNumber}
                onChange={(e) =>
                  setForm({ ...form, vehicleNumber: e.target.value })
                }
                style={styles.input}
              />

              <input
                placeholder="Location"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                style={styles.input}
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                style={styles.input}
              />

              <input
                placeholder="Fine Amount"
                value={form.fineAmount}
                onChange={(e) =>
                  setForm({ ...form, fineAmount: e.target.value })
                }
                style={styles.input}
              />

              <input
                type="file"
                onChange={(e) =>
                  setForm({ ...form, image: e.target.files[0] })
                }
              />

              <button type="submit" style={styles.btn}>
                ➕ Add Violation
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  dark: {
    container: {
      background: "#0f172a",
      color: "#fff",
      minHeight: "100vh",
    },
  },
  light: {
    container: {
      background: "#f1f5f9",
      color: "#000",
      minHeight: "100vh",
    },
  },

  layout: { display: "flex" },

  sidebar: {
    width: "220px",
    padding: "20px",
    background: "#111827",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  sideBtn: (active) => ({
    padding: "10px",
    background: active ? "#3b82f6" : "transparent",
    color: "#fff",
    border: "none",
  }),

  themeBtn: { marginTop: "20px", padding: "10px" },

  main: { flex: 1, padding: "20px" },

  topbar: { marginBottom: "20px" },

  search: { padding: "10px", width: "250px" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "15px",
  },

  card: {
    padding: "15px",
    background: "#1e293b",
    borderRadius: "12px",
  },

  blackCard: {
    padding: "15px",
    background: "#7f1d1d",
    borderRadius: "12px",
    color: "white",
  },

  img: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  map: {
    display: "block",
    marginTop: "10px",
    color: "#38bdf8",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "400px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
  },

  btn: {
    padding: "10px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  },
};

export default PoliceDashboard;