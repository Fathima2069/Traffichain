import React, { useState } from "react";
import axios from "axios";

function AddViolation() {

  const [form, setForm] = useState({
    vehicleNumber: "",
    location: "",
    description: "",
    image: null,
  });

  // ✅ HANDLE TEXT INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ HANDLE FILE INPUT
  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  // ✅ SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("vehicleNumber", form.vehicleNumber);
    data.append("location", form.location);
    data.append("description", form.description);
    data.append("image", form.image);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/violation",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message);

// 🚨 BLACKLIST ALERT
if (res.data.message.includes("BLACKLISTED")) {
  alert("🚨 ALERT! Vehicle is blacklisted!");
}
      // ✅ RESET FORM AFTER SUBMIT
      setForm({
        vehicleNumber: "",
        location: "",
        description: "",
        image: null,
      });

    } catch (error) {
      console.error(error);
      alert("Error adding violation");
    }
  };

  return (
    <div className="form-container">
      <h2>🚓 Add Violation</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="vehicleNumber"
          placeholder="Vehicle Number"
          value={form.vehicleNumber}
          onChange={handleChange}
          required
        />

        <input
          type="text"
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

        <input type="file" onChange={handleFileChange} />

        {/* 📷 IMAGE NAME */}
        {form.image && <p>📷 {form.image.name}</p>}

        <button type="submit" className="btn btn-pay">
          🚓 Submit Violation
        </button>

      </form>
    </div>
  );
}

export default AddViolation;