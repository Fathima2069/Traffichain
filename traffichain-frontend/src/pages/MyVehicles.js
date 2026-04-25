import React, { useEffect, useState } from "react";
import axios from "axios";

function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const res = await axios.get(`http://localhost:8000/api/vehicles/${username}`);
        console.log("API Response:", res.data); // check keys from backend
        setVehicles(res.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    }

    if (username) fetchVehicles();
  }, [username]);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>My Vehicles</h2>
      {vehicles.length === 0 ? (
        <p>No vehicles registered</p>
      ) : (
        vehicles.map((v) => (
          <div
            key={v._id}
            style={{
              borderBottom: "1px solid #ccc",
              padding: "10px 0",
              marginBottom: "8px",
            }}
          >
            <p><strong>Number:</strong> {v.vehicleNumber || v.number}</p>
            <p><strong>Type:</strong> {v.vehicleType || v.type}</p>
            <p><strong>Owner:</strong> {v.ownerName || v.owner}</p>
            <p><strong>Place:</strong> {v.place}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyVehicles;