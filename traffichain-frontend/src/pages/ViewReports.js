import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ Fetch reports
  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/reports");
      console.log(res.data);
      setReports(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Convert report to violation
  const convertToViolation = async (r) => {
    try {
      await axios.post("http://localhost:8000/api/violation", {
        vehicleNumber: r.vehicleNumber,
        location: r.location,
        description: r.description,
      });

      alert("🚓 Converted to Violation!");
    } catch (error) {
      console.error(error);
      alert("Error converting report");
    }
  };

  // ✅ Update status (FIXED)
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8000/api/report/status/${id}`, {
        status,
      });

      alert(`Report ${status}`);
      fetchReports(); // refresh UI
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "30px", background: "#f1f5f9", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>
        🚫 No Parking Reports
      </h2>

      {reports.length === 0 ? (
        <p>No reports found</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {reports.map((r) => (
            <div key={r._id} style={cardStyle}>
              <h3 style={{ color: "#1e293b" }}>🚗 {r.vehicleNumber}</h3>

              <p>📍 <b>{r.location}</b></p>
              <p>📝 {r.description}</p>

              <span style={statusStyle(r.status)}>
                {r.status || "Pending"}
              </span>

              {r.image && (
                <img
                  src={`http://localhost:8000/uploads/${r.image}`}
                  alt="report"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginTop: "10px",
                  }}
                />
              )}

              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                
                {/* ✅ FIXED BUTTONS */}
                <button
                  style={btnStyle("#22c55e")}
                  onClick={() => updateStatus(r._id, "Approved")}
                >
                  ✅ Approve
                </button>

                <button
                  style={btnStyle("#ef4444")}
                  onClick={() => updateStatus(r._id, "Rejected")}
                >
                  ❌ Reject
                </button>

                {/* OPTIONAL */}
                <button
                  style={btnStyle("#3b82f6")}
                  onClick={() => convertToViolation(r)}
                >
                  🚓 Convert
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 🎨 STYLES */
const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
};

const statusStyle = (status) => ({
  display: "inline-block",
  marginTop: "10px",
  padding: "5px 10px",
  borderRadius: "10px",
  color: "#fff",
  background:
    status === "Approved"
      ? "#22c55e"
      : status === "Rejected"
      ? "#ef4444"
      : "#f59e0b",
});

const btnStyle = (color) => ({
  flex: 1,
  padding: "8px",
  border: "none",
  borderRadius: "8px",
  background: color,
  color: "#fff",
  cursor: "pointer",
});

export default ViewReports;