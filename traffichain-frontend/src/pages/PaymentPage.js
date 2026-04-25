import React, { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react"; // <- updated import
import { useLocation, useNavigate } from "react-router-dom";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [violation, setViolation] = useState(null);

  useEffect(() => {
    if (location.state && location.state.violation) {
      setViolation(location.state.violation);
    } else {
      navigate("/user-dashboard"); // redirect if no violation passed
    }
  }, [location, navigate]);

  const handleConfirmPayment = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/violation/pay/${violation._id}`
      );
      alert("Payment successful!");
      navigate("/user-dashboard"); // go back to dashboard
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    }
  };

  if (!violation) return null;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💳 Pay Fine</h2>
      <div style={styles.card}>
        {violation.image && (
          <img
            src={`http://localhost:8000/uploads/${violation.image}`}
            alt="violation"
            style={styles.image}
          />
        )}
        <p><strong>Vehicle:</strong> {violation.vehicleNumber}</p>
        <p><strong>Description:</strong> {violation.description}</p>
        <p><strong>Status:</strong> {violation.status}</p>

        <h3 style={{ marginTop: "20px" }}>Scan QR to Pay</h3>
        <QRCodeSVG
          value={`https://payment-portal.com/pay/${violation._id}`} // replace with actual payment link
          size={200}
        />

        <button
          style={{ ...styles.button, backgroundColor: "#2563eb", marginTop: "20px" }}
          onClick={handleConfirmPayment}
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif", textAlign: "center" },
  title: { marginBottom: "20px" },
  card: {
    display: "inline-block",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    maxWidth: "300px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  button: { padding: "10px 15px", borderRadius: "5px", border: "none", color: "#fff", cursor: "pointer" },
};

export default PaymentPage;