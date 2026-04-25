import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        username: form.username,
        password: form.password,
        role: form.role,
      });

      localStorage.setItem("username", res.data.username);
      localStorage.setItem("role", res.data.role);

      alert("Login successful ✅");

      if (res.data.role === "admin") window.location.href = "/admin";
      else if (res.data.role === "police") window.location.href = "/police";
      else window.location.href = "/user";

    } catch (err) {
      alert("Login failed ❌");
    }
  };

  console.log("Saved username:", localStorage.getItem("username"));
  
  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>🚦 TraffiChain</h1>
        <p style={subtitle}>Smart Traffic Management System</p>

        <form onSubmit={handleSubmit} style={formStyle}>
          
          <div style={inputBox}>
            <span>👤</span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              style={input}
            />
          </div>

          <div style={inputBox}>
            <span>🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={input}
            />
          </div>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={select}
          >
            <option value="user">👤 User</option>
            <option value="police">👮 Police</option>
            <option value="admin">🛠 Admin</option>
          </select>

          <button type="submit" style={button}>
            🚀 Login
          </button>
        </form>
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
};

const card = {
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(15px)",
  padding: "40px",
  borderRadius: "15px",
  width: "320px",
  textAlign: "center",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
};

const title = {
  marginBottom: "5px",
};

const subtitle = {
  fontSize: "14px",
  marginBottom: "20px",
  color: "#cbd5f5",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const inputBox = {
  display: "flex",
  alignItems: "center",
  background: "#fff",
  borderRadius: "8px",
  padding: "5px 10px",
};

const input = {
  border: "none",
  outline: "none",
  flex: 1,
  padding: "10px",
};

const select = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
};

const button = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(135deg, #2563eb, #1e40af)",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s",
};

export default Login;