import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

function AdminDashboard() {

  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, revenue: 0 });
  const [violations, setViolations] = useState([]);
  const [reports, setReports] = useState([]);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [form, setForm] = useState({
    vehicleNumber: "",
    location: "",
    description: "",
    fineAmount: "",
    image: null
  });

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const isDark = theme === "dark";

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  /* FETCH */
  const fetchData = async () => {
    const s = await axios.get("http://localhost:8000/api/stats");
    const v = await axios.get("http://localhost:8000/api/violations");
    const r = await axios.get("http://localhost:8000/api/reports");

    setStats(s.data);
    setViolations(v.data);
    setReports(r.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* UPDATE STATUS */
  const handleUpdate = async (id, status) => {
    await axios.put(`http://localhost:8000/api/violations/${id}`, { status });
    fetchData();
  };

  /* ADD VIOLATION */
  const addViolation = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));

    await axios.post("http://localhost:8000/api/violation", fd);

    alert("Violation Added ✅");

    setForm({
      vehicleNumber: "",
      location: "",
      description: "",
      fineAmount: "",
      image: null
    });

    fetchData();
  };

  const barData = [
    { name: "Total", value: stats.total },
    { name: "Paid", value: stats.paid },
    { name: "Pending", value: stats.pending },
  ];

  const pieData = [
    { name: "Paid", value: stats.paid },
    { name: "Pending", value: stats.pending },
  ];

  const COLORS = ["#22c55e", "#f59e0b"];

  return (
    <div style={{
      ...styles.container,
      background: isDark ? "#0f172a" : "#f1f5f9",
      color: isDark ? "#fff" : "#000"
    }}>

      {/* THEME BUTTON */}
      <button onClick={toggleTheme} style={styles.toggle}>
        {isDark ? "🌙" : "☀️"}
      </button>

      <h1 style={styles.title}>🚦 Admin Dashboard</h1>

      {/* TABS */}
      <div style={styles.tabs}>
        {["dashboard", "add", "reports"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              ...styles.tab,
              background: activeTab === t ? "#22c55e" : "#334155"
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <>
          {/* STATS */}
          <div style={styles.grid}>
            <Stat title="Total" value={stats.total} />
            <Stat title="Revenue" value={`₹${stats.revenue}`} />
            <Stat title="Paid" value={stats.paid} />
            <Stat title="Pending" value={stats.pending} />
          </div>

          {/* VIOLATIONS */}
          <div style={{ marginTop: "20px" }}>
            {violations.map((v) => (
              <div key={v._id} style={styles.card}>
                <div>
                  <h3>🚗 {v.vehicleNumber}</h3>
                  <p>📍 {v.location}</p>
                  <p>💰 ₹{v.fineAmount}</p>
                </div>

                <select
                  value={v.status}
                  onChange={(e) => handleUpdate(v._id, e.target.value)}
                  style={styles.select}
                >
                  <option>Pending</option>
                  <option>Paid</option>
                </select>
              </div>
            ))}
          </div>

          {/* CHARTS */}
          <div style={styles.chartGrid}>
            <ChartBox title="Violations" data={barData} type="bar" />
            <ChartBox title="Status" data={pieData} type="pie" colors={COLORS} />
          </div>
        </>
      )}

      {/* ADD VIOLATION */}
      {activeTab === "add" && (
        <form onSubmit={addViolation} style={styles.form}>
          <h2>➕ Add Violation</h2>

          <input placeholder="Vehicle Number"
            value={form.vehicleNumber}
            onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} />

          <input placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} />

          <input placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <input placeholder="Fine Amount"
            value={form.fineAmount}
            onChange={(e) => setForm({ ...form, fineAmount: e.target.value })} />

          <input
            type="file"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />

          <button style={styles.addBtn}>Add Violation</button>
        </form>
      )}

      {/* REPORTS */}
      {activeTab === "reports" && (
        <div style={styles.reportGrid}>
          {reports.map((r) => (
            <div key={r._id} style={styles.reportCard}>

              <div style={styles.imageBox}>
                {r.image && (
                  <img
                    src={`http://localhost:8000/uploads/${r.image}`}
                    alt=""
                    style={styles.reportImg}
                  />
                )}
              </div>

              <div style={styles.reportBody}>
                <h3 style={styles.vehicle}>
  🚗 {r.vehicleNumber || r.vehicle || "N/A"}
</h3>

<p style={styles.info}>
  📍 {r.location || r.place || "N/A"}
</p>

<p style={styles.desc}>
  📝 {r.description || r.desc || "No description"}
</p>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

/* COMPONENTS */
const Stat = ({ title, value }) => (
  <div style={styles.stat}>
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

const ChartBox = ({ title, data, type, colors }) => (
  <div style={styles.chartCard}>
    <h3>{title}</h3>
    <ResponsiveContainer width="100%" height={250}>
      {type === "bar" ? (
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#60a5fa" />
        </BarChart>
      ) : (
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={80} label>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Pie>
        </PieChart>
      )}
    </ResponsiveContainer>
  </div>
);

/* STYLES (MODERN UI) */
const styles = {
  container: { padding: "30px", minHeight: "100vh" },

  title: { textAlign: "center", marginBottom: "10px" },

  toggle: {
    position: "fixed",
    top: 20,
    right: 20,
    padding: "10px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
  },

  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    margin: "20px"
  },

  tab: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: "20px"
  },

  stat: {
    padding: "20px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    textAlign: "center"
  },

  card: {
    padding: "15px",
    borderRadius: "12px",
    marginTop: "10px",
    background: "#fff",
    color: "#000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "400px",
    margin: "auto"
  },

  addBtn: {
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px"
  },

  select: {
    padding: "6px",
    borderRadius: "6px"
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: "20px",
    marginTop: "30px"
  },

  chartCard: {
    background: "rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "12px"
  },

  /* REPORT UI */
  reportGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: "20px"
  },

  reportCard: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    transition: "0.3s",
  },

  imageBox: {
    width: "100%",
    height: "180px",
    overflow: "hidden",
  },

  reportImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  reportBody: {
    padding: "12px",
  },

  vehicle: {
    margin: "5px 0",
    fontWeight: "bold",
  },

  info: {
    fontSize: "14px",
    opacity: 0.8,
  },

  desc: {
    fontSize: "13px",
    marginTop: "5px",
  }
};

export default AdminDashboard;