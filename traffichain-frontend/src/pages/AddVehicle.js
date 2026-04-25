import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddVehicle() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: "",
    ownerName: "",
    place: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const username = localStorage.getItem("username");
      if (!username) {
        alert("Please login first!");
        setLoading(false);
        return;
      }

      const res = await axios.post("http://localhost:8000/api/vehicles", {
        username,
        vehicleNumber: form.vehicleNumber,
        vehicleType: form.vehicleType,
        ownerName: form.ownerName,
        place: form.place,
      });

      alert(res.data.message || "Vehicle added successfully");

      // Reset form
      setForm({
        vehicleNumber: "",
        vehicleType: "",
        ownerName: "",
        place: "",
      });

      // Navigate to My Vehicles page
      navigate("/my-vehicles");

    } catch (err) {
      console.error(err.response || err.message);
      alert(err.response?.data?.message || "Error adding vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          name="vehicleNumber"
          placeholder="Vehicle Number"
          value={form.vehicleNumber}
          onChange={handleChange}
          required
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #aaa" }}
        />
        <input
          type="text"
          name="vehicleType"
          placeholder="Vehicle Type"
          value={form.vehicleType}
          onChange={handleChange}
          required
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #aaa" }}
        />
        <input
          type="text"
          name="ownerName"
          placeholder="Owner Name"
          value={form.ownerName}
          onChange={handleChange}
          required
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #aaa" }}
        />
        <input
          type="text"
          name="place"
          placeholder="Place"
          value={form.place}
          onChange={handleChange}
          required
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #aaa" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Adding..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
}

export default AddVehicle;