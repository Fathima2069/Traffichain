import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import NoParkingReport from "./pages/NoParkingReport";
import UserDashboard from "./pages/UserDashboard";
import PoliceDashboard from "./pages/PoliceDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddViolation from "./pages/AddViolation";
import ViewReports from "./pages/ViewReports";
import ReportsPage from "./pages/ReportsPage";
import ViewViolations from "./pages/ViewViolations";
import PaymentPage from "./pages/PaymentPage";
import AddVehicle from "./pages/AddVehicle";
import MyVehicles from "./pages/MyVehicles";

import "./styles/main.css";
import "./pages/AdminDashboard.css";
import Profile from "./pages/Profile";



function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        {/* Dashboards */}
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/police" element={<PoliceDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Features */}
        <Route path="/add-violation" element={<AddViolation />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/violations" element={<ViewViolations />} />
        <Route path="/report-no-parking" element={<NoParkingReport />} />
        <Route path="/view-reports" element={<ViewReports />} />
        <Route path="/pay/:id" element={<PaymentPage />} />

        {/* Vehicle Pages */}
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/my-vehicles" element={<MyVehicles />} />
      </Routes>
    </Router>
  );
}

export default App;