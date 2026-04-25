import React, { useState } from "react";
import NoParkingReport from "./NoParkingReport";
import ViewReports from "./ViewReports";

function ReportsPage() {
  const [tab, setTab] = useState("form");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{ width: "220px", background: "#1e293b", color: "#fff", padding: "20px" }}>
        <h2>Menu</h2>

        <p onClick={() => setTab("form")} style={{ cursor: "pointer", padding: "10px" }}>
          📝 Report Form
        </p>

        <p onClick={() => setTab("view")} style={{ cursor: "pointer", padding: "10px" }}>
          👮 View Violations
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "30px", background: "#f1f5f9" }}>
        {tab === "form" && <NoParkingReport />}
        {tab === "view" && <ViewReports />}
      </div>
    </div>
  );
}

export default ReportsPage;