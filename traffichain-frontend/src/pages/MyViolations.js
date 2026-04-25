import QRCode from "qrcode.react";
import axios from "axios";
import { useState } from "react";

function MyViolations({ violations, setViolations }) {
  const [selected, setSelected] = useState(null);

  const handlePay = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/violation/pay/${id}`);
      
      // update UI
      setViolations(prev =>
        prev.map(v =>
          v._id === id ? { ...v, status: "Paid" } : v
        )
      );

      alert("Payment successful ✅");
      setSelected(null);

    } catch (err) {
      console.log(err);
      alert("Payment failed ❌");
    }
  };

  return (
    <div>
      <h2>My Violations</h2>

      {violations.map(v => (
        <div key={v._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          
          <p>🚗 {v.vehicleNumber}</p>
          <p>💰 ₹{v.fineAmount}</p>
          <p>Status: {v.status}</p>

          {v.status !== "Paid" && (
            <button onClick={() => setSelected(v)}>
              💳 Pay Now
            </button>
          )}
        </div>
      ))}

      {/* QR CODE POPUP */}
      {selected && (
        <div style={{ marginTop: "20px", padding: "20px", border: "2px solid black" }}>
          
          <h3>Scan to Pay ₹{selected.fineAmount}</h3>

          <QRCode
            value={`upi://pay?pa=pathu@okaxis=TraffiChain&am=${selected.fineAmount}&cu=INR`}
            size={200}
          />

          <br /><br />

          <button onClick={() => handlePay(selected._id)}>
            ✅ I Paid
          </button>

          <button onClick={() => setSelected(null)}>
            ❌ Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default MyViolations;