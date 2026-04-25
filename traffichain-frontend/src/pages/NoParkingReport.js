import React, { useState } from "react";
import axios from "axios";

function NoParkingReport() {
  const [form, setForm] = useState({
    vehicleNumber: "",
    location: "",
    description: "",
    image: null,
  });

  // handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle file
  const handleFile = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("vehicleNumber", form.vehicleNumber);
    data.append("location", form.location);
    data.append("description", form.description);
    data.append("image", form.image);

    try {
      await axios.post("http://localhost:8000/api/reports", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Report submitted!");

      // clear form
      setForm({
        vehicleNumber: "",
        location: "",
        description: "",
        image: null,
      });

    } catch (err) {
      console.error(err);
      alert("❌ Error submitting report");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>🚫 No Parking Report</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        
        <input
          name="vehicleNumber"
          placeholder="Vehicle Number"
          value={form.vehicleNumber}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input type="file" onChange={handleFile} />

        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
}

export default NoParkingReport;