import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

/* 🔥 HOVER */
const handleHover = (e, enter) => {
  if (enter) {
    e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
    e.currentTarget.style.boxShadow = "0 20px 45px rgba(0,0,0,0.35)";
  } else {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
  }
};

function AdminDashboard() {

  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, revenue: 0 });
  const [reports, setReports] = useState([]);
  const [violations, setViolations] = useState([]); // ✅ NEW
  const [activeTab, setActiveTab] = useState("dashboard");

  const [form, setForm] = useState({
    vehicleNumber: "",
    location: "",
    description: "",
    fineAmount: "",
    image: null
  });

  /* FETCH */
  const fetchData = async () => {
    const s = await axios.get("http://localhost:8000/api/stats");
    const r = await axios.get("http://localhost:8000/api/reports");
    const v = await axios.get("http://localhost:8000/api/violations"); // ✅ NEW

    setStats(s.data);
    setReports(r.data);
    setViolations(v.data); // ✅ NEW
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this report?")) {
      await axios.delete(`http://localhost:8000/api/reports/${id}`);
      fetchData();
    }
  };

  /* ADD VIOLATION */
  const addViolation = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));

      await axios.post("http://localhost:8000/api/violation", fd);

      alert("✅ Violation Added");

      setForm({
        vehicleNumber: "",
        location: "",
        description: "",
        fineAmount: "",
        image: null
      });

      fetchData();

    } catch (err) {
      console.error(err);
      alert("❌ Error adding violation");
    }
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
    <div style={styles.container}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2>🚦 Admin</h2>
        <button style={styles.sideBtn}>🏠 Dashboard</button>
        <button style={styles.sideBtn}>📊 Reports</button>
        <button style={styles.sideBtn}>🚗 Violations</button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* TOPBAR */}
        <div style={styles.topbar}>
          <input placeholder="Search..." style={styles.search} />
          <div>🔔 👤</div>
        </div>

        {/* TABS */}
        <div style={styles.tabs}>
          {["dashboard", "add", "reports", "violations"].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={styles.tab}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <div style={styles.grid}>
              <Stat title="Total" value={stats.total} />
              <Stat title="Revenue" value={`₹${stats.revenue}`} />
              <Stat title="Paid" value={stats.paid} />
              <Stat title="Pending" value={stats.pending} />
            </div>

            <div style={styles.chartGrid}>
              <ChartBox title="Violations" data={barData} type="bar" />
              <ChartBox title="Status" data={pieData} type="pie" colors={COLORS} />
            </div>
          </>
        )}

        {/* ADD */}
        {activeTab === "add" && (
          <form onSubmit={addViolation} style={styles.form}>
            <h2>➕ Add Violation</h2>

            <input style={styles.input} placeholder="Vehicle Number"
              value={form.vehicleNumber}
              onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
            />

            <input style={styles.input} placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <input style={styles.input} placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <input style={styles.input} placeholder="Fine Amount"
              value={form.fineAmount}
              onChange={(e) => setForm({ ...form, fineAmount: e.target.value })}
            />

            <input type="file"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            />

            <button style={styles.addBtn}>Add Violation</button>
          </form>
        )}

        {/* REPORTS */}
        {activeTab === "reports" && (
          <div style={styles.reportGrid}>
            {reports.map((r) => (
              <div key={r._id} style={styles.card}
                onMouseEnter={(e) => handleHover(e, true)}
                onMouseLeave={(e) => handleHover(e, false)}
              >
                {r.image && (
                  <img src={`http://localhost:8000/uploads/${r.image}`} style={styles.reportImg} />
                )}

                <h3>🚗 {r.vehicleNumber}</h3>
                <p>📍 {r.location}</p>
                <p>📝 {r.description}</p>

                <a
                  href={`https://www.google.com/maps?q=${encodeURIComponent(r.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.mapBtn}
                >
                  📍 View Map
                </a>
              </div>
            ))}
          </div>
        )}

        {/* ✅ VIOLATIONS */}
        {activeTab === "violations" && (
          <div style={styles.reportGrid}>
            {violations.map((v) => (
              <div key={v._id} style={styles.card}
                onMouseEnter={(e) => handleHover(e, true)}
                onMouseLeave={(e) => handleHover(e, false)}
              >
                {v.image && (
                  <img src={`http://localhost:8000/uploads/${v.image}`} style={styles.reportImg} />
                )}

                <h3>🚗 {v.vehicleNumber}</h3>
                <p>📍 {v.location}</p>
                <p>💰 ₹{v.fineAmount}</p>

                <span style={{
                  ...styles.status,
                  background: v.status === "Paid" ? "#22c55e" : "#f59e0b"
                }}>
                  {v.status}
                </span>

                <a
                  href={`https://www.google.com/maps?q=${encodeURIComponent(v.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.mapBtn}
                >
                  🗺️ View Map
                </a>
              </div>
            ))}
          </div>
        )}

      </div>
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
          <Bar dataKey="value" fill="#a855f7" />
        </BarChart>
      ) : (
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={80}>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Pie>
        </PieChart>
      )}
    </ResponsiveContainer>
  </div>
);

/* STYLES */
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg,#1e1b4b,#312e81,#581c87)",
    color: "#fff"
  },
  sidebar: {
    width: "220px",
    padding: "20px",
    background: "rgba(0,0,0,0.3)"
  },
  sideBtn: {
    padding: "10px",
    background: "transparent",
    color: "#fff",
    border: "none"
  },
  main: { flex: 1, padding: "20px" },
  tabs: { display: "flex", gap: "10px", marginBottom: "20px" },
  tab: {
    padding: "10px",
    background: "#9333ea",
    color: "#fff",
    border: "none",
    borderRadius: "10px"
  },
  reportGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px"
  },
  card: {
    padding: "15px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)"
  },
  reportImg: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px"
  },
  status: {
    padding: "5px",
    borderRadius: "8px",
    display: "inline-block",
    marginTop: "8px"
  },
  mapBtn: {
    display: "block",
    marginTop: "10px",
    color: "#4ade80"
  }
};

export default AdminDashboard;