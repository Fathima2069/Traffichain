import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewViolations() {
  const [violations, setViolations] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/violations");
      setViolations(res.data);
    } catch (err) {
      console.error("Error fetching violations:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this violation?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/violation/${id}`);
      alert("Violation deleted");
      fetchViolations();
    } catch (err) {
      console.error(err);
      alert("Error deleting violation");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:8000/api/violation/status/${id}`, { status });
      alert("Status updated!");
      fetchViolations();
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🚦 Violations</h2>

      {violations.length === 0 ? (
        <p style={styles.noData}>No violations found</p>
      ) : (
        <div style={styles.list}>
          {violations.map((v) => (
            <div key={v._id} style={styles.card}>
              
              {/* Image */}
              {v.image && (
                <img
                  src={`http://localhost:8000/uploads/${v.image}`}
                  alt="violation"
                  style={styles.image}
                />
              )}

              {/* Details */}
              <div style={styles.details}>
                <p><strong>Vehicle:</strong> {v.vehicleNumber}</p>
                <p><strong>Description:</strong> {v.description}</p>
                <p><strong>Status:</strong> {v.status}</p>

                {v.isBlacklisted && (
                  <p style={styles.blacklist}>🚫 Blacklisted</p>
                )}
              </div>

              {/* 📍 MAP (FIXED - inside map loop) */}
              {v.location && (
                <div style={{ marginTop: "10px" }}>
                  <h4>📍 Location</h4>

                  <iframe
                    title="violation-location"
                    width="100%"
                    height="200"
                    loading="lazy"
                    style={{ border: 0, borderRadius: "8px" }}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      v.location
                    )}&z=15&output=embed`}
                  />
                </div>
              )}

              {/* Police actions */}
              {role === "police" && (
                <div style={styles.actions}>
                  <select
                    style={{ ...styles.select, marginRight: "10px" }}
                    value={v.status}
                    onChange={(e) =>
                      handleStatusChange(v._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  <button
                    style={{ ...styles.button, backgroundColor: "#dc2626" }}
                    onClick={() => handleDelete(v._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  title: { textAlign: "center", marginBottom: "20px" },
  noData: { textAlign: "center", color: "#555" },
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  details: { fontSize: "14px", color: "#333" },
  blacklist: { color: "red", fontWeight: "bold" },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "10px",
    alignItems: "center",
  },
  button: {
    padding: "8px 12px",
    borderRadius: "5px",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  select: {
    padding: "6px 10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
};

export default ViewViolations;